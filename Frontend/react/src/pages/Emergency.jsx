import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft, FaChevronLeft, FaChevronRight, FaHospital,
  FaList, FaMagnifyingGlass, FaPenToSquare, FaPhone, FaTriangleExclamation,
} from "react-icons/fa6";
import { publicRequest } from "../requestMethods";

const initialForm = { patientName: "", hospital: "", bloodgroup: "", unitsRequired: "", date: "", contactNumber: "", urgency: "Urgent" };
const groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const pageSize = 8;

const Emergency = ({ initialTab = "view" }) => {
  const [tab, setTab] = useState(initialTab);
  const [requests, setRequests] = useState([]);
  const [filters, setFilters] = useState({ search: "", group: "All", urgency: "All" });
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ loading: true, submitting: false, error: "", success: "" });

  useEffect(() => {
    publicRequest.get("/emergencies")
      .then(({ data }) => setRequests(data))
      .catch(() => setStatus((current) => ({ ...current, error: "Could not load blood requests." })))
      .finally(() => setStatus((current) => ({ ...current, loading: false })));
  }, []);

  const filtered = useMemo(() => requests.filter((request) => {
    const term = filters.search.toLowerCase();
    const matchesSearch = !term || [request.patientName, request.hospital, request.contactNumber].some((value) => value?.toLowerCase().includes(term));
    return matchesSearch &&
      (filters.group === "All" || request.bloodgroup === filters.group) &&
      (filters.urgency === "All" || request.urgency === filters.urgency);
  }), [filters, requests]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  const changeFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  };

  const submit = async (event) => {
    event.preventDefault();
    setStatus((current) => ({ ...current, submitting: true, error: "", success: "" }));
    try {
      const { data } = await publicRequest.post("/emergencies", form);
      setRequests((current) => [data, ...current]);
      setForm(initialForm);
      setStatus((current) => ({ ...current, submitting: false, success: "Blood request published. Approved matching donors will be notified shortly." }));
      setTab("view");
      setPage(1);
    } catch (error) {
      setStatus((current) => ({ ...current, submitting: false, error: error.response?.data?.message || "Could not publish blood request." }));
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-slate-950 text-white">
        <div className="page-shell py-10 sm:py-14">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-rose-300"><FaArrowLeft /> Back to BloodBridge</Link>
          <div className="mt-7 max-w-3xl"><span className="inline-flex items-center gap-2 rounded-full bg-red-500/15 px-4 py-2 text-sm font-bold text-red-300"><FaTriangleExclamation /> Live blood requirement network</span><h1 className="mt-5 text-3xl font-black sm:text-5xl">Blood requests</h1><p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">Find active requirements or publish a hospital request. Approved matching donors are notified automatically.</p></div>
        </div>
      </header>

      <div className="page-shell py-8 sm:py-12">
        <div className="grid grid-cols-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm sm:max-w-md">
          <button type="button" onClick={() => setTab("view")} className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-black transition ${tab === "view" ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-50"}`}><FaList /> View requests</button>
          <button type="button" onClick={() => setTab("create")} className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-black transition ${tab === "create" ? "bg-rose-600 text-white" : "text-slate-600 hover:bg-rose-50"}`}><FaPenToSquare /> Create request</button>
        </div>

        {status.error && <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">{status.error}</div>}
        {status.success && <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">{status.success}</div>}

        {tab === "view" ? (
          <section className="mt-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <label className="relative flex-1"><FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input className="form-control pl-11" placeholder="Search patient, hospital, or contact…" value={filters.search} onChange={(event) => changeFilter("search", event.target.value)} /></label>
                <div className="grid grid-cols-2 gap-3">
                  <select className="form-control min-w-0 sm:min-w-40" value={filters.group} onChange={(event) => changeFilter("group", event.target.value)}><option>All</option>{groups.map((group) => <option key={group}>{group}</option>)}</select>
                  <select className="form-control min-w-0 sm:min-w-40" value={filters.urgency} onChange={(event) => changeFilter("urgency", event.target.value)}><option>All</option>{["Critical", "Urgent", "Standard"].map((item) => <option key={item}>{item}</option>)}</select>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-500"><span><strong className="text-slate-900">{filtered.length}</strong> active requests</span><span>Page {page} of {pageCount}</span></div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {status.loading && <div className="col-span-full rounded-2xl bg-white p-6 text-slate-500">Loading blood requests…</div>}
              {!status.loading && !visible.length && <div className="col-span-full rounded-3xl border border-slate-200 bg-white p-10 text-center"><p className="text-xl font-black">No matching requests</p><p className="mt-2 text-slate-500">Adjust the search or publish a new requirement.</p></div>}
              {visible.map((request) => {
                const critical = request.urgency === "Critical";
                return <article key={request._id} className={`rounded-3xl border bg-white p-5 shadow-sm sm:p-6 ${critical ? "border-red-300" : "border-slate-200"}`}>
                  <div className="flex items-start justify-between gap-3"><div className="flex min-w-0 gap-3 sm:gap-4"><span className={`grid h-12 w-12 flex-none place-items-center rounded-xl text-lg font-black sm:h-14 sm:w-14 sm:rounded-2xl ${critical ? "bg-red-600 text-white" : "bg-rose-100 text-rose-700"}`}>{request.bloodgroup}</span><div className="min-w-0"><h2 className="truncate text-lg font-black sm:text-xl">{request.patientName}</h2><p className="mt-1 flex items-center gap-2 truncate text-sm text-slate-500"><FaHospital className="flex-none" /> {request.hospital}</p></div></div><span className={`flex-none rounded-full px-2.5 py-1 text-[10px] font-black uppercase sm:px-3 sm:text-xs ${critical ? "bg-red-100 text-red-700" : request.urgency === "Urgent" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700"}`}>{request.urgency}</span></div>
                  <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-4"><div><p className="text-slate-400">Units</p><p className="mt-1 font-black">{request.unitsRequired}</p></div><div><p className="text-slate-400">Required</p><p className="mt-1 font-black">{new Date(request.date).toLocaleDateString()}</p></div><div className="col-span-2"><p className="text-slate-400">Hospital contact</p><a href={`tel:${request.contactNumber}`} className="mt-1 inline-flex items-center gap-2 break-all font-black text-rose-700"><FaPhone className="flex-none" /> {request.contactNumber}</a></div></div>
                </article>;
              })}
            </div>
            {pageCount > 1 && <div className="mt-7 flex items-center justify-center gap-3"><button type="button" disabled={page === 1} onClick={() => setPage((value) => value - 1)} className="secondary-button px-4 py-2 disabled:opacity-40"><FaChevronLeft /> Previous</button><button type="button" disabled={page === pageCount} onClick={() => setPage((value) => value + 1)} className="secondary-button px-4 py-2 disabled:opacity-40">Next <FaChevronRight /></button></div>}
          </section>
        ) : (
          <section className="mx-auto mt-8 max-w-3xl">
            <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-8">
              <h2 className="text-2xl font-black">Publish a blood requirement</h2><p className="mt-2 text-sm leading-6 text-slate-500">For hospitals and authorized coordinators. Approved donors with the selected blood group will be notified.</p>
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                {[["patientName", "Patient name", "text"], ["hospital", "Hospital", "text"], ["unitsRequired", "Units required", "number"], ["date", "Required date", "date"], ["contactNumber", "Contact number", "tel"]].map(([name, label, type]) => <label key={name} className="text-sm font-bold text-slate-700">{label}<input className="form-control mt-2" name={name} type={type} min={type === "number" ? 1 : undefined} value={form[name]} onChange={({ target }) => setForm((current) => ({ ...current, [target.name]: target.value }))} required /></label>)}
                <label className="text-sm font-bold text-slate-700">Blood group<select className="form-control mt-2" value={form.bloodgroup} onChange={(event) => setForm((current) => ({ ...current, bloodgroup: event.target.value }))} required><option value="">Select blood group</option>{groups.map((group) => <option key={group}>{group}</option>)}</select></label>
                <label className="text-sm font-bold text-slate-700">Urgency<select className="form-control mt-2" value={form.urgency} onChange={(event) => setForm((current) => ({ ...current, urgency: event.target.value }))}>{["Critical", "Urgent", "Standard"].map((item) => <option key={item}>{item}</option>)}</select></label>
              </div>
              <button className="primary-button mt-7 w-full sm:w-auto" disabled={status.submitting}>{status.submitting ? "Publishing…" : "Publish and notify donors"}</button>
            </form>
          </section>
        )}
      </div>
    </main>
  );
};

Emergency.propTypes = { initialTab: PropTypes.oneOf(["view", "create"]) };

export default Emergency;
