import { Link } from "react-scroll";
import { FaArrowRight, FaHeartPulse, FaShieldHeart } from "react-icons/fa6";

const Hero = () => (
  <section className="relative overflow-hidden bg-slate-950 text-white">
    <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-rose-600/30 blur-3xl" />
    <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-red-800/30 blur-3xl" />
    <div className="page-shell relative grid min-h-[680px] items-center gap-14 py-20 lg:grid-cols-2">
      <div>
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-rose-400/10 px-4 py-2 text-sm font-semibold text-rose-200">
          <FaHeartPulse /> One donation can help save up to three lives
        </div>
        <h1 className="max-w-2xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl">
          A small act.<span className="block text-rose-400">A life-changing impact.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
          Join a caring community of donors. Share your details, check your eligibility, and help hospitals stay ready when every second matters.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link to="contact" smooth duration={600} className="primary-button cursor-pointer">Become a donor <FaArrowRight /></Link>
          <Link to="featured" smooth duration={600} className="secondary-button cursor-pointer border-slate-700 bg-slate-900 text-white hover:border-rose-400 hover:text-rose-300">How it works</Link>
        </div>
        <div className="mt-10 flex items-center gap-3 text-sm text-slate-400"><FaShieldHeart className="text-rose-400" />Your information is used only for donation coordination.</div>
      </div>
      <div className="relative mx-auto grid h-[390px] w-full max-w-[470px] place-items-center">
        <div className="absolute h-72 w-72 rotate-45 rounded-[42%_58%_60%_40%] bg-gradient-to-br from-rose-500 to-red-700 shadow-2xl shadow-rose-900/50" />
        <div className="relative z-10 -rotate-6 rounded-3xl border border-white/20 bg-white/10 p-7 text-center backdrop-blur-xl">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-white/15 text-5xl" aria-hidden="true">♥</div>
          <p className="mt-4 text-2xl font-black">Every drop carries hope.</p>
          <p className="mt-2 text-sm text-rose-100">Safe • Simple • Meaningful</p>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
