import { NavLink } from "react-router-dom";
import { FaDroplet, FaGaugeHigh, FaPeopleGroup, FaTriangleExclamation, FaUserPlus } from "react-icons/fa6";

const links = [
  { to: "/admin", label: "Overview", icon: FaGaugeHigh, end: true },
  { to: "/admin/donors", label: "Donors", icon: FaPeopleGroup },
  { to: "/admin/prospects", label: "Prospects", icon: FaUserPlus },
  { to: "/admin/emergencies", label: "Emergencies", icon: FaTriangleExclamation },
];

const Menu = () => (
  <aside className="border-b border-slate-200 bg-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:flex-none lg:border-b-0 lg:border-r">
    <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-600 text-white"><FaDroplet /></span>
      <div><p className="font-black">BloodBridge</p><p className="text-xs text-slate-500">Admin workspace</p></div>
    </div>
    <nav className="flex gap-2 overflow-x-auto p-3 lg:block lg:space-y-2 lg:p-4" aria-label="Admin navigation">
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => `flex min-w-fit items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${isActive ? "bg-rose-50 text-rose-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"}`}
        >
          <Icon /> {label}
        </NavLink>
      ))}
    </nav>
    <div className="mx-4 mt-auto hidden rounded-2xl bg-slate-950 p-5 text-white lg:block">
      <p className="text-sm font-bold">Need a new donor?</p>
      <p className="mt-1 text-xs leading-5 text-slate-400">Create a verified donor record from the donors page.</p>
      <NavLink to="/admin/newdonor" className="mt-4 block rounded-lg bg-rose-600 px-3 py-2 text-center text-xs font-bold hover:bg-rose-700">Add donor</NavLink>
    </div>
  </aside>
);

export default Menu;
