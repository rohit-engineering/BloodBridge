import { useState } from "react";
import { FaArrowRight, FaCircleCheck } from "react-icons/fa6";
import { publicRequest } from "../requestMethods";

const initialValues = { name: "", tel: "", email: "", address: "", weight: "", bloodgroup: "", age: "", diseases: "" };

const Contact = () => {
  const [inputs, setInputs] = useState(initialValues);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = ({ target }) => {
    setInputs((current) => ({ ...current, [target.name]: target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });
    try {
      await publicRequest.post("/prospects", inputs);
      setInputs(initialValues);
      setStatus({ type: "success", message: "Thank you! Your donor interest was submitted. Our team will review it." });
    } catch (error) {
      const unavailable = !error.response || error.response.status === 503;
      setStatus({
        type: "error",
        message: unavailable
          ? "The donation service is temporarily unavailable. Please confirm MongoDB and the backend are running, then try again."
          : error.response?.data?.message || "We could not submit your details. Please review the form and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const fields = [
    ["name", "Full name", "text", "Your full name"],
    ["email", "Email address", "email", "you@example.com"],
    ["tel", "Telephone", "tel", "Your contact number"],
    ["address", "Address", "text", "City and address"],
    ["age", "Age", "number", "18 or older"],
    ["weight", "Weight (kg)", "number", "Weight in kilograms"],
  ];

  return (
    <section className="bg-rose-50 py-24">
      <div className="page-shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <span className="text-sm font-bold uppercase tracking-[0.25em] text-rose-600">Ready to help?</span>
          <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Start your donor journey.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">Complete this form to register your interest. This is not a confirmed appointment—our team will review your eligibility first.</p>
          <div className="mt-8 space-y-4 text-sm font-medium text-slate-700">
            {["Takes about two minutes", "No payment or commitment", "A coordinator will contact you"].map((text) => (
              <div key={text} className="flex items-center gap-3"><FaCircleCheck className="text-rose-600" />{text}</div>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="rounded-3xl border border-rose-100 bg-white p-6 shadow-2xl shadow-rose-200/40 sm:p-9">
          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map(([name, label, type, placeholder]) => (
              <label key={name} className="block text-sm font-semibold text-slate-700">
                {label}
                <input className="form-control mt-2" name={name} type={type} placeholder={placeholder} value={inputs[name]} onChange={handleChange} min={type === "number" ? 0 : undefined} required />
              </label>
            ))}
            <label className="block text-sm font-semibold text-slate-700">
              Blood group
              <select className="form-control mt-2" name="bloodgroup" value={inputs.bloodgroup} onChange={handleChange} required>
                <option value="">Select blood group</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => <option key={group}>{group}</option>)}
              </select>
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Known diseases or conditions
              <input className="form-control mt-2" name="diseases" type="text" placeholder="Write none if not applicable" value={inputs.diseases} onChange={handleChange} required />
            </label>
          </div>
          {status.message && (
            <div role="status" className={`mt-6 rounded-xl p-4 text-sm font-medium ${status.type === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>{status.message}</div>
          )}
          <button className="primary-button mt-7 w-full sm:w-auto" type="submit" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit donor interest"} {!submitting && <FaArrowRight />}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
