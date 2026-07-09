import { FaArrowUpRightFromSquare, FaBuildingShield, FaDroplet } from "react-icons/fa6";

const availabilityUrl = "https://eraktkosh.mohfw.gov.in/eraktkoshPortal/#/publicPages/bloodAvailabilitySearch";

const CheckBloodBank = () => (
  <section className="bg-white py-20 sm:py-24">
    <div className="page-shell">
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-red-700 via-rose-700 to-slate-950 text-white shadow-2xl shadow-rose-200">
        <div className="grid gap-10 p-7 sm:p-10 lg:grid-cols-[1fr_0.8fr] lg:p-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold"><FaBuildingShield /> Government blood-bank network</span>
            <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-5xl">Check blood availability across India.</h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-rose-100 sm:text-lg sm:leading-8">
              Search live blood stock by state, district, blood group, component, and nearby registered blood centres using the Ministry of Health &amp; Family Welfare’s e-RaktKosh portal.
            </p>
            <a href={availabilityUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-black text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-50 sm:w-auto">
              Check blood-bank availability <FaArrowUpRightFromSquare />
            </a>
          </div>
          <div className="grid place-items-center">
            <div className="relative grid h-56 w-56 place-items-center rounded-full border border-white/20 bg-white/10 sm:h-64 sm:w-64">
              <div className="absolute inset-5 rounded-full border border-dashed border-white/30" />
              <FaDroplet className="text-7xl text-rose-200" />
              <span className="absolute bottom-10 rounded-full bg-slate-950/70 px-4 py-2 text-xs font-bold">Official external service</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CheckBloodBank;
