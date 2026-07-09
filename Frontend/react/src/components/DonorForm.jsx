import PropTypes from "prop-types";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const DonorForm = ({ values, onChange, onSubmit, submitting, submitLabel, error, success }) => {
  const fields = [
    ["name", "Full name", "text", "Donor's full name"],
    ["email", "Email address", "email", "donor@example.com"],
    ["tel", "Contact number", "tel", "Phone number"],
    ["address", "Address", "text", "City and address"],
    ["age", "Age", "number", "Age"],
    ["weight", "Weight (kg)", "number", "Weight"],
    ["date", "Last donation date", "date", ""],
    ["bloodpressure", "Blood pressure", "number", "Optional reading"],
  ];
  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        {fields.map(([name, label, type, placeholder]) => (
          <label key={name} className="text-sm font-bold text-slate-700">{label}
            <input className="form-control mt-2" name={name} type={type} placeholder={placeholder} value={values[name] ?? ""} onChange={onChange} required={["name", "email"].includes(name)} />
          </label>
        ))}
        <label className="text-sm font-bold text-slate-700">Blood group
          <select className="form-control mt-2" name="bloodgroup" value={values.bloodgroup ?? ""} onChange={onChange} required>
            <option value="">Select blood group</option>
            {bloodGroups.map((group) => <option key={group}>{group}</option>)}
          </select>
        </label>
        <label className="text-sm font-bold text-slate-700">Known conditions
          <textarea className="form-control mt-2 min-h-28" name="diseases" placeholder="Write none if not applicable" value={values.diseases ?? ""} onChange={onChange} />
        </label>
      </div>
      {error && <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>}
      {success && <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">{success}</div>}
      <div className="mt-7 flex justify-end">
        <button className="primary-button min-w-40" disabled={submitting}>{submitting ? "Saving…" : submitLabel}</button>
      </div>
    </form>
  );
};

DonorForm.propTypes = {
  values: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  submitLabel: PropTypes.string.isRequired,
  error: PropTypes.string,
  success: PropTypes.string,
};

export default DonorForm;
