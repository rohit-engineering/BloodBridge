import { FaClipboardCheck, FaDroplet, FaUserCheck } from "react-icons/fa6";

const steps = [
  { icon: FaClipboardCheck, title: "Share your details", text: "Complete the short donor interest form with accurate health information." },
  { icon: FaUserCheck, title: "Eligibility review", text: "Our team reviews your details and contacts you with the next steps." },
  { icon: FaDroplet, title: "Donate with confidence", text: "Visit the assigned center and help give someone another tomorrow." },
];

const Featured = () => (
  <section className="bg-white py-24">
    <div className="page-shell">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-bold uppercase tracking-[0.25em] text-rose-600">A clear path to giving</span>
        <h2 className="mt-3 text-4xl font-black tracking-tight">Donating starts with three simple steps</h2>
        <p className="mt-4 text-lg leading-8 text-slate-600">We make the first step easy, transparent, and respectful of your time.</p>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {steps.map(({ icon: Icon, title, text }, index) => (
          <article key={title} className="group rounded-3xl border border-slate-200 bg-slate-50 p-7 transition hover:-translate-y-1 hover:border-rose-200 hover:shadow-xl hover:shadow-rose-100/60">
            <div className="flex items-center justify-between">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-100 text-xl text-rose-600"><Icon /></span>
              <span className="text-5xl font-black text-slate-200">0{index + 1}</span>
            </div>
            <h3 className="mt-7 text-xl font-bold">{title}</h3>
            <p className="mt-3 leading-7 text-slate-600">{text}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Featured;
