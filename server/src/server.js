import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import prisma from './config/db.js';

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const startServer = async () => {
    // Start Express server immediately so Hostinger Health Check passes!
    const server = app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║   Water Monitoring Backend Server      ║
╠════════════════════════════════════════╣
║  Environment: ${NODE_ENV.padEnd(30, ' ')} ║
║  Port: ${PORT.toString().padEnd(35, ' ')} ║
║  Status: Running                       ║
╚════════════════════════════════════════╝
      `);
    });

    // Test database connection AFTER server starts
    prisma.$queryRaw`SELECT 1`.then(async () => {
        console.log('✓ Database connection successful');
        
        // Run database migration asynchronously to avoid Hostinger 503 timeout
        console.log('Pushing database schema...');
        import('child_process').then(({ exec }) => {
          exec('npx prisma db push --accept-data-loss', async (error, stdout, stderr) => {
            if (error) {
              console.error('✗ Failed to push schema:', error);
              return;
            }
            console.log('✓ Schema pushed successfully!');
            
            // Auto-seed admin user since the database is brand new
            try {
              const bcrypt = await import('bcrypt');
              const adminEmail = 'andi.hidayat96@gmail.com';
              const existingAdmin = await prisma.user.findFirst({ where: { email: adminEmail } });
              if (!existingAdmin) {
                const hashedPassword = await bcrypt.hash('andi123', 10);
                await prisma.user.create({
                  data: {
                    name: 'Andi Hidayat',
                    email: adminEmail,
                    password: hashedPassword,
                    role: 'admin',
                    customer_number: 'ADM-001'
                  }
                });
                console.log('✓ Admin user auto-seeded successfully!');
              }
            } catch (seedErr) {
              console.error('✗ Failed to auto-seed admin:', seedErr);
            }
          });
        });
    }).catch((err) => {
        console.error('✗ Failed to connect to database:', err);
    });

    // Handle server shutdown gracefully
    process.on('SIGINT', async () => {
      console.log('\n[SHUTDOWN] Gracefully shutting down...');
      server.close(async () => {
        await prisma.$disconnect();
        console.log('[SHUTDOWN] Server and database connections closed');
        process.exit(0);
      });
    });

    process.on('SIGTERM', async () => {
      console.log('\n[SHUTDOWN] SIGTERM received');
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    });

    // Handle unhandled exceptions
    process.on('uncaughtException', (error) => {
      console.error('[UNCAUGHT EXCEPTION]', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('[UNHANDLED REJECTION]', {
        reason,
        promise
      });
      process.exit(1);
    });

};

startServer();
