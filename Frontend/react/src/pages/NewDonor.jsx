import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DonorForm from "../components/DonorForm";
import { publicRequest } from "../requestMethods";

const NewDonor = () => {
  const [values, setValues] = useState({});
  const [status, setStatus] = useState({ error: "", success: "" });
  const [submitting, setSubmitting] = useState(false);
  const user = useSelector((state) => state.user.currentUser);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ error: "", success: "" });
    try {
      await publicRequest.post("/donors", values, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      setValues({});
      setStatus({ error: "", success: "Verified donor created successfully." });
    } catch (error) {
      setStatus({ error: error.response?.data?.message || "Could not create donor.", success: "" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="p-5 sm:p-8 lg:p-10">
      <Link to="/admin/donors" className="text-sm font-bold text-rose-600">← Back to donors</Link>
      <div className="mb-8 mt-4"><p className="text-sm font-bold text-rose-600">NEW RECORD</p><h1 className="mt-1 text-3xl font-black">Add verified donor</h1><p className="mt-2 text-slate-500">Create a donor manually after verification.</p></div>
      <DonorForm values={values} onChange={({ target }) => setValues((current) => ({ ...current, [target.name]: target.value }))} onSubmit={handleSubmit} submitting={submitting} submitLabel="Create donor" {...status} />
    </main>
  );
};

export default NewDonor;
