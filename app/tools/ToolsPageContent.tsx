"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const timerPresets = [
  { label: "30 sec", seconds: 30 },
  { label: "45 sec", seconds: 45 },
  { label: "60 sec", seconds: 60 },
  { label: "90 sec", seconds: 90 },
  { label: "2 min", seconds: 120 },
];

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function ToolCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="w-full max-w-full rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black/20">
      <h2 className="text-base font-bold text-white">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function ToolField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">{label}</span>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-black/25 px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-lime-300/60"
      />
    </label>
  );
}

function WorkoutTimer() {
  const [selectedSeconds, setSelectedSeconds] = useState(timerPresets[2].seconds);
  const [remainingSeconds, setRemainingSeconds] = useState(timerPresets[2].seconds);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState("Ready");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = window.setInterval(() => {
      setRemainingSeconds((seconds) => {
        if (seconds <= 1) {
          window.clearInterval(interval);
          setIsRunning(false);
          setMessage("Time's up!");
          audioRef.current?.play().catch(() => undefined);
          return 0;
        }

        return seconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning]);

  function selectPreset(seconds: number) {
    setSelectedSeconds(seconds);
    setRemainingSeconds(seconds);
    setIsRunning(false);
    setMessage("Ready");
  }

  function startTimer() {
    if (remainingSeconds === 0) {
      setRemainingSeconds(selectedSeconds);
    }

    audioRef.current?.load();
    setIsRunning(true);
    setMessage("Running");
  }

  function pauseTimer() {
    setIsRunning(false);
    setMessage("Paused");
  }

  function resetTimer() {
    setIsRunning(false);
    setRemainingSeconds(selectedSeconds);
    setMessage("Ready");
  }

  return (
    <ToolCard title="Workout Timer">
      <div className="grid gap-3 sm:grid-cols-5">
        {timerPresets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => selectPreset(preset.seconds)}
            className={`rounded-lg border px-3 py-3 text-sm font-black transition ${
              preset.seconds === selectedSeconds
                ? "border-lime-300/50 bg-lime-300/[0.12] text-lime-100"
                : "border-white/10 bg-white/[0.035] text-white hover:border-lime-300/40"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-lg border border-white/10 bg-black/25 p-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Countdown</p>
        <p className="mt-3 text-5xl font-black text-white">{formatTime(remainingSeconds)}</p>
        <p className="mt-3 text-sm font-bold text-lime-200">{message}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={startTimer}
          disabled={isRunning}
          className="rounded-lg bg-lime-400 px-5 py-3 text-sm font-black text-[#07100b] transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Start
        </button>
        <button
          type="button"
          onClick={pauseTimer}
          disabled={!isRunning}
          className="rounded-lg border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold text-white transition hover:border-lime-300/40 hover:text-lime-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Pause
        </button>
        <button
          type="button"
          onClick={resetTimer}
          className="rounded-lg border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold text-white transition hover:border-lime-300/40 hover:text-lime-200"
        >
          Reset
        </button>
      </div>

      <audio ref={audioRef} src="/sounds/timerfinish.wav" preload="auto" />
    </ToolCard>
  );
}

function BmiCalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const heightValue = Number(height);
  const weightValue = Number(weight);
  const bmi = heightValue > 0 && weightValue > 0 ? weightValue / (heightValue / 100) ** 2 : null;
  const category =
    bmi === null ? "" : bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";

  return (
    <ToolCard title="BMI Calculator">
      <div className="grid gap-4 sm:grid-cols-2">
        <ToolField label="Height in cm" value={height} onChange={setHeight} placeholder="175" />
        <ToolField label="Weight in kg" value={weight} onChange={setWeight} placeholder="72" />
      </div>
      <div className="mt-5 rounded-lg border border-white/10 bg-black/25 p-4">
        <p className="text-sm font-semibold text-zinc-400">BMI value</p>
        <p className="mt-2 text-3xl font-black text-white">{bmi ? bmi.toFixed(1) : "--"}</p>
        <p className="mt-2 text-sm font-bold text-lime-200">{category || "Enter valid height and weight"}</p>
      </div>
    </ToolCard>
  );
}

function WaterCalculator() {
  const [bodyWeight, setBodyWeight] = useState("");
  const weightValue = Number(bodyWeight);
  const litres = weightValue > 0 ? (weightValue * 35) / 1000 : null;

  return (
    <ToolCard title="Water Intake Calculator">
      <ToolField label="Body weight in kg" value={bodyWeight} onChange={setBodyWeight} placeholder="72" />
      <div className="mt-5 rounded-lg border border-white/10 bg-black/25 p-4">
        <p className="text-sm font-semibold text-zinc-400">Recommended daily intake</p>
        <p className="mt-2 text-3xl font-black text-white">{litres ? `${litres.toFixed(2)} L` : "--"}</p>
        <p className="mt-2 text-sm text-zinc-400">Based on 35ml per kg body weight.</p>
      </div>
    </ToolCard>
  );
}

function OneRepMaxCalculator() {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const weightValue = Number(weight);
  const repsValue = Number(reps);
  const oneRepMax = weightValue > 0 && repsValue > 0 ? weightValue * (1 + repsValue / 30) : null;

  return (
    <ToolCard title="1RM Calculator">
      <div className="grid gap-4 sm:grid-cols-2">
        <ToolField label="Weight lifted in kg" value={weight} onChange={setWeight} placeholder="80" />
        <ToolField label="Reps performed" value={reps} onChange={setReps} placeholder="8" />
      </div>
      <div className="mt-5 rounded-lg border border-white/10 bg-black/25 p-4">
        <p className="text-sm font-semibold text-zinc-400">Estimated 1 Rep Max</p>
        <p className="mt-2 text-3xl font-black text-white">{oneRepMax ? `${oneRepMax.toFixed(1)} kg` : "--"}</p>
        <p className="mt-2 text-sm text-zinc-400">Epley formula: weight * (1 + reps / 30)</p>
      </div>
    </ToolCard>
  );
}

export default function ToolsPageContent() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black/20 sm:p-6">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-lime-300">Tools</p>
        <h1 className="mt-3 text-3xl font-black tracking-normal text-white sm:text-4xl">Tools</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
          Quick fitness tools for trainers and members.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <WorkoutTimer />
        <BmiCalculator />
        <WaterCalculator />
        <OneRepMaxCalculator />
      </div>
    </div>
  );
}
