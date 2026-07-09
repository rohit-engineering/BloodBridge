import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaCircleCheck, FaTrash } from "react-icons/fa6";
import { publicRequest } from "../requestMethods";

const Prospect = () => {
  const { id } = useParams();
  const [prospect, setProspect] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const user = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const headers = { Authorization: `Bearer ${user.accessToken}` };

  useEffect(() => {
    publicRequest.get(`/prospects/find/${id}`)
      .then(({ data }) => setProspect(data))
      .catch((requestError) => setError(requestError.response?.data?.message || "Could not load prospect."));
  }, [id]);

  const approve = async () => {
    setSubmitting(true);
    setError("");
    try {
      await publicRequest.post(`/prospects/${id}/approve`, {}, { headers });
      navigate("/admin/donors", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not approve prospect.");
      setSubmitting(false);
    }
  };

  const reject = async () => {
    if (!window.confirm("Reject and permanently remove this prospect?")) return;
    setSubmitting(true);
    try {
      await publicRequest.delete(`/prospects/${id}`);
      navigate("/admin/prospects", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not remove prospect.");
      setSubmitting(false);
    }
  };

  const details = prospect ? [
    ["Full name", prospect.name],
    ["Email", prospect.email],
    ["Telephone", prospect.tel],
    ["Address", prospect.address],
    ["Blood group", prospect.bloodgroup],
    ["Age", prospect.age],
    ["Weight", prospect.weight ? `${prospect.weight} kg` : "—"],
    ["Conditions", prospect.diseases],
  ] : [];

  return (
    <main className="p-5 sm:p-8 lg:p-10">
      <Link to="/admin/prospects" className="text-sm font-bold text-rose-600">← Back to prospects</Link>
      <div className="mb-8 mt-4"><p className="text-sm font-bold text-rose-600">ELIGIBILITY REVIEW</p><h1 className="mt-1 text-3xl font-black">Review prospective donor</h1><p className="mt-2 text-slate-500">Confirm the submitted details before approval.</p></div>
      {error && <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>}
      {!prospect ? <div className="rounded-3xl bg-white p-8 text-slate-500">Loading prospect…</div> : (
        <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {details.map(([label, value]) => <div key={label} className="border-b border-slate-100 pb-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-2 font-semibold text-slate-800">{value || "—"}</p></div>)}
            </div>
          </section>
          <aside className="h-fit rounded-3xl bg-slate-950 p-7 text-white">
            <h2 className="text-xl font-black">Decision</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">Approval atomically creates a donor record and removes this prospect from the review queue.</p>
            <button onClick={approve} disabled={submitting} className="primary-button mt-7 w-full"><FaCircleCheck /> {submitting ? "Processing…" : "Approve as donor"}</button>
            <button onClick={reject} disabled={submitting} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3 font-bold text-slate-300 hover:border-red-500 hover:text-red-400"><FaTrash /> Reject prospect</button>
          </aside>
        </div>
      )}
    </main>
  );
};

export default Prospect;
