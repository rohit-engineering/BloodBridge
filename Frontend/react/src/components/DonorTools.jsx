import { useMemo, useState } from "react";
import { FaCircleCheck, FaCircleExclamation, FaDroplet } from "react-icons/fa6";

const compatibility = {
  "O-": { donate: "Everyone", receive: "O− only" },
  "O+": { donate: "O+, A+, B+, AB+", receive: "O+ and O−" },
  "A-": { donate: "A−, A+, AB−, AB+", receive: "A− and O−" },
  "A+": { donate: "A+ and AB+", receive: "A+, A−, O+, O−" },
  "B-": { donate: "B−, B+, AB−, AB+", receive: "B− and O−" },
  "B+": { donate: "B+ and AB+", receive: "B+, B−, O+, O−" },
  "AB-": { donate: "AB− and AB+", receive: "AB−, A−, B−, O−" },
  "AB+": { donate: "AB+ only", receive: "Every blood group" },
};

const DonorTools = () => {
  const [group, setGroup] = useState("O+");
  const [answers, setAnswers] = useState({ age: "", weight: "", well: "yes", recent: "no" });
  const [checked, setChecked] = useState(false);

  const result = useMemo(() => {
    const age = Number(answers.age);
    const weight = Number(answers.weight);
    if (!age || !weight) return null;
    const basicMatch = age >= 18 && age <= 65 && weight >= 50 && answers.well === "yes" && answers.recent === "no";
    return basicMatch
      ? { good: true, text: "Your answers meet these basic screening indicators. A donation professional must still confirm eligibility." }
      : { good: false, text: "One or more answers may need review. This does not always mean you cannot donate—contact a donation center for individual guidance." };
  }, [answers]);

  const update = ({ target }) => setAnswers((current) => ({ ...current, [target.name]: target.value }));

  return (
    <section className="bg-slate-950 py-24 text-white">
      <div className="page-shell">
        <div className="max-w-2xl">
          <span className="text-sm font-bold uppercase tracking-[0.25em] text-rose-400">Donor tools</span>
          <h2 className="mt-3 text-4xl font-black tracking-tight">Learn before you donate.</h2>
          <p className="mt-4 text-lg leading-8 text-slate-400">Use these quick educational tools to prepare for a conversation with your local donation team.</p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
            <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-rose-600"><FaDroplet /></span><div><h3 className="text-xl font-black">Blood compatibility</h3><p className="text-sm text-slate-400">Red-cell donation reference</p></div></div>
            <label className="mt-8 block text-sm font-bold text-slate-300">Select your blood group
              <select className="form-control mt-2 border-slate-700 bg-slate-800 text-white" value={group} onChange={(event) => setGroup(event.target.value)}>
                {Object.keys(compatibility).map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-800 p-5"><p className="text-xs font-bold uppercase tracking-wider text-rose-400">Can donate red cells to</p><p className="mt-2 font-bold">{compatibility[group].donate}</p></div>
              <div className="rounded-2xl bg-slate-800 p-5"><p className="text-xs font-bold uppercase tracking-wider text-sky-400">Can receive red cells from</p><p className="mt-2 font-bold">{compatibility[group].receive}</p></div>
            </div>
          </article>
          <article className="rounded-3xl bg-white p-6 text-slate-900 sm:p-8">
            <h3 className="text-xl font-black">Basic eligibility self-check</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">Rules vary by country and donation provider. This is not medical clearance.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-bold">Age<input name="age" className="form-control mt-2" type="number" min="0" value={answers.age} onChange={update} placeholder="Your age" /></label>
              <label className="text-sm font-bold">Weight (kg)<input name="weight" className="form-control mt-2" type="number" min="0" value={answers.weight} onChange={update} placeholder="Your weight" /></label>
              <label className="text-sm font-bold">Feeling well today?<select name="well" className="form-control mt-2" value={answers.well} onChange={update}><option value="yes">Yes</option><option value="no">No</option></select></label>
              <label className="text-sm font-bold">Recent donation, surgery, or tattoo?<select name="recent" className="form-control mt-2" value={answers.recent} onChange={update}><option value="no">No</option><option value="yes">Yes</option></select></label>
            </div>
            <button type="button" className="primary-button mt-6" onClick={() => setChecked(true)}>Check my answers</button>
            {checked && result && <div className={`mt-5 flex gap-3 rounded-xl p-4 text-sm font-medium ${result.good ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"}`}>{result.good ? <FaCircleCheck className="mt-0.5 flex-none" /> : <FaCircleExclamation className="mt-0.5 flex-none" />}<span>{result.text}</span></div>}
            {checked && !result && <div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm font-medium text-amber-900">Enter your age and weight to complete the check.</div>}
          </article>
        </div>
      </div>
    </section>
  );
};

export default DonorTools;
