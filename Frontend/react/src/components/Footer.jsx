import { Link } from "react-router-dom";
import { FaDroplet } from "react-icons/fa6";

const Footer = () => (
  <footer className="bg-slate-950 text-slate-300">
    <div className="page-shell grid gap-10 py-14 md:grid-cols-3">
      <div className="max-w-sm">
        <div className="flex items-center gap-3 text-white">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-600"><FaDroplet /></span>
          <span className="text-xl font-extrabold">BloodBridge</span>
        </div>
        <p className="mt-5 leading-7 text-slate-400">Connecting willing donors with the teams that keep lifesaving blood available.</p>
      </div>
      <div>
        <h3 className="font-bold text-white">For staff</h3>
        <p className="mt-4 text-sm leading-6 text-slate-400">Manage donor records, review prospects, and monitor blood-group availability.</p>
        <Link to="/login" className="mt-4 inline-block font-semibold text-rose-400 hover:text-rose-300">Open staff portal →</Link>
      </div>
      <div>
        <h3 className="font-bold text-white">Before you donate</h3>
        <p className="mt-4 text-sm leading-6 text-slate-400">Eat a healthy meal, stay hydrated, carry identification, and tell staff about any medication.</p>
      </div>
    </div>
    <div className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">© {new Date().getFullYear()} BloodBridge. Built for better donation coordination.</div>
  </footer>
);

export default Footer;
