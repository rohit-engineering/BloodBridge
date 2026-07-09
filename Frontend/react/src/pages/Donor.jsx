import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DonorForm from "../components/DonorForm";
import { publicRequest } from "../requestMethods";

const Donor = () => {
  const { id } = useParams();
  const [values, setValues] = useState({});
  const [status, setStatus] = useState({ error: "", success: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    publicRequest.get(`/donors/find/${id}`)
      .then(({ data }) => setValues({ ...data, date: data.date?.slice(0, 10) || "" }))
      .catch((error) => setStatus({ error: error.response?.data?.message || "Could not load donor.", success: "" }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ error: "", success: "" });
    try {
      const { data } = await publicRequest.put(`/donors/${id}`, values);
      setValues({ ...data, date: data.date?.slice(0, 10) || "" });
      setStatus({ error: "", success: "Donor record updated." });
    } catch (error) {
      setStatus({ error: error.response?.data?.message || "Could not update donor.", success: "" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="p-5 sm:p-8 lg:p-10">
      <Link to="/admin/donors" className="text-sm font-bold text-rose-600">← Back to donors</Link>
      <div className="mb-8 mt-4"><p className="text-sm font-bold text-rose-600">DONOR RECORD</p><h1 className="mt-1 text-3xl font-black">Edit donor</h1><p className="mt-2 text-slate-500">Keep contact and donation details accurate.</p></div>
      {loading ? <div className="rounded-3xl bg-white p-8 text-slate-500">Loading donor…</div> : <DonorForm values={values} onChange={({ target }) => setValues((current) => ({ ...current, [target.name]: target.value }))} onSubmit={handleSubmit} submitting={submitting} submitLabel="Save changes" {...status} />}
    </main>
  );
};

export default Donor;
