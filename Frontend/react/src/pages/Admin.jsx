import { PieChart } from "@mui/x-charts/PieChart";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRightFromBracket, FaDroplet, FaPeopleGroup, FaTriangleExclamation, FaUserPlus } from "react-icons/fa6";
import { publicRequest } from "../requestMethods";
import { logout } from "../redux/userRedux";

const Admin = () => {
  const [bloodGroupData, setBloodGroupData] = useState([]);
  const [serviceError, setServiceError] = useState("");
  const [prospectCount, setProspectCount] = useState(0);
  const [emergencyCount, setEmergencyCount] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    Promise.all([
      publicRequest.get("/donors/stats"),
      publicRequest.get("/prospects"),
      publicRequest.get("/emergencies"),
    ])
      .then(([stats, prospects, emergencies]) => {
        setBloodGroupData(stats.data.map((item, index) => ({ id: index, value: item.count, label: item._id || "Unknown" })));
        setProspectCount(prospects.data.length);
        setEmergencyCount(emergencies.data.length);
      })
      .catch((error) => setServiceError(error.response?.data?.message || "Dashboard data is currently unavailable."));
  }, []);

  const donorCount = bloodGroupData.reduce((total, item) => total + item.value, 0);
  const handleLogout = () => { dispatch(logout()); navigate("/login"); };

  return (
    <main className="p-5 sm:p-8 lg:p-10">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="text-sm font-bold text-rose-600">ADMIN OVERVIEW</p><h1 className="mt-1 text-3xl font-black tracking-tight">Good to see you, {user?.name || "Admin"}.</h1><p className="mt-2 text-slate-500">Here is the current blood bank snapshot.</p></div>
        <button onClick={handleLogout} className="secondary-button self-start px-4 py-2 text-sm"><FaArrowRightFromBracket /> Sign out</button>
      </header>
      {serviceError && <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-900">{serviceError} Check the Neon connection, then refresh this page.</div>}
      <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Verified donors", value: donorCount, icon: FaPeopleGroup, color: "bg-rose-100 text-rose-700" },
          { label: "Blood groups tracked", value: bloodGroupData.length, icon: FaDroplet, color: "bg-sky-100 text-sky-700" },
          { label: "Pending prospects", value: prospectCount, icon: FaUserPlus, color: "bg-amber-100 text-amber-700" },
          { label: "Active emergencies", value: emergencyCount, icon: FaTriangleExclamation, color: "bg-red-100 text-red-700" },
        ].map(({ label, value, icon: Icon, color }) => (
          <article key={label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className={`grid h-12 w-12 place-items-center rounded-2xl ${color}`}><Icon /></span>
            <p className="mt-6 text-3xl font-black">{value}</p><p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
          </article>
        ))}
      </section>
      <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between"><div><h2 className="text-xl font-black">Blood group distribution</h2><p className="mt-1 text-sm text-slate-500">Verified donors grouped by blood type.</p></div><Link to="/admin/donors" className="text-sm font-bold text-rose-600 hover:text-rose-700">View donors →</Link></div>
          <div className="mt-4 h-80">
            {bloodGroupData.length ? <PieChart series={[{ data: bloodGroupData, innerRadius: 70, outerRadius: 120, paddingAngle: 3, cornerRadius: 5 }]} /> : <div className="grid h-full place-items-center rounded-2xl bg-slate-50 text-sm font-medium text-slate-500">No donor statistics available yet.</div>}
          </div>
        </article>
        <article className="rounded-3xl bg-slate-950 p-7 text-white shadow-xl">
          <p className="text-sm font-bold text-rose-400">QUICK ACTIONS</p><h2 className="mt-2 text-2xl font-black">Keep records moving.</h2><p className="mt-3 leading-7 text-slate-400">Review new interest forms before creating verified donor records.</p>
          <div className="mt-8 space-y-3">
            <Link to="/admin/prospects" className="primary-button w-full">Review prospects</Link>
            <Link to="/admin/newdonor" className="secondary-button w-full border-slate-700 bg-slate-900 text-white">Add verified donor</Link>
            <Link to="/admin/emergencies" className="secondary-button w-full border-slate-700 bg-slate-900 text-white">Manage emergencies</Link>
          </div>
        </article>
      </section>
    </main>
  );
};

export default Admin;
