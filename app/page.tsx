const floatingIcons = [
  { icon: "🏋️", className: "left-[12%] top-[18%] [animation-delay:0ms]" },
  { icon: "💪", className: "right-[14%] top-[22%] [animation-delay:700ms]" },
  { icon: "🔥", className: "bottom-[18%] left-[18%] [animation-delay:1000ms]" },
  { icon: "⚡", className: "bottom-[24%] right-[18%] [animation-delay:500ms]" },
];

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#050608]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.22),transparent_32%),radial-gradient(circle_at_80%_25%,rgba(14,165,233,0.2),transparent_30%),linear-gradient(135deg,#050608_0%,#111827_48%,#020617_100%)] animate-[backgroundShift_12s_ease-in-out_infinite]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(circle_at_center,black,transparent_72%)]" />
      <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl animate-[orbFloat_9s_ease-in-out_infinite]" />
      <div className="absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl animate-[orbFloat_10s_ease-in-out_infinite_reverse]" />

      {floatingIcons.map((item) => (
        <span
          key={item.icon}
          className={`absolute hidden select-none text-5xl opacity-20 blur-[0.2px] md:block animate-[iconFloat_8s_ease-in-out_infinite] ${item.className}`}
          aria-hidden="true"
        >
          {item.icon}
        </span>
      ))}
    </div>
  );
}

function HeroSection() {
  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12 text-center">
      <section className="mx-auto flex w-full max-w-3xl flex-col items-center">
        <div className="mb-6 rounded-full border border-emerald-400/25 bg-white/5 px-4 py-2 text-sm font-medium text-emerald-200 shadow-[0_0_30px_rgba(34,197,94,0.12)] backdrop-blur animate-[fadeUp_700ms_ease-out_both]">
          Gym management, simplified
        </div>

        <h1 className="text-balance text-5xl font-black tracking-normal text-white sm:text-6xl lg:text-7xl animate-[fadeUp_800ms_ease-out_120ms_both]">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
            GymBuddy
          </span>{" "}
          💪
        </h1>

        <p className="mt-5 max-w-xl text-lg font-medium text-slate-300 sm:text-xl animate-[fadeUp_800ms_ease-out_240ms_both]">
          Manage your gym like a pro
        </p>

        <a
          href="/dashboard"
          className="mt-10 inline-flex min-h-12 items-center justify-center rounded-full bg-emerald-400 px-8 py-3 text-base font-bold text-slate-950 shadow-[0_0_36px_rgba(52,211,153,0.34)] transition duration-300 hover:scale-105 hover:bg-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-300/30 active:scale-100 animate-[fadeUp_800ms_ease-out_360ms_both]"
        >
          Enter Dashboard
        </a>
      </section>
    </main>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050608] text-white">
      <AnimatedBackground />
      <HeroSection />

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes backgroundShift {
          0%, 100% {
            transform: scale(1);
            filter: hue-rotate(0deg);
          }
          50% {
            transform: scale(1.04);
            filter: hue-rotate(12deg);
          }
        }

        @keyframes orbFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(24px, -20px, 0);
          }
        }

        @keyframes iconFloat {
          0%, 100% {
            transform: translateY(0) rotate(-4deg);
          }
          50% {
            transform: translateY(-18px) rotate(5deg);
          }
        }
      `}</style>
    </div>
  );
}
