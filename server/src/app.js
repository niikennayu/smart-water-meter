import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import { responseHandler } from './middleware/responseHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.js';
import customerRoutes from './routes/customers.js';
import deviceRoutes from './routes/devices.js';
import iotRoutes from './routes/iot.js';
import dashboardRoutes from './routes/dashboard.js';
import billingRoutes from './routes/billing.js';
import paymentRoutes from './routes/payment.js';
import userRoutes from './routes/users.js';
import adminRoutes from "./routes/admin.js";


dotenv.config();

const app = express();

/*const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);
*/

app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}))
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(responseHandler);

app.use('/api/v1/payment', paymentRoutes);

app.use(responseHandler);

app.use('/api/users', userRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/devices', deviceRoutes);
app.use('/api/v1/iot', iotRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/billing', billingRoutes);
app.use('/api/v1/admin', adminRoutes);

// MANUAL DB SETUP ROUTE TO BYPASS HOSTINGER RESTRICTIONS
import { exec } from 'child_process';
import prisma from './config/db.js';
app.get('/api/v1/setup-db', (req, res) => {
  res.write('Starting database setup...\n');
  exec('npx prisma db push --accept-data-loss', async (error, stdout, stderr) => {
    if (error) {
      res.write('ERROR pushing schema: ' + error.message + '\n');
      return res.end();
    }
    res.write('Schema pushed successfully!\n');
    try {
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash('andi123', 10);
      await prisma.user.create({
        data: {
          name: 'Andi Hidayat',
          email: 'andi.hidayat96@gmail.com',
          password: hashedPassword,
          role: 'admin',
          customer_number: 'ADM-001'
        }
      });
      res.write('Admin user created successfully!\nSETUP COMPLETE!');
      res.end();
    } catch (e) {
      res.write('Admin user already exists or error: ' + e.message + '\nSETUP COMPLETE!');
      res.end();
    }
  });
});

// Konfigurasi untuk menyatukan Frontend Vite dan Backend Express saat Production
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Melayani file statis dari hasil build React/Vite (folder client/dist)
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Untuk semua rute yang BUKAN /api/*, kembalikan ke index.html Vite (SPA Routing)
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});
app.use(errorHandler);

export default app;