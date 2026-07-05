"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { DEMO_MEMBER_ID } from "../../lib/memberPortalMockContext";
import { getCurrentAdminGym, getFirstGymMemberProfile, getMemberProfile, saveMemberProfile, type MemberPortalId, type MemberProfile } from "../../lib/memberPortalApi";

type MemberSection = "Dashboard" | "Add Workout" | "Meal Log" | "Progress" | "Progress Photos" | "Membership" | "Profile" | "Support";
type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snacks" | "Pre Workout" | "Post Workout";
type FitnessGoal = "Fat Loss" | "Muscle Gain" | "General Fitness" | "Strength" | "Endurance";
type PhotoType = "Front" | "Side" | "Back";

type ExerciseLibraryItem = {
  id: number;
  name: string;
  muscle: string;
  equipment: string;
  imagePlaceholder: string;
  recent?: boolean;
};

type WorkoutSet = {
  id: number;
  weight: string;
  reps: string;
  rpe: string;
  completed: boolean;
};

type WorkoutExercise = {
  id: number;
  libraryId: number;
  name: string;
  muscle: string;
  equipment: string;
  notes: string;
  sets: WorkoutSet[];
};

type WorkoutSession = {
  id: number;
  name: string;
  type: string;
  date: string;
  notes: string;
  exercises: WorkoutExercise[];
  expanded: boolean;
};

type MealEntry = {
  id: number;
  date: string;
  time: string;
  type: MealType;
  food: string;
  quantity: string;
  calories: string;
  protein: string;
  notes: string;
};

type ProgressEntry = {
  id: number;
  date: string;
  weight: string;
  bodyFat: string;
  waist: string;
  chest: string;
  arms: string;
  notes: string;
};

type PhotoEntry = {
  id: number;
  type: PhotoType;
  date: string;
  notes: string;
  url: string;
  fileName: string;
};

type ProfileForm = {
  fullName: string;
  phone: string;
  email: string;
  height: string;
  currentWeight: string;
  fitnessGoal: FitnessGoal;
  medicalNotes: string;
};

const memberNavigation: MemberSection[] = [
  "Dashboard",
  "Add Workout",
  "Meal Log",
  "Progress",
  "Progress Photos",
  "Membership",
  "Profile",
  "Support",
];

const mealTypes: MealType[] = ["Breakfast", "Lunch", "Dinner", "Snacks", "Pre Workout", "Post Workout"];
const fitnessGoals: FitnessGoal[] = ["Fat Loss", "Muscle Gain", "General Fitness", "Strength", "Endurance"];
const photoTypes: PhotoType[] = ["Front", "Side", "Back"];
const todayDate = "2026-07-05";

const exerciseLibrary: ExerciseLibraryItem[] = [
  { id: 1, name: "Squat (Bodyweight)", muscle: "Quadriceps", equipment: "Bodyweight", imagePlaceholder: "SQ", recent: true },
  { id: 2, name: "Squat (Barbell)", muscle: "Quadriceps", equipment: "Barbell", imagePlaceholder: "SQ" },
  { id: 3, name: "Box Squat (Barbell)", muscle: "Quadriceps", equipment: "Barbell", imagePlaceholder: "BX" },
  { id: 4, name: "Deadlift (Barbell)", muscle: "Glutes", equipment: "Barbell", imagePlaceholder: "DL", recent: true },
  { id: 5, name: "Leg Extension (Machine)", muscle: "Quadriceps", equipment: "Machine", imagePlaceholder: "LE" },
  { id: 6, name: "Seated Leg Curl (Machine)", muscle: "Hamstrings", equipment: "Machine", imagePlaceholder: "LC" },
  { id: 7, name: "Standing Calf Raise (Machine)", muscle: "Calves", equipment: "Machine", imagePlaceholder: "CR" },
  { id: 8, name: "Crunch (Weighted)", muscle: "Abdominals", equipment: "Weighted", imagePlaceholder: "AB" },
  { id: 9, name: "Bench Press (Barbell)", muscle: "Chest", equipment: "Barbell", imagePlaceholder: "BP", recent: true },
  { id: 10, name: "Incline Dumbbell Press", muscle: "Chest", equipment: "Dumbbell", imagePlaceholder: "IP" },
  { id: 11, name: "Lat Pulldown (Machine)", muscle: "Back", equipment: "Machine", imagePlaceholder: "LP" },
  { id: 12, name: "Shoulder Press (Dumbbell)", muscle: "Shoulders", equipment: "Dumbbell", imagePlaceholder: "SP" },
  { id: 13, name: "Biceps Curl (Dumbbell)", muscle: "Biceps", equipment: "Dumbbell", imagePlaceholder: "BC" },
  { id: 14, name: "Triceps Pushdown (Cable)", muscle: "Triceps", equipment: "Cable", imagePlaceholder: "TP" },
  { id: 15, name: "Front Squat (Barbell)", muscle: "Quadriceps", equipment: "Barbell", imagePlaceholder: "FS" },
  { id: 16, name: "Goblet Squat (Dumbbell)", muscle: "Quadriceps", equipment: "Dumbbell", imagePlaceholder: "GS" },
  { id: 17, name: "Hack Squat (Machine)", muscle: "Quadriceps", equipment: "Machine", imagePlaceholder: "HS" },
  { id: 18, name: "Leg Press (Machine)", muscle: "Quadriceps", equipment: "Machine", imagePlaceholder: "LP" },
  { id: 19, name: "Walking Lunge (Dumbbell)", muscle: "Quadriceps", equipment: "Dumbbell", imagePlaceholder: "WL" },
  { id: 20, name: "Bulgarian Split Squat", muscle: "Quadriceps", equipment: "Dumbbell", imagePlaceholder: "BS" },
  { id: 21, name: "Step Up (Dumbbell)", muscle: "Quadriceps", equipment: "Dumbbell", imagePlaceholder: "SU" },
  { id: 22, name: "Romanian Deadlift (Barbell)", muscle: "Hamstrings", equipment: "Barbell", imagePlaceholder: "RD" },
  { id: 23, name: "Romanian Deadlift (Dumbbell)", muscle: "Hamstrings", equipment: "Dumbbell", imagePlaceholder: "RD" },
  { id: 24, name: "Lying Leg Curl (Machine)", muscle: "Hamstrings", equipment: "Machine", imagePlaceholder: "LC" },
  { id: 25, name: "Hip Thrust (Barbell)", muscle: "Glutes", equipment: "Barbell", imagePlaceholder: "HT" },
  { id: 26, name: "Glute Bridge (Bodyweight)", muscle: "Glutes", equipment: "Bodyweight", imagePlaceholder: "GB" },
  { id: 27, name: "Cable Kickback", muscle: "Glutes", equipment: "Cable", imagePlaceholder: "CK" },
  { id: 28, name: "Seated Calf Raise (Machine)", muscle: "Calves", equipment: "Machine", imagePlaceholder: "SC" },
  { id: 29, name: "Donkey Calf Raise", muscle: "Calves", equipment: "Machine", imagePlaceholder: "DC" },
  { id: 30, name: "Flat Dumbbell Press", muscle: "Chest", equipment: "Dumbbell", imagePlaceholder: "DP" },
  { id: 31, name: "Decline Bench Press (Barbell)", muscle: "Chest", equipment: "Barbell", imagePlaceholder: "DB" },
  { id: 32, name: "Chest Press (Machine)", muscle: "Chest", equipment: "Machine", imagePlaceholder: "CP" },
  { id: 33, name: "Cable Fly", muscle: "Chest", equipment: "Cable", imagePlaceholder: "CF" },
  { id: 34, name: "Pec Deck Fly (Machine)", muscle: "Chest", equipment: "Machine", imagePlaceholder: "PF" },
  { id: 35, name: "Push Up", muscle: "Chest", equipment: "Bodyweight", imagePlaceholder: "PU" },
  { id: 36, name: "Incline Push Up", muscle: "Chest", equipment: "Bodyweight", imagePlaceholder: "IP" },
  { id: 37, name: "Pull Up", muscle: "Back", equipment: "Bodyweight", imagePlaceholder: "PU" },
  { id: 38, name: "Assisted Pull Up (Machine)", muscle: "Back", equipment: "Machine", imagePlaceholder: "AP" },
  { id: 39, name: "Chin Up", muscle: "Back", equipment: "Bodyweight", imagePlaceholder: "CU" },
  { id: 40, name: "Barbell Row", muscle: "Back", equipment: "Barbell", imagePlaceholder: "BR" },
  { id: 41, name: "One Arm Dumbbell Row", muscle: "Back", equipment: "Dumbbell", imagePlaceholder: "DR" },
  { id: 42, name: "Seated Cable Row", muscle: "Back", equipment: "Cable", imagePlaceholder: "SR" },
  { id: 43, name: "T-Bar Row", muscle: "Back", equipment: "Machine", imagePlaceholder: "TR" },
  { id: 44, name: "Straight Arm Pulldown", muscle: "Back", equipment: "Cable", imagePlaceholder: "SA" },
  { id: 45, name: "Face Pull", muscle: "Shoulders", equipment: "Cable", imagePlaceholder: "FP" },
  { id: 46, name: "Overhead Press (Barbell)", muscle: "Shoulders", equipment: "Barbell", imagePlaceholder: "OP" },
  { id: 47, name: "Arnold Press", muscle: "Shoulders", equipment: "Dumbbell", imagePlaceholder: "AP" },
  { id: 48, name: "Lateral Raise (Dumbbell)", muscle: "Shoulders", equipment: "Dumbbell", imagePlaceholder: "LR" },
  { id: 49, name: "Cable Lateral Raise", muscle: "Shoulders", equipment: "Cable", imagePlaceholder: "CL" },
  { id: 50, name: "Rear Delt Fly (Dumbbell)", muscle: "Shoulders", equipment: "Dumbbell", imagePlaceholder: "RF" },
  { id: 51, name: "Reverse Pec Deck", muscle: "Shoulders", equipment: "Machine", imagePlaceholder: "RP" },
  { id: 52, name: "Shrug (Dumbbell)", muscle: "Traps", equipment: "Dumbbell", imagePlaceholder: "SH" },
  { id: 53, name: "Shrug (Barbell)", muscle: "Traps", equipment: "Barbell", imagePlaceholder: "SH" },
  { id: 54, name: "Hammer Curl (Dumbbell)", muscle: "Biceps", equipment: "Dumbbell", imagePlaceholder: "HC" },
  { id: 55, name: "EZ Bar Curl", muscle: "Biceps", equipment: "Barbell", imagePlaceholder: "EZ" },
  { id: 56, name: "Preacher Curl (Machine)", muscle: "Biceps", equipment: "Machine", imagePlaceholder: "PC" },
  { id: 57, name: "Cable Curl", muscle: "Biceps", equipment: "Cable", imagePlaceholder: "CC" },
  { id: 58, name: "Concentration Curl", muscle: "Biceps", equipment: "Dumbbell", imagePlaceholder: "CN" },
  { id: 59, name: "Close Grip Bench Press", muscle: "Triceps", equipment: "Barbell", imagePlaceholder: "CG" },
  { id: 60, name: "Overhead Triceps Extension", muscle: "Triceps", equipment: "Dumbbell", imagePlaceholder: "OE" },
  { id: 61, name: "Skull Crusher", muscle: "Triceps", equipment: "Barbell", imagePlaceholder: "SC" },
  { id: 62, name: "Cable Overhead Extension", muscle: "Triceps", equipment: "Cable", imagePlaceholder: "CO" },
  { id: 63, name: "Bench Dip", muscle: "Triceps", equipment: "Bodyweight", imagePlaceholder: "BD" },
  { id: 64, name: "Parallel Bar Dip", muscle: "Triceps", equipment: "Bodyweight", imagePlaceholder: "PD" },
  { id: 65, name: "Plank", muscle: "Abdominals", equipment: "Bodyweight", imagePlaceholder: "PL" },
  { id: 66, name: "Side Plank", muscle: "Abdominals", equipment: "Bodyweight", imagePlaceholder: "SP" },
  { id: 67, name: "Hanging Leg Raise", muscle: "Abdominals", equipment: "Bodyweight", imagePlaceholder: "HL" },
  { id: 68, name: "Cable Crunch", muscle: "Abdominals", equipment: "Cable", imagePlaceholder: "CC" },
  { id: 69, name: "Russian Twist", muscle: "Abdominals", equipment: "Weighted", imagePlaceholder: "RT" },
  { id: 70, name: "Ab Wheel Rollout", muscle: "Abdominals", equipment: "Wheel", imagePlaceholder: "AW" },
  { id: 71, name: "Back Extension", muscle: "Lower Back", equipment: "Machine", imagePlaceholder: "BE" },
  { id: 72, name: "Good Morning (Barbell)", muscle: "Lower Back", equipment: "Barbell", imagePlaceholder: "GM" },
  { id: 73, name: "Kettlebell Swing", muscle: "Glutes", equipment: "Kettlebell", imagePlaceholder: "KS" },
  { id: 74, name: "Kettlebell Goblet Squat", muscle: "Quadriceps", equipment: "Kettlebell", imagePlaceholder: "KG" },
  { id: 75, name: "Kettlebell Clean", muscle: "Full Body", equipment: "Kettlebell", imagePlaceholder: "KC" },
  { id: 76, name: "Kettlebell Snatch", muscle: "Full Body", equipment: "Kettlebell", imagePlaceholder: "KN" },
  { id: 77, name: "Burpee", muscle: "Full Body", equipment: "Bodyweight", imagePlaceholder: "BU" },
  { id: 78, name: "Mountain Climber", muscle: "Full Body", equipment: "Bodyweight", imagePlaceholder: "MC" },
  { id: 79, name: "Jump Rope", muscle: "Cardio", equipment: "Rope", imagePlaceholder: "JR" },
  { id: 80, name: "Treadmill Run", muscle: "Cardio", equipment: "Cardio Machine", imagePlaceholder: "TR" },
  { id: 81, name: "Stationary Bike", muscle: "Cardio", equipment: "Cardio Machine", imagePlaceholder: "SB" },
  { id: 82, name: "Elliptical", muscle: "Cardio", equipment: "Cardio Machine", imagePlaceholder: "EL" },
  { id: 83, name: "Rowing Machine", muscle: "Cardio", equipment: "Cardio Machine", imagePlaceholder: "RM" },
  { id: 84, name: "Battle Rope", muscle: "Full Body", equipment: "Rope", imagePlaceholder: "BR" },
  { id: 85, name: "Farmer Carry (Dumbbell)", muscle: "Full Body", equipment: "Dumbbell", imagePlaceholder: "FC" },
  { id: 86, name: "Sled Push", muscle: "Full Body", equipment: "Sled", imagePlaceholder: "SP" },
  { id: 87, name: "Medicine Ball Slam", muscle: "Full Body", equipment: "Medicine Ball", imagePlaceholder: "MS" },
  { id: 88, name: "Cable Woodchop", muscle: "Abdominals", equipment: "Cable", imagePlaceholder: "CW" },
  { id: 89, name: "Hip Abduction (Machine)", muscle: "Glutes", equipment: "Machine", imagePlaceholder: "HA" },
  { id: 90, name: "Hip Adduction (Machine)", muscle: "Adductors", equipment: "Machine", imagePlaceholder: "HA" },
  { id: 91, name: "Wrist Curl (Dumbbell)", muscle: "Forearms", equipment: "Dumbbell", imagePlaceholder: "WC" },
  { id: 92, name: "Reverse Curl (Barbell)", muscle: "Forearms", equipment: "Barbell", imagePlaceholder: "RC" },
  { id: 93, name: "Smith Machine Squat", muscle: "Quadriceps", equipment: "Smith Machine", imagePlaceholder: "SS" },
  { id: 94, name: "Smith Machine Bench Press", muscle: "Chest", equipment: "Smith Machine", imagePlaceholder: "SB" },
  { id: 95, name: "Smith Machine Shoulder Press", muscle: "Shoulders", equipment: "Smith Machine", imagePlaceholder: "SS" },
  { id: 96, name: "Machine Shoulder Press", muscle: "Shoulders", equipment: "Machine", imagePlaceholder: "MP" },
  { id: 97, name: "Machine Row", muscle: "Back", equipment: "Machine", imagePlaceholder: "MR" },
  { id: 98, name: "Machine Biceps Curl", muscle: "Biceps", equipment: "Machine", imagePlaceholder: "MB" },
  { id: 99, name: "Machine Triceps Extension", muscle: "Triceps", equipment: "Machine", imagePlaceholder: "MT" },
  { id: 100, name: "Assisted Dip (Machine)", muscle: "Triceps", equipment: "Machine", imagePlaceholder: "AD" },
];

const equipmentFilters = ["All Equipment", ...Array.from(new Set(exerciseLibrary.map((exercise) => exercise.equipment)))];
const muscleFilters = ["All Muscles", ...Array.from(new Set(exerciseLibrary.map((exercise) => exercise.muscle)))];

const emptyWorkoutSession: Omit<WorkoutSession, "id" | "expanded"> = {
  name: "",
  type: "Strength",
  date: todayDate,
  notes: "",
  exercises: [],
};

const emptyMeal: Omit<MealEntry, "id"> = {
  date: todayDate,
  time: "09:00",
  type: "Breakfast",
  food: "",
  quantity: "",
  calories: "",
  protein: "",
  notes: "",
};

const emptyProgress: Omit<ProgressEntry, "id"> = {
  date: todayDate,
  weight: "",
  bodyFat: "",
  waist: "",
  chest: "",
  arms: "",
  notes: "",
};

const emptyProfile: ProfileForm = {
  fullName: "",
  phone: "",
  email: "",
  height: "",
  currentWeight: "",
  fitnessGoal: "General Fitness",
  medicalNotes: "",
};

function inputClass() {
  return "h-11 w-full rounded-lg border border-white/10 bg-black/25 px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-lime-300/60";
}

function areaClass() {
  return "min-h-24 w-full rounded-lg border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-lime-300/60";
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-lg border border-white/10 bg-[#111713] p-5 shadow-2xl shadow-black/20 ${className}`}>{children}</section>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <p className="text-sm font-semibold text-zinc-400">{label}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function ActionButton({ children, onClick, tone = "default" }: { children: ReactNode; onClick?: () => void; tone?: "default" | "danger" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        tone === "danger"
          ? "rounded-md border border-red-300/20 bg-red-300/10 px-3 py-2 text-xs font-bold text-red-200 transition hover:bg-red-300/15"
          : "rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-bold text-zinc-300 transition hover:border-lime-300/40 hover:text-lime-200"
      }
    >
      {children}
    </button>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm font-semibold text-zinc-500">{text}</p>;
}

function profileFromRow(row: MemberProfile): ProfileForm {
  return {
    fullName: row.full_name ?? "",
    phone: row.phone ?? "",
    email: row.email ?? "",
    height: row.height === null ? "" : String(row.height),
    currentWeight: row.current_weight === null ? "" : String(row.current_weight),
    fitnessGoal: fitnessGoals.includes(row.fitness_goal as FitnessGoal) ? (row.fitness_goal as FitnessGoal) : "General Fitness",
    medicalNotes: row.medical_notes ?? "",
  };
}

function numberOrNull(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const parsedValue = Number(trimmedValue);
  return Number.isNaN(parsedValue) ? null : parsedValue;
}

function calculateTotalSets(exercises: WorkoutExercise[]) {
  return exercises.reduce((total, exercise) => total + exercise.sets.length, 0);
}

function calculateCompletedSets(exercises: WorkoutExercise[]) {
  return exercises.reduce((total, exercise) => total + exercise.sets.filter((set) => set.completed).length, 0);
}

function calculateTotalVolume(exercises: WorkoutExercise[]) {
  return exercises.reduce(
    (total, exercise) =>
      total +
      exercise.sets.reduce((exerciseTotal, set) => {
        const weight = Number(set.weight || 0);
        const reps = Number(set.reps || 0);
        return exerciseTotal + weight * reps;
      }, 0),
    0,
  );
}

export default function MemberPortalContent() {
  const [activeSection, setActiveSection] = useState<MemberSection>("Dashboard");
  const [savedWorkouts, setSavedWorkouts] = useState<WorkoutSession[]>([]);
  const [workoutSession, setWorkoutSession] = useState<Omit<WorkoutSession, "id" | "expanded">>(emptyWorkoutSession);
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [equipmentFilter, setEquipmentFilter] = useState("All Equipment");
  const [muscleFilter, setMuscleFilter] = useState("All Muscles");
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<number[]>([]);
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [mealForm, setMealForm] = useState<Omit<MealEntry, "id">>(emptyMeal);
  const [editingMealId, setEditingMealId] = useState<number | null>(null);
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [progressForm, setProgressForm] = useState<Omit<ProgressEntry, "id">>(emptyProgress);
  const [editingProgressId, setEditingProgressId] = useState<number | null>(null);
  const [photos, setPhotos] = useState<PhotoEntry[]>([]);
  const [photoType, setPhotoType] = useState<PhotoType>("Front");
  const [photoDate, setPhotoDate] = useState(todayDate);
  const [photoNotes, setPhotoNotes] = useState("");
  const [profile, setProfile] = useState<ProfileForm>(emptyProfile);
  const [profileGymId, setProfileGymId] = useState<MemberPortalId | null>(null);
  const [profileMemberId, setProfileMemberId] = useState<MemberPortalId | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const todayMeals = useMemo(() => meals.filter((meal) => meal.date === todayDate), [meals]);
  const mealTotals = useMemo(
    () => ({
      calories: todayMeals.reduce((total, meal) => total + Number(meal.calories || 0), 0),
      protein: todayMeals.reduce((total, meal) => total + Number(meal.protein || 0), 0),
      count: todayMeals.length,
    }),
    [todayMeals],
  );

  const latestProgress = progressEntries[0];
  const previousProgress = progressEntries[1];
  const recentPortalActivity = useMemo(() => {
    const workoutItems = savedWorkouts.map((entry) => ({
      id: entry.id,
      action: "Workout added",
      detail: entry.name || entry.type,
      time: entry.date,
    }));
    const mealItems = meals.map((entry) => ({
      id: entry.id,
      action: "Meal logged",
      detail: entry.food,
      time: entry.date,
    }));
    const progressItems = progressEntries.map((entry) => ({
      id: entry.id,
      action: "Weight updated",
      detail: entry.weight ? `${entry.weight} kg` : "Progress entry",
      time: entry.date,
    }));
    const photoItems = photos.map((entry) => ({
      id: entry.id,
      action: "Photo uploaded",
      detail: `${entry.type} photo`,
      time: entry.date,
    }));

    return [...workoutItems, ...mealItems, ...progressItems, ...photoItems].sort((a, b) => Number(b.id) - Number(a.id)).slice(0, 3);
  }, [meals, photos, progressEntries, savedWorkouts]);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(async () => {
      setProfileLoading(true);
      setProfileError("");

      const gymResult = await getCurrentAdminGym();

      if (!active) {
        return;
      }

      if (gymResult.error || !gymResult.data?.gym_id) {
        setProfileError("Profile is not connected yet.");
        setProfileLoading(false);
        return;
      }

      setProfileGymId(gymResult.data.gym_id);
      const demoProfileResult = await getMemberProfile(gymResult.data.gym_id, DEMO_MEMBER_ID);
      const profileResult = demoProfileResult.data || demoProfileResult.error ? demoProfileResult : await getFirstGymMemberProfile(gymResult.data.gym_id);

      if (!active) {
        return;
      }

      if (profileResult.error) {
        setProfileError("Could not load profile.");
        setProfileLoading(false);
        return;
      }

      if (profileResult.data) {
        setProfileMemberId(profileResult.data.id);
        setProfile(profileFromRow(profileResult.data));
      } else {
        setProfileMemberId(null);
      }

      setProfileLoading(false);
    }, 0);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, []);

  function toggleExerciseSelection(exerciseId: number) {
    setSelectedExerciseIds((current) => (current.includes(exerciseId) ? current.filter((id) => id !== exerciseId) : [...current, exerciseId]));
  }

  function addSelectedExercisesToSession() {
    const existingLibraryIds = new Set(workoutSession.exercises.map((exercise) => exercise.libraryId));
    const nextExercises = exerciseLibrary
      .filter((exercise) => selectedExerciseIds.includes(exercise.id) && !existingLibraryIds.has(exercise.id))
      .map<WorkoutExercise>((exercise) => ({
        id: Date.now() + exercise.id,
        libraryId: exercise.id,
        name: exercise.name,
        muscle: exercise.muscle,
        equipment: exercise.equipment,
        notes: "",
        sets: [{ id: Date.now() + exercise.id + 1000, weight: "", reps: "", rpe: "", completed: false }],
      }));

    setWorkoutSession((current) => ({ ...current, exercises: [...current.exercises, ...nextExercises] }));
    setSelectedExerciseIds([]);
    setExerciseModalOpen(false);
  }

  function updateWorkoutExercise(exerciseId: number, updates: Partial<WorkoutExercise>) {
    setWorkoutSession((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) => (exercise.id === exerciseId ? { ...exercise, ...updates } : exercise)),
    }));
  }

  function updateWorkoutSet(exerciseId: number, setId: number, updates: Partial<WorkoutSet>) {
    setWorkoutSession((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) =>
        exercise.id === exerciseId
          ? { ...exercise, sets: exercise.sets.map((set) => (set.id === setId ? { ...set, ...updates } : set)) }
          : exercise,
      ),
    }));
  }

  function addSetToExercise(exerciseId: number) {
    setWorkoutSession((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, sets: [...exercise.sets, { id: Date.now(), weight: "", reps: "", rpe: "", completed: false }] } : exercise,
      ),
    }));
  }

  function removeSetFromExercise(exerciseId: number, setId: number) {
    setWorkoutSession((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, sets: exercise.sets.filter((set) => set.id !== setId) } : exercise,
      ),
    }));
  }

  function duplicateWorkoutExercise(exercise: WorkoutExercise) {
    setWorkoutSession((current) => ({
      ...current,
      exercises: [
        ...current.exercises,
        {
          ...exercise,
          id: Date.now(),
          sets: exercise.sets.map((set, index) => ({ ...set, id: Date.now() + index + 1, completed: false })),
        },
      ],
    }));
  }

  function removeWorkoutExercise(exerciseId: number) {
    setWorkoutSession((current) => ({ ...current, exercises: current.exercises.filter((exercise) => exercise.id !== exerciseId) }));
  }

  function saveWorkoutSession() {
    if (!workoutSession.exercises.length) return;
    const savedSession: WorkoutSession = {
      id: Date.now(),
      name: workoutSession.name.trim() || "Workout",
      type: workoutSession.type.trim() || "Training",
      date: workoutSession.date,
      notes: workoutSession.notes,
      exercises: workoutSession.exercises,
      expanded: false,
    };
    setSavedWorkouts((current) => [savedSession, ...current]);
    setWorkoutSession(emptyWorkoutSession);
  }

  function saveMeal() {
    if (!mealForm.food.trim()) return;
    if (editingMealId) {
      setMeals((current) => current.map((entry) => (entry.id === editingMealId ? { id: entry.id, ...mealForm } : entry)));
    } else {
      setMeals((current) => [{ id: Date.now(), ...mealForm }, ...current]);
    }
    setMealForm(emptyMeal);
    setEditingMealId(null);
  }

  function editMeal(entry: MealEntry) {
    setMealForm({ date: entry.date, time: entry.time, type: entry.type, food: entry.food, quantity: entry.quantity, calories: entry.calories, protein: entry.protein, notes: entry.notes });
    setEditingMealId(entry.id);
  }

  function saveProgress() {
    if (!progressForm.weight.trim()) return;
    if (editingProgressId) {
      setProgressEntries((current) => current.map((entry) => (entry.id === editingProgressId ? { id: entry.id, ...progressForm } : entry)));
    } else {
      setProgressEntries((current) => [{ id: Date.now(), ...progressForm }, ...current]);
    }
    setProgressForm(emptyProgress);
    setEditingProgressId(null);
  }

  function editProgress(entry: ProgressEntry) {
    setProgressForm({ date: entry.date, weight: entry.weight, bodyFat: entry.bodyFat, waist: entry.waist, chest: entry.chest, arms: entry.arms, notes: entry.notes });
    setEditingProgressId(entry.id);
  }

  function addPhoto(file: File | null) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotos((current) => [{ id: Date.now(), type: photoType, date: photoDate, notes: photoNotes, url, fileName: file.name }, ...current]);
    setPhotoNotes("");
  }

  function deletePhoto(photo: PhotoEntry) {
    URL.revokeObjectURL(photo.url);
    setPhotos((current) => current.filter((item) => item.id !== photo.id));
  }

  async function saveProfileToSupabase() {
    setProfileSaved(false);
    setProfileError("");

    const resolvedGymId = profileGymId ?? (await getCurrentAdminGym()).data?.gym_id ?? null;

    if (!resolvedGymId) {
      setProfileError("Profile is not connected yet.");
      return;
    }

    const resolvedMemberId = profileMemberId ?? (await getMemberProfile(resolvedGymId, DEMO_MEMBER_ID)).data?.id ?? (await getFirstGymMemberProfile(resolvedGymId)).data?.id ?? null;

    if (!resolvedMemberId) {
      setProfileError("No member record found for this gym.");
      return;
    }

    setProfileSaving(true);
    const { error } = await saveMemberProfile({
      gym_id: resolvedGymId,
      member_id: resolvedMemberId,
      full_name: profile.fullName.trim() || null,
      phone: profile.phone.trim() || null,
      email: profile.email.trim() || null,
      height: numberOrNull(profile.height),
      current_weight: numberOrNull(profile.currentWeight),
      fitness_goal: profile.fitnessGoal,
      medical_notes: profile.medicalNotes.trim() || null,
    });

    if (error) {
      setProfileError("Could not save profile.");
      setProfileSaving(false);
      return;
    }

    setProfileGymId(resolvedGymId);
    setProfileMemberId(resolvedMemberId);
    setProfileSaved(true);
    setProfileSaving(false);
  }

  function renderDashboard() {
    return (
      <div className="space-y-6">
        <Card>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-lime-300">Member Dashboard</p>
          <h2 className="mt-3 text-2xl font-black tracking-normal text-white sm:text-3xl">
            {profile.fullName.trim() ? `Hello, ${profile.fullName.trim()}.` : "Hello."} Let&apos;s track today&apos;s progress.
          </h2>
        </Card>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {[
            { title: "Add Workout", subtitle: "Log today's training session.", target: "Add Workout" as MemberSection },
            { title: "Add Meal", subtitle: "Track your nutrition for today.", target: "Meal Log" as MemberSection },
            { title: "Upload Photo", subtitle: "Capture today's visual progress.", target: "Progress Photos" as MemberSection },
          ].map((card) => (
            <button
              key={card.title}
              type="button"
              onClick={() => setActiveSection(card.target)}
              className="rounded-lg border border-lime-300/20 bg-lime-300/[0.08] p-5 text-left shadow-2xl shadow-black/20 transition hover:border-lime-300/50 hover:bg-lime-300/[0.12]"
            >
              <p className="text-xl font-black text-white">+ {card.title}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{card.subtitle}</p>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <Card>
            <h3 className="text-lg font-black text-white">Today&apos;s Status</h3>
            <div className="mt-5 grid gap-4">
              {[
                { label: "Workout Logged", value: savedWorkouts.some((entry) => entry.date === todayDate) ? "Yes" : "No", progress: savedWorkouts.some((entry) => entry.date === todayDate) ? "100%" : "0%" },
                { label: "Meals Tracked", value: `${todayMeals.length}/4`, progress: `${Math.min(todayMeals.length * 25, 100)}%` },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-bold text-zinc-300">{item.label}</p>
                    <p className="text-sm font-black text-white">{item.value}</p>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-lime-400" style={{ width: item.progress }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="text-lg font-black text-white">Recent Activity</h3>
            <div className="mt-5 grid gap-3">
              {recentPortalActivity.length ? recentPortalActivity.map((item) => (
                <div key={`${item.action}-${item.time}`} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-bold text-white">{item.action}</p>
                      <p className="mt-1 text-sm text-zinc-400">{item.detail}</p>
                    </div>
                    <p className="shrink-0 text-xs font-bold text-zinc-500">{item.time}</p>
                  </div>
                </div>
              )) : <EmptyState text="No recent activity yet." />}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  function renderWorkout() {
    const filteredExercises = exerciseLibrary.filter((exercise) => {
      const matchesSearch = exercise.name.toLowerCase().includes(exerciseSearch.trim().toLowerCase());
      const matchesEquipment = equipmentFilter === "All Equipment" || exercise.equipment === equipmentFilter;
      const matchesMuscle = muscleFilter === "All Muscles" || exercise.muscle === muscleFilter;
      return matchesSearch && matchesEquipment && matchesMuscle;
    });
    const currentTotalSets = calculateTotalSets(workoutSession.exercises);
    const currentCompletedSets = calculateCompletedSets(workoutSession.exercises);
    const currentTotalVolume = calculateTotalVolume(workoutSession.exercises);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MiniMetric label="Exercises" value={String(workoutSession.exercises.length)} />
          <MiniMetric label="Total Sets" value={String(currentTotalSets)} />
          <MiniMetric label="Volume" value={`${currentTotalVolume} kg`} />
          <MiniMetric label="Completed" value={String(currentCompletedSets)} />
        </div>

        <Card>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_180px] lg:items-end">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Workout Name"><input value={workoutSession.name} onChange={(event) => setWorkoutSession((current) => ({ ...current, name: event.target.value }))} placeholder="Push day, Leg day..." className={inputClass()} /></Field>
              <Field label="Workout Type"><input value={workoutSession.type} onChange={(event) => setWorkoutSession((current) => ({ ...current, type: event.target.value }))} className={inputClass()} /></Field>
              <Field label="Date"><input type="date" value={workoutSession.date} onChange={(event) => setWorkoutSession((current) => ({ ...current, date: event.target.value }))} className={inputClass()} /></Field>
              <Field label="Notes"><input value={workoutSession.notes} onChange={(event) => setWorkoutSession((current) => ({ ...current, notes: event.target.value }))} placeholder="Session notes" className={inputClass()} /></Field>
            </div>
            <button type="button" onClick={() => setExerciseModalOpen(true)} className="h-11 rounded-lg bg-lime-400 px-5 text-sm font-black text-[#07100b]">Add Exercise</button>
          </div>
        </Card>

        <div className="grid gap-4">
          {workoutSession.exercises.length ? workoutSession.exercises.map((exercise) => (
            <Card key={exercise.id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-xl font-black text-white">{exercise.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-zinc-400">{exercise.muscle} - {exercise.equipment}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <ActionButton onClick={() => duplicateWorkoutExercise(exercise)}>Duplicate</ActionButton>
                  <ActionButton tone="danger" onClick={() => removeWorkoutExercise(exercise.id)}>Remove</ActionButton>
                </div>
              </div>
              <div className="mt-4">
                <Field label="Exercise Notes"><input value={exercise.notes} onChange={(event) => updateWorkoutExercise(exercise.id, { notes: event.target.value })} className={inputClass()} /></Field>
              </div>
              <div className="mt-5 grid gap-2">
                <div className="grid grid-cols-[40px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)_42px_42px] gap-2 text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">
                  <span>Set</span>
                  <span>Kg</span>
                  <span>Reps</span>
                  <span>RPE</span>
                  <span>Done</span>
                  <span />
                </div>
                {exercise.sets.map((set, index) => (
                  <div key={set.id} className="grid grid-cols-[40px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)_42px_42px] items-center gap-2">
                    <p className="text-sm font-black text-white">{index + 1}</p>
                    <input inputMode="decimal" value={set.weight} onChange={(event) => updateWorkoutSet(exercise.id, set.id, { weight: event.target.value })} className="h-10 min-w-0 rounded-lg border border-white/10 bg-black/25 px-2 text-sm text-white outline-none focus:border-lime-300/60" />
                    <input inputMode="numeric" value={set.reps} onChange={(event) => updateWorkoutSet(exercise.id, set.id, { reps: event.target.value })} className="h-10 min-w-0 rounded-lg border border-white/10 bg-black/25 px-2 text-sm text-white outline-none focus:border-lime-300/60" />
                    <input inputMode="decimal" value={set.rpe} onChange={(event) => updateWorkoutSet(exercise.id, set.id, { rpe: event.target.value })} className="h-10 min-w-0 rounded-lg border border-white/10 bg-black/25 px-2 text-sm text-white outline-none focus:border-lime-300/60" />
                    <input type="checkbox" checked={set.completed} onChange={(event) => updateWorkoutSet(exercise.id, set.id, { completed: event.target.checked })} className="h-5 w-5 justify-self-center accent-lime-400" />
                    <button type="button" onClick={() => removeSetFromExercise(exercise.id, set.id)} className="h-9 rounded-lg border border-red-300/20 bg-red-300/10 text-xs font-black text-red-200">-</button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => addSetToExercise(exercise.id)} className="mt-4 h-10 rounded-lg border border-lime-300/20 bg-lime-300/10 px-4 text-sm font-black text-lime-100">Add Set</button>
            </Card>
          )) : <EmptyState text="No exercises selected yet. Add exercises to build your workout." />}
        </div>

        <button type="button" onClick={saveWorkoutSession} disabled={!workoutSession.exercises.length} className="h-12 w-full rounded-lg bg-lime-400 px-5 text-sm font-black text-[#07100b] disabled:cursor-not-allowed disabled:opacity-60">Save Workout</button>

        <Card>
          <h2 className="text-xl font-black text-white">Workout History</h2>
          <div className="mt-5 grid gap-3">
            {savedWorkouts.length ? savedWorkouts.map((session) => (
              <div key={session.id} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <button
                  type="button"
                  onClick={() => setSavedWorkouts((current) => current.map((item) => (item.id === session.id ? { ...item, expanded: !item.expanded } : item)))}
                  className="flex w-full flex-col gap-2 text-left sm:flex-row sm:items-start sm:justify-between"
                >
                  <span>
                    <span className="block font-black text-white">{session.name}</span>
                    <span className="mt-1 block text-sm text-zinc-400">{session.date} - {session.exercises.length} exercises - {calculateTotalSets(session.exercises)} sets - {calculateTotalVolume(session.exercises)} kg</span>
                  </span>
                  <span className="text-sm font-black text-lime-200">{session.expanded ? "Hide" : "View"}</span>
                </button>
                {session.expanded ? (
                  <div className="mt-4 grid gap-3 border-t border-white/10 pt-4">
                    {session.exercises.map((exercise) => (
                      <div key={exercise.id} className="rounded-lg bg-black/20 p-3">
                        <p className="font-bold text-white">{exercise.name}</p>
                        <p className="mt-1 text-sm text-zinc-400">{exercise.sets.length} sets - {calculateTotalVolume([exercise])} kg volume</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            )) : <EmptyState text="No saved workouts yet." />}
          </div>
        </Card>

        {exerciseModalOpen ? (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm md:grid md:place-items-center md:px-4 md:py-6">
            <section className="flex h-full w-full flex-col bg-[#101511] md:h-[86vh] md:max-w-2xl md:overflow-hidden md:rounded-lg md:border md:border-white/10 md:shadow-2xl md:shadow-black">
              <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-[#101511] px-4">
                <button type="button" onClick={() => { setSelectedExerciseIds([]); setExerciseModalOpen(false); }} className="text-sm font-black text-zinc-300">Cancel</button>
                <h2 className="text-base font-black text-white">Add Exercise</h2>
                <button type="button" onClick={addSelectedExercisesToSession} className="text-sm font-black text-lime-300">Create</button>
              </header>
              <div className="shrink-0 space-y-3 border-b border-white/10 p-4">
                <input value={exerciseSearch} onChange={(event) => setExerciseSearch(event.target.value)} placeholder="Search exercise" className={inputClass()} />
                <div className="grid grid-cols-2 gap-2">
                  <select value={equipmentFilter} onChange={(event) => setEquipmentFilter(event.target.value)} className={inputClass()}>{equipmentFilters.map((filter) => <option key={filter}>{filter}</option>)}</select>
                  <select value={muscleFilter} onChange={(event) => setMuscleFilter(event.target.value)} className={inputClass()}>{muscleFilters.map((filter) => <option key={filter}>{filter}</option>)}</select>
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto p-3">
                <div className="grid gap-2">
                  {filteredExercises.map((exercise) => {
                    const selected = selectedExerciseIds.includes(exercise.id);
                    return (
                      <button
                        key={exercise.id}
                        type="button"
                        onClick={() => toggleExerciseSelection(exercise.id)}
                        className={`flex items-center gap-3 rounded-lg border p-3 text-left transition ${
                          selected ? "border-lime-300/50 bg-lime-300/10" : "border-white/10 bg-white/[0.035] hover:border-lime-300/30"
                        }`}
                      >
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-lime-300/12 text-xs font-black text-lime-200">{exercise.imagePlaceholder}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-black text-white">{exercise.name}</span>
                          <span className="mt-1 block text-sm text-zinc-400">{exercise.muscle} - {exercise.equipment}</span>
                        </span>
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border text-sm font-black ${selected ? "border-lime-300 bg-lime-400 text-[#07100b]" : "border-white/10 text-zinc-400"}`}>{selected ? "✓" : "+"}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        ) : null}
      </div>
    );
  }

  function renderMealLog() {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MiniMetric label="Total Calories" value={String(mealTotals.calories)} />
          <MiniMetric label="Total Protein" value={`${mealTotals.protein}g`} />
          <MiniMetric label="Meals Logged" value={String(mealTotals.count)} />
        </div>
        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <Card>
            <h2 className="text-xl font-black text-white">{editingMealId ? "Edit Meal" : "Add Meal"}</h2>
            <div className="mt-5 grid gap-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Date"><input type="date" value={mealForm.date} onChange={(event) => setMealForm((current) => ({ ...current, date: event.target.value }))} className={inputClass()} /></Field>
                <Field label="Time"><input type="time" value={mealForm.time} onChange={(event) => setMealForm((current) => ({ ...current, time: event.target.value }))} className={inputClass()} /></Field>
              </div>
              <Field label="Meal Type"><select value={mealForm.type} onChange={(event) => setMealForm((current) => ({ ...current, type: event.target.value as MealType }))} className={inputClass()}>{mealTypes.map((type) => <option key={type}>{type}</option>)}</select></Field>
              <Field label="Food Name"><input value={mealForm.food} onChange={(event) => setMealForm((current) => ({ ...current, food: event.target.value }))} className={inputClass()} /></Field>
              <Field label="Quantity"><input value={mealForm.quantity} onChange={(event) => setMealForm((current) => ({ ...current, quantity: event.target.value }))} className={inputClass()} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Calories"><input value={mealForm.calories} onChange={(event) => setMealForm((current) => ({ ...current, calories: event.target.value }))} className={inputClass()} /></Field>
                <Field label="Protein"><input value={mealForm.protein} onChange={(event) => setMealForm((current) => ({ ...current, protein: event.target.value }))} className={inputClass()} /></Field>
              </div>
              <Field label="Notes"><textarea value={mealForm.notes} onChange={(event) => setMealForm((current) => ({ ...current, notes: event.target.value }))} className={areaClass()} /></Field>
              <button type="button" onClick={saveMeal} className="h-11 rounded-lg bg-lime-400 px-5 text-sm font-black text-[#07100b]">{editingMealId ? "Update Meal" : "Add Meal"}</button>
            </div>
          </Card>
          <Card>
            <h2 className="text-xl font-black text-white">Meal History</h2>
            <div className="mt-5 grid gap-3">
              {meals.length ? meals.map((entry) => (
                <div key={entry.id} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-black text-white">{entry.food}</p>
                      <p className="mt-1 text-sm text-zinc-400">{entry.date} {entry.time} - {entry.type} - {entry.quantity}</p>
                      <p className="mt-1 text-sm font-bold text-lime-200">{entry.calories || 0} cal - {entry.protein || 0}g protein</p>
                    </div>
                    <div className="flex gap-2">
                      <ActionButton onClick={() => editMeal(entry)}>Edit</ActionButton>
                      <ActionButton tone="danger" onClick={() => setMeals((current) => current.filter((item) => item.id !== entry.id))}>Delete</ActionButton>
                    </div>
                  </div>
                </div>
              )) : <EmptyState text="No meals logged yet." />}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  function renderProgress() {
    const weightChange = latestProgress && previousProgress ? Number(latestProgress.weight || 0) - Number(previousProgress.weight || 0) : 0;
    const bodyFatChange = latestProgress && previousProgress ? Number(latestProgress.bodyFat || 0) - Number(previousProgress.bodyFat || 0) : 0;
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <MiniMetric label="Latest Weight" value={`${latestProgress?.weight ?? "-"} kg`} />
          <MiniMetric label="Latest Body Fat" value={`${latestProgress?.bodyFat ?? "-"}%`} />
          <MiniMetric label="Latest Waist" value={`${latestProgress?.waist ?? "-"} in`} />
          <MiniMetric label="Latest vs Previous" value={`${weightChange.toFixed(1)} kg / ${bodyFatChange.toFixed(1)}%`} />
        </div>
        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <Card>
            <h2 className="text-xl font-black text-white">{editingProgressId ? "Edit Progress" : "Add Progress"}</h2>
            <div className="mt-5 grid gap-4">
              <Field label="Date"><input type="date" value={progressForm.date} onChange={(event) => setProgressForm((current) => ({ ...current, date: event.target.value }))} className={inputClass()} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Weight"><input value={progressForm.weight} onChange={(event) => setProgressForm((current) => ({ ...current, weight: event.target.value }))} className={inputClass()} /></Field>
                <Field label="Body Fat %"><input value={progressForm.bodyFat} onChange={(event) => setProgressForm((current) => ({ ...current, bodyFat: event.target.value }))} className={inputClass()} /></Field>
                <Field label="Waist"><input value={progressForm.waist} onChange={(event) => setProgressForm((current) => ({ ...current, waist: event.target.value }))} className={inputClass()} /></Field>
                <Field label="Chest"><input value={progressForm.chest} onChange={(event) => setProgressForm((current) => ({ ...current, chest: event.target.value }))} className={inputClass()} /></Field>
                <Field label="Arms"><input value={progressForm.arms} onChange={(event) => setProgressForm((current) => ({ ...current, arms: event.target.value }))} className={inputClass()} /></Field>
              </div>
              <Field label="Notes"><textarea value={progressForm.notes} onChange={(event) => setProgressForm((current) => ({ ...current, notes: event.target.value }))} className={areaClass()} /></Field>
              <button type="button" onClick={saveProgress} className="h-11 rounded-lg bg-lime-400 px-5 text-sm font-black text-[#07100b]">{editingProgressId ? "Update Progress" : "Add Progress"}</button>
            </div>
          </Card>
          <Card>
            <h2 className="text-xl font-black text-white">Progress History</h2>
            <div className="mt-5 grid gap-3">
              {progressEntries.map((entry) => (
                <div key={entry.id} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-black text-white">{entry.date}</p>
                      <p className="mt-1 text-sm text-zinc-400">{entry.weight} kg - {entry.bodyFat}% body fat - Waist {entry.waist}</p>
                    </div>
                    <div className="flex gap-2">
                      <ActionButton onClick={() => editProgress(entry)}>Edit</ActionButton>
                      <ActionButton tone="danger" onClick={() => setProgressEntries((current) => current.filter((item) => item.id !== entry.id))}>Delete</ActionButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  function renderPhotos() {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <Card>
            <h2 className="text-xl font-black text-white">Upload Progress Photo</h2>
            <div className="mt-5 grid gap-4">
              <Field label="Photo Type"><select value={photoType} onChange={(event) => setPhotoType(event.target.value as PhotoType)} className={inputClass()}>{photoTypes.map((type) => <option key={type}>{type}</option>)}</select></Field>
              <Field label="Date"><input type="date" value={photoDate} onChange={(event) => setPhotoDate(event.target.value)} className={inputClass()} /></Field>
              <Field label="Notes"><textarea value={photoNotes} onChange={(event) => setPhotoNotes(event.target.value)} className={areaClass()} /></Field>
              <Field label="File Upload"><input type="file" accept="image/*" onChange={(event) => addPhoto(event.target.files?.[0] ?? null)} className="w-full rounded-lg border border-white/10 bg-black/25 px-3 py-3 text-sm text-zinc-300 file:mr-3 file:rounded-md file:border-0 file:bg-lime-400 file:px-3 file:py-2 file:text-sm file:font-black file:text-[#07100b]" /></Field>
              <button type="button" className="h-11 rounded-lg border border-lime-300/30 bg-lime-300/10 px-5 text-sm font-black text-lime-100">Compare Photos</button>
            </div>
          </Card>
          <div className="grid gap-4">
            {photoTypes.map((type) => (
              <Card key={type}>
                <h3 className="text-lg font-black text-white">{type} Photos</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {photos.filter((photo) => photo.type === type).length ? photos.filter((photo) => photo.type === type).map((photo) => (
                    <article key={photo.id} className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.035]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.url} alt={`${photo.type} progress`} className="aspect-[4/3] w-full object-cover" />
                      <div className="p-3">
                        <p className="font-bold text-white">{photo.date}</p>
                        <p className="mt-1 text-sm text-zinc-400">{photo.notes || photo.fileName}</p>
                        <button type="button" onClick={() => deletePhoto(photo)} className="mt-3 rounded-md border border-red-300/20 bg-red-300/10 px-3 py-2 text-xs font-bold text-red-200">Delete</button>
                      </div>
                    </article>
                  )) : <EmptyState text={`No ${type.toLowerCase()} photos yet.`} />}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderMembership() {
    return (
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <h2 className="text-xl font-black text-white">Membership</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ["Plan Name", "Not available"],
              ["Start Date", "Not available"],
              ["Expiry Date", "Not available"],
              ["Status", "Not available"],
              ["Days Remaining", "Not available"],
              ["Assigned Trainer", "Not assigned"],
              ["Branch", "Not available"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">{label}</p>
                <p className="mt-2 font-black text-white">{value}</p>
              </div>
            ))}
          </div>
          <button type="button" className="mt-5 h-11 rounded-lg bg-lime-400 px-5 text-sm font-black text-[#07100b]">Renew Membership</button>
        </Card>
        <Card>
          <h2 className="text-xl font-black text-white">Timeline</h2>
          <div className="mt-5 space-y-4">
            <EmptyState text="No membership timeline available yet." />
          </div>
        </Card>
      </div>
    );
  }

  function renderProfile() {
    return (
      <Card className="max-w-3xl">
        <h2 className="text-xl font-black text-white">Profile</h2>
        {profileLoading ? <p className="mt-4 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-sm font-semibold text-zinc-400">Loading profile...</p> : null}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Full Name"><input value={profile.fullName} onChange={(event) => setProfile((current) => ({ ...current, fullName: event.target.value }))} className={inputClass()} /></Field>
          <Field label="Phone"><input value={profile.phone} onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))} className={inputClass()} /></Field>
          <Field label="Email"><input value={profile.email} onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))} className={inputClass()} /></Field>
          <Field label="Height"><input value={profile.height} onChange={(event) => setProfile((current) => ({ ...current, height: event.target.value }))} className={inputClass()} /></Field>
          <Field label="Current Weight"><input value={profile.currentWeight} onChange={(event) => setProfile((current) => ({ ...current, currentWeight: event.target.value }))} className={inputClass()} /></Field>
          <Field label="Fitness Goal"><select value={profile.fitnessGoal} onChange={(event) => setProfile((current) => ({ ...current, fitnessGoal: event.target.value as FitnessGoal }))} className={inputClass()}>{fitnessGoals.map((goal) => <option key={goal}>{goal}</option>)}</select></Field>
          <div className="sm:col-span-2"><Field label="Medical Notes"><textarea value={profile.medicalNotes} onChange={(event) => setProfile((current) => ({ ...current, medicalNotes: event.target.value }))} className={areaClass()} /></Field></div>
        </div>
        {profileSaved ? <p className="mt-4 rounded-lg border border-lime-300/20 bg-lime-300/10 px-3 py-2 text-sm font-semibold text-lime-100">Profile saved.</p> : null}
        {profileError ? <p className="mt-4 rounded-lg border border-red-300/20 bg-red-300/10 px-3 py-2 text-sm font-semibold text-red-100">{profileError}</p> : null}
        <button
          type="button"
          onClick={saveProfileToSupabase}
          disabled={profileSaving || profileLoading}
          className="mt-5 h-11 rounded-lg bg-lime-400 px-5 text-sm font-black text-[#07100b] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {profileSaving ? "Saving..." : "Save Profile"}
        </button>
      </Card>
    );
  }

  function renderSupport() {
    const faqs = [
      ["How do I update my workout?", "Open Add Workout, edit an entry, and save it."],
      ["Can I renew membership here?", "The renewal button is UI-only for now. Please contact the gym desk."],
      ["Can I upload progress photos?", "Yes, photos preview locally in this browser only."],
      ["How do I reach my trainer?", "Use the assigned trainer contact card on this page."],
    ];
    return (
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-black text-white">Contact</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <p className="font-black text-white">Trainer not assigned</p>
                <p className="mt-1 text-sm text-zinc-400">Assigned Trainer</p>
                <p className="mt-3 text-sm font-bold text-lime-200">Contact not available</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <p className="font-black text-white">Gym contact unavailable</p>
                <p className="mt-1 text-sm text-zinc-400">Gym Contact</p>
                <p className="mt-3 text-sm font-bold text-lime-200">Not available</p>
              </div>
            </div>
          </Card>
          <Card>
            <h2 className="text-xl font-black text-white">Message</h2>
            <textarea value={supportMessage} onChange={(event) => setSupportMessage(event.target.value)} placeholder="Write your message..." className={`mt-5 ${areaClass()}`} />
            <button type="button" className="mt-4 h-11 rounded-lg bg-lime-400 px-5 text-sm font-black text-[#07100b]">Submit</button>
          </Card>
        </div>
        <Card>
          <h2 className="text-xl font-black text-white">FAQ</h2>
          <div className="mt-5 grid gap-3">
            {faqs.map(([question, answer], index) => (
              <div key={question} className="rounded-lg border border-white/10 bg-white/[0.035]">
                <button type="button" onClick={() => setOpenFaq(openFaq === index ? null : index)} className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left font-bold text-white">
                  {question}
                  <span className="text-lime-300">{openFaq === index ? "-" : "+"}</span>
                </button>
                {openFaq === index ? <p className="px-4 pb-4 text-sm leading-6 text-zinc-400">{answer}</p> : null}
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  function renderActiveSection() {
    if (activeSection === "Dashboard") return renderDashboard();
    if (activeSection === "Add Workout") return renderWorkout();
    if (activeSection === "Meal Log") return renderMealLog();
    if (activeSection === "Progress") return renderProgress();
    if (activeSection === "Progress Photos") return renderPhotos();
    if (activeSection === "Membership") return renderMembership();
    if (activeSection === "Profile") return renderProfile();
    return renderSupport();
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="hidden rounded-lg border border-white/10 bg-[#111713] p-3 shadow-2xl shadow-black/20 lg:block">
        <nav className="grid gap-1">
          {memberNavigation.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setActiveSection(item)}
              className={`rounded-lg px-3 py-3 text-left text-sm font-bold transition ${
                activeSection === item ? "bg-lime-400 text-[#07100b]" : "text-zinc-300 hover:bg-white/[0.06] hover:text-lime-200"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 space-y-5">
        <div className="flex gap-2 overflow-x-auto rounded-lg border border-white/10 bg-[#111713] p-2 lg:hidden">
          {memberNavigation.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setActiveSection(item)}
              className={`shrink-0 rounded-md px-4 py-2 text-sm font-bold transition ${
                activeSection === item ? "bg-lime-400 text-[#07100b]" : "text-zinc-400 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        {renderActiveSection()}
      </div>
    </div>
  );
}
