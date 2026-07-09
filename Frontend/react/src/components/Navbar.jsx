import { useState } from "react";
import { Link } from "react-scroll";
import { Link as RouterLink } from "react-router-dom";
import { FaBars, FaDroplet, FaXmark } from "react-icons/fa6";

const scrollLinks = [
  ["hero", "Home"],
  ["featured", "How it works"],
  ["tools", "Donor tools"],
  ["bloodbank", "Check blood bank"],
  ["contact", "Become a donor"],
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="page-shell flex h-18 min-h-18 items-center justify-between py-3 sm:h-20 sm:py-0">
        <Link to="hero" smooth duration={600} className="flex cursor-pointer items-center gap-2 sm:gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-600 text-white shadow-lg shadow-rose-200 sm:h-11 sm:w-11 sm:rounded-2xl"><FaDroplet /></span>
          <span><span className="block text-base font-extrabold tracking-tight sm:text-lg">BloodBridge</span><span className="hidden text-xs font-medium text-slate-500 sm:block">Give hope. Give blood.</span></span>
        </Link>
        <nav className="hidden items-center gap-5 xl:flex">
          {scrollLinks.map(([to, label]) => <Link key={to} to={to} smooth duration={600} className="cursor-pointer text-sm font-semibold text-slate-600 hover:text-rose-600">{label}</Link>)}
          <RouterLink to="/emergency" className="text-sm font-bold text-red-600 hover:text-red-700">Blood requests</RouterLink>
        </nav>
        <div className="flex items-center gap-2">
          <RouterLink to="/request-blood" className="hidden rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white sm:inline-flex">Request blood</RouterLink>
          <RouterLink to="/login" className="hidden rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 md:inline-flex">Staff</RouterLink>
          <button type="button" onClick={() => setOpen((value) => !value)} className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 text-slate-700 xl:hidden" aria-label="Toggle navigation">{open ? <FaXmark /> : <FaBars />}</button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-slate-100 bg-white px-5 py-4 shadow-xl xl:hidden">
          <div className="mx-auto grid max-w-7xl gap-1">
            {scrollLinks.map(([to, label]) => <Link key={to} to={to} smooth duration={600} onClick={() => setOpen(false)} className="cursor-pointer rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-700">{label}</Link>)}
            <RouterLink to="/emergency" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 font-bold text-red-600 hover:bg-red-50">View blood requests</RouterLink>
            <RouterLink to="/request-blood" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 font-bold text-rose-700 hover:bg-rose-50">Create blood request</RouterLink>
            <RouterLink to="/login" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 font-bold text-slate-700 hover:bg-slate-50">Staff login</RouterLink>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
