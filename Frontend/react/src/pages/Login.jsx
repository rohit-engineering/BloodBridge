import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft, FaDroplet, FaLock, FaShieldHeart } from "react-icons/fa6";
import { login } from "../redux/apiCalls";
import { publicRequest } from "../requestMethods";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [setupRequired, setSetupRequired] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);
  const [setupError, setSetupError] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    publicRequest.get("/auth/setup-status")
      .then(({ data }) => setSetupRequired(data.setupRequired))
      .catch(() => setSetupError("Could not reach the backend database. Check the API health page."))
      .finally(() => setCheckingSetup(false));
  }, []);

  if (user.currentUser) return <Navigate to="/admin" replace />;

  const handleLogin = async (event) => {
    event.preventDefault();
    if (email && password) await login(dispatch, { email, password });
  };

  const handleSetup = async (event) => {
    event.preventDefault();
    setSetupError("");
    try {
      await publicRequest.post("/auth/register", {
        name,
        email,
        password,
        role: "admin",
      });
      setSetupRequired(false);
      await login(dispatch, { email, password });
    } catch (error) {
      setSetupError(error.response?.data?.message || "Could not create the administrator account.");
    }
  };

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-slate-950 px-5 py-12">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-rose-700/30 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-red-900/40 blur-3xl" />
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white p-8 shadow-2xl sm:p-10">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-600 text-white"><FaDroplet /></span>
          <div><h1 className="text-xl font-black">BloodBridge</h1><p className="text-xs text-slate-500">Secure staff portal</p></div>
        </div>
        <h2 className="mt-9 text-3xl font-black tracking-tight">{setupRequired ? "Create first admin" : "Welcome back"}</h2>
        <p className="mt-2 text-slate-500">{setupRequired ? "Set up the first staff account for this database." : "Sign in with your administrator account."}</p>
        {checkingSetup ? (
          <div className="mt-8 rounded-xl bg-slate-50 p-5 text-sm font-medium text-slate-500">Checking database setup…</div>
        ) : (
        <form onSubmit={setupRequired ? handleSetup : handleLogin} className="mt-8 space-y-5">
          {setupRequired && (
            <label className="block text-sm font-semibold text-slate-700">Your name
              <input className="form-control mt-2" type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required />
            </label>
          )}
          <label className="block text-sm font-semibold text-slate-700">Email address
            <input className="form-control mt-2" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label className="block text-sm font-semibold text-slate-700">Password
            <input className="form-control mt-2" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          {(setupError || (!setupRequired && user.error)) && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">{setupError || "Login failed. Check your credentials and make sure the backend and Neon database are connected."}</p>}
          <button type="submit" className="primary-button w-full" disabled={user.isFetching}>
            <FaLock /> {user.isFetching ? "Please wait…" : setupRequired ? "Create admin and continue" : "Sign in securely"}
          </button>
        </form>
        )}
        <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-6 text-sm">
          <Link to="/" className="flex items-center gap-2 font-semibold text-slate-600 hover:text-rose-600"><FaArrowLeft /> Public site</Link>
          <span className="flex items-center gap-2 text-slate-400"><FaShieldHeart /> Staff only</span>
        </div>
      </div>
    </main>
  );
};

export default Login;
