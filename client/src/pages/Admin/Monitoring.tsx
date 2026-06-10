import { useState, useEffect, useRef } from "react"
import notifIcon from "../../assets/adminDasbord/Lonceng.svg"
import Trash from "../../assets/adminMonitor/Trash.svg";
import { API_URL } from "../../config/api";

/* ===================== DATA ===================== */

const PER_PAGE = 10
const STATUS_OPTIONS = ["Semua Status", "Lunas", "Belum Dibayar"]
type UnitType = {
  id: string
  unit: string
  idMeter: string
  konsumsi: string
  email: string
  waktu: string
  status: string
}

export default function Monitoring() {
  const [search,        setSearch]        = useState("")
  const [page,          setPage]          = useState(1)
  const [statusFilter,  setStatusFilter]  = useState("Semua Status")
  const [statusOpen,    setStatusOpen]    = useState(false)
  const statusRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] =
  useState<string | null>(null)
  const [allUnits, setAllUnits] =
  useState<UnitType[]>([])



  /* ---- filtered data ---- */
  const filtered =
  allUnits.filter((row) => {

    const matchSearch =

      row.unit
        .toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||

      row.idMeter
        .toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||

      row.email
        .toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||

      row.waktu
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )

    const matchStatus =
      statusFilter === "Semua Status" ||
      row.status === statusFilter

    return matchSearch && matchStatus

})

  /* ---- pagination ---- */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage   = Math.min(page, totalPages)
  const start      = (safePage - 1) * PER_PAGE
  const paginated  = filtered.slice(start, start + PER_PAGE)
  const goPage     = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)))

  const handleSearch  = (v: string) => { setSearch(v);        setPage(1) }

  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [showEditPopup, setShowEditPopup] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState<any>(null)
useEffect(() => {

  const handleClickOutside = (event: MouseEvent) => {
    if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
      setStatusOpen(false)
    }
  }

  document.addEventListener("click", handleClickOutside)

  return () => {
    document.removeEventListener("click", handleClickOutside)
  }
}, [])

useEffect(() => {

  const fetchUnits =
    async () => {

    try {

      const token =
        localStorage.getItem("token")

      const response =
        await fetch(
          `${API_URL}/admin/monitoring-units`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        )

      const result =
        await response.json()

      setAllUnits(result)

    } catch (error) {

      console.error(error)

    }

  }

  fetchUnits()

}, [])
  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">

      {/* ================= HEADER ================= */}
      <div className="flex items-start justify-between">

        {/* LEFT */}
        <div className="flex flex-col">
          <div className="w-[215px]">
            <p className="text-[24px] leading-[33px] font-normal text-[#98A2B3] tracking-[-0.02em]">
              Smart Water Meter
            </p>
            <h1 className="text-[32px] leading-[33px] font-medium text-[#344054] tracking-[-0.03em] mt-[2px]">
              Daftar Unit
            </h1>
          </div>


        </div>

        {/* PROFILE PILL */}
        <div className="w-[302px] h-[68px] rounded-full border border-[#EAECF0] bg-white px-[14px] flex items-center justify-between shadow-[0_1px_2px_rgba(16,24,40,0.05)] shrink-0">
          <div className="flex items-center gap-[14px]">
            <div className="w-[52px] h-[52px] rounded-full bg-[#F2F4F7] flex items-center justify-center">
              <img src={notifIcon} className="w-[24px] h-[24px] opacity-60" />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-[20px] leading-[22px] font-medium text-[#344054]">Hi, Admin</p>
              <p className="mt-[6px] text-[14px] leading-[22px] font-normal text-[#98A2B3]">Welcome to Aquora</p>
            </div>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-[18px] h-[18px] text-[#98A2B3]">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>

      </div>

      {/* ================= FILTER SECTION ================= */}
      <div className="flex items-center justify-between gap-6">

{/* SEARCH + STATUS FILTER */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
        <div className="flex-1 h-[50px] rounded-full border border-[#EAECF0] bg-white px-5 flex items-center gap-3 shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px] text-[#98A2B3] shrink-0">
            <circle cx="11" cy="11" r="7" /><path d="M20 20L17 17" />
          </svg>
          <input type="text" placeholder="Cari unit, penghuni, nomor meter, waktu..." value={search}
            onChange={e => handleSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-[14px] text-[#344054] placeholder:text-[#98A2B3]" />
          {search && (
            <button onClick={() => handleSearch("")} className="text-[#98A2B3] hover:text-[#344054] text-[18px] leading-none">×</button>
          )}
        </div>

        <div className="relative w-full sm:w-[220px]" ref={statusRef}>
          <button
            onClick={() => setStatusOpen((o) => !o)}
            className="w-full h-[50px] rounded-full border border-[#EAECF0] bg-white px-5 flex items-center justify-between gap-3 shadow-[0_1px_2px_rgba(16,24,40,0.05)] hover:bg-[#F9FAFB] transition"
          >
            <span className="text-[14px] text-[#344054]">{statusFilter}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-[16px] h-[16px] text-[#98A2B3] shrink-0 transition-transform ${statusOpen ? "rotate-180" : ""}`}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {statusOpen && (
            <div className="absolute right-0 top-[56px] w-full bg-white rounded-[16px] shadow-lg border border-[#EAECF0] p-1.5 z-50">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setStatusFilter(opt)
                    setStatusOpen(false)
                    setPage(1)
                  }}
                  className={`w-full text-left px-4 py-2.5 text-[13px] rounded-[12px] transition font-medium ${statusFilter === opt ? "bg-blue-50 text-blue-600" : "text-[#344054] hover:bg-[#F9FAFB]"}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
        </div>

      </div>

      {/* ================= TABLE ================= */}
      <div className="w-full bg-white rounded-[24px] border border-[#EEF2F6] overflow-hidden shadow-[0_1px_2px_rgba(16,24,40,0.04)]">

        {/* HEADER */}
      <div className="grid grid-cols-[1fr_1.4fr_1.6fr_1.4fr_1fr_60px] px-8 py-5 border-b border-[#F2F4F7]">
        <p className="text-[14px] font-medium text-[#98A2B3]">Unit</p>
        <p className="text-[14px] font-medium text-[#98A2B3]">ID Meter</p>
        <p className="text-[14px] font-medium text-[#98A2B3]">Email Penghuni</p>
        <p className="text-[14px] font-medium text-[#98A2B3]">Waktu</p>
        <p className="text-[14px] font-medium text-[#98A2B3]">Status</p>
        <div />
      </div>

        {/* BODY */}
        <div className="divide-y divide-[#F2F4F7]">
          {paginated.length > 0 ? paginated.map(row => (
            <div key={row.id}
              className="grid grid-cols-[1fr_1.4fr_1.6fr_1.4fr_1fr_60px] items-center px-8 py-6 hover:bg-[#F9FAFB] transition">
              <p className="text-[16px] font-medium text-[#344054]">{row.unit}</p>
              <p className="text-[16px] font-medium text-[#344054]">{row.idMeter}</p>
              <p className="text-[14px] font-normal text-[#98A2B3] truncate pr-4">{row.email}</p>
              <p className="text-[14px] font-normal text-[#98A2B3] truncate pr-4">{row.waktu}</p>
              <p className={`text-[13px] font-semibold px-3 py-1 rounded-full ${row.status === "Lunas" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-500 border border-rose-100"}`}>{row.status}</p>
       <button
  onClick={() =>
    setMenuOpen(menuOpen === row.id ? null : row.id)
  }
  className="flex items-center justify-center hover:opacity-60 transition relative"
>
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-[18px] h-[18px] text-[#98A2B3]"
  >
    <circle cx="5" cy="12" r="1.8" />
    <circle cx="12" cy="12" r="1.8" />
    <circle cx="19" cy="12" r="1.8" />
  </svg>

  {menuOpen === row.id && (

    <div className="absolute right-0 top-[28px] w-[160px] bg-white rounded-[12px] shadow-lg border border-[#EAECF0] p-1.5 z-50">

      {/* EDIT */}
      <button
        onClick={() => {
          setSelectedUnit(row)
          setShowEditPopup(true)
          setMenuOpen(null)
        }}
        className="w-full text-left px-3 py-2.5 text-[13px] rounded-[8px] text-[#344054] hover:bg-gray-50 transition font-medium"
      >
        Edit Unit
      </button>

      {/* DELETE */}
      <button
        onClick={() => {
          setSelectedUnit(row)
          setShowDeletePopup(true)
          setMenuOpen(null)
        }}
        className="w-full text-left px-3 py-2.5 text-[13px] rounded-[8px] text-red-600 hover:bg-red-50 transition font-medium"
      >
        Delete
      </button>

    </div>

  )}
</button>
       
            </div>
          )) : (
            <div className="px-8 py-12 text-center text-[14px] text-[#98A2B3]">
              Tidak ada data yang cocok
            </div>
          )}
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between px-8 py-5 border-t border-[#F2F4F7]">
          <p className="text-[14px] text-[#98A2B3] font-normal">
            Showing {filtered.length === 0 ? 0 : start + 1}–{Math.min(start + PER_PAGE, filtered.length)} of {filtered.length} entri
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => goPage(safePage - 1)} disabled={safePage === 1}
              className="w-[58px] h-[38px] rounded-[10px] border border-[#EAECF0] bg-white text-[14px] font-medium transition hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ color: safePage === 1 ? "#D0D5DD" : "#667085" }}>
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => goPage(p)}
                className="w-[38px] h-[38px] rounded-[10px] text-[14px] font-medium transition"
                style={p === safePage
                  ? { background: "linear-gradient(180deg, #3FACFF 0%, #0034FF 100%)", color: "#fff", boxShadow: "0 4px 14px rgba(0,52,255,0.25)" }
                  : { background: "#fff", color: "#667085", border: "1px solid #EAECF0" }}>
                {p}
              </button>
            ))}
            <button onClick={() => goPage(safePage + 1)} disabled={safePage === totalPages}
              className="w-[58px] h-[38px] rounded-[10px] border border-[#EAECF0] bg-white text-[14px] font-medium text-[#667085] transition hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>

      </div>
      {/* POPUP DELETE */}
{showDeletePopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">

    <div className="w-[272px] rounded-[16px] bg-white px-6 pt-6 pb-5 shadow-xl">

   <div className="flex justify-center">
  <img
    src={Trash}
    alt="trash"
    className="w-[72px] h-[72px] object-contain"
  />
</div>

      {/* TITLE */}
      <h2 className="mt-4 text-center text-[18px] font-semibold text-[#1B2340]">
        Hapus unit ini?
      </h2>

      {/* DESC */}
      <p className="mt-2 text-center text-[14px] leading-[22px] text-[#98A2B3]">
        Unit yang dihapus tidak dapat dikembalikan lagi.
      </p>

      {/* BUTTONS */}
      <div className="mt-6 flex items-center gap-3">

        {/* CANCEL */}
        <button
          onClick={() => setShowDeletePopup(false)}
          className="
            h-[40px]
            flex-1
            rounded-[34px]
            border
            border-[#D0D5DD]
            bg-white
            text-[14px]
            font-medium
            text-[#344054]
          "
        >
          Tidak
        </button>

        {/* DELETE */}
        <button
          onClick={() => {

            console.log("DELETE:", selectedUnit)

            setShowDeletePopup(false)

          }}
          className="
            h-[40px]
            flex-1
            rounded-[34px]
            text-[14px]
            font-medium
            text-white
          "
          style={{
            background:
              "radial-gradient(108.89% 108.89% at 50% 48.61%, #3FACFF 0%, #0034FF 100%)",
          }}
        >
          Ya
        </button>

      </div>

    </div>

  </div>
)}

{/* POPUP EDIT */}
{showEditPopup && selectedUnit && (

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">

    <div className="w-[420px] rounded-[20px] bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.08)] relative">

      {/* CLOSE */}
      <button
        onClick={() => setShowEditPopup(false)}
        className="absolute top-5 right-5 w-[28px] h-[28px] rounded-full bg-[#F2F4F7] flex items-center justify-center hover:opacity-70"
      >
        ✕
      </button>

      {/* TITLE */}
      <h2 className="text-[28px] font-semibold text-[#1B2340]">
        Edit Unit
      </h2>

      {/* FORM */}
      <div className="mt-7 flex flex-col gap-5">

        {/* UNIT */}
        <div>
          <label className="text-[14px] font-medium text-[#344054]">
            Pilih unit
          </label>

          <input
            defaultValue={selectedUnit.unit}
            className="
              mt-2
              h-[52px]
              w-full
              rounded-[12px]
              border
              border-[#D0D5DD]
              px-4
              text-[14px]
              outline-none
              focus:border-[#3FACFF]
            "
          />
        </div>

        {/* ID METER */}
        <div>
          <label className="text-[14px] font-medium text-[#344054]">
            ID Meter
          </label>

          <input
            defaultValue={selectedUnit.idMeter}
            className="
              mt-2
              h-[52px]
              w-full
              rounded-[12px]
              border
              border-[#D0D5DD]
              px-4
              text-[14px]
              outline-none
              focus:border-[#3FACFF]
            "
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-[14px] font-medium text-[#344054]">
            Email Penghuni
          </label>

          <input
            defaultValue={selectedUnit.email}
            className="
              mt-2
              h-[52px]
              w-full
              rounded-[12px]
              border
              border-[#D0D5DD]
              px-4
              text-[14px]
              outline-none
              focus:border-[#3FACFF]
            "
          />
        </div>

      </div>

      {/* BUTTON */}
      <button
        onClick={() => {

          console.log("UPDATE:", selectedUnit)

          setShowEditPopup(false)

        }}
        className="
          mt-7
          h-[48px]
          w-full
          rounded-[34px]
          text-[15px]
          font-medium
          text-white
          transition-all
          hover:opacity-95
          active:scale-[0.99]
        "
        style={{
          background:
            "radial-gradient(108.89% 108.89% at 50% 48.61%, #3FACFF 0%, #0034FF 100%)",
          boxShadow:
            "0px 4px 12px rgba(1, 101, 255, 0.25)",
        }}
      >
        Perbarui
      </button>

    </div>

  </div>

)}


    </div>
  )
}