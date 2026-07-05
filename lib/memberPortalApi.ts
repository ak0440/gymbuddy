import { supabase } from "./supabase";

/*
Required Supabase tables for future Member Portal persistence:

member_workouts:
id, gym_id, member_id, workout_date, workout_type, exercise_name, sets, reps, weight, notes, created_at

workout_sessions:
id, gym_id, member_id, workout_name, workout_type, workout_date, notes, created_at

workout_session_exercises:
id, session_id, gym_id, member_id, exercise_name, muscle, equipment, notes, sort_order, created_at

workout_sets:
id, session_id, session_exercise_id, gym_id, member_id, set_number, weight, reps, rpe, completed, created_at

member_meals:
id, gym_id, member_id, meal_date, meal_time, meal_type, food_name, quantity, calories, protein, notes, created_at

member_progress:
id, gym_id, member_id, progress_date, weight, body_fat, waist, chest, arms, notes, created_at

member_photos:
id, gym_id, member_id, photo_type, photo_url, photo_date, notes, created_at

member_support_messages:
id, gym_id, member_id, subject, message, status, created_at

Member profile fields are stored on members:
members.id, members.gym_id, full_name, phone, email, height, current_weight, fitness_goal, medical_notes

These helpers do not create tables and do not enable RLS. Every scoped read,
update, and delete filters by gym_id and member_id for future multi-gym safety.
*/

export type MemberPortalId = number | string;

export type MemberWorkout = {
  id: MemberPortalId;
  gym_id: MemberPortalId;
  member_id: MemberPortalId;
  workout_date: string;
  workout_type: string | null;
  exercise_name: string;
  sets: number | null;
  reps: number | null;
  weight: number | null;
  notes: string | null;
  created_at: string;
};

export type WorkoutSessionRow = {
  id: MemberPortalId;
  gym_id: MemberPortalId;
  member_id: MemberPortalId;
  workout_name: string | null;
  workout_type: string | null;
  workout_date: string;
  notes: string | null;
  created_at: string;
};

export type WorkoutSessionExerciseRow = {
  id: MemberPortalId;
  session_id: MemberPortalId;
  gym_id: MemberPortalId;
  member_id: MemberPortalId;
  exercise_name: string;
  muscle: string | null;
  equipment: string | null;
  notes: string | null;
  sort_order: number | null;
  created_at: string;
};

export type WorkoutSetRow = {
  id: MemberPortalId;
  session_id: MemberPortalId;
  session_exercise_id: MemberPortalId;
  gym_id: MemberPortalId;
  member_id: MemberPortalId;
  set_number: number;
  weight: number | null;
  reps: number | null;
  rpe: number | null;
  completed: boolean | null;
  created_at: string;
};

export type WorkoutSessionExercisePayload = {
  exercise_name: string;
  muscle: string | null;
  equipment: string | null;
  notes: string | null;
  sets: Array<{
    set_number: number;
    weight: number | null;
    reps: number | null;
    rpe: number | null;
    completed: boolean;
  }>;
};

export type WorkoutSessionPayload = {
  gym_id: MemberPortalId;
  member_id: MemberPortalId;
  workout_name: string;
  workout_type: string;
  workout_date: string;
  notes: string | null;
  exercises: WorkoutSessionExercisePayload[];
};

export type WorkoutSessionWithDetails = WorkoutSessionRow & {
  exercises: Array<WorkoutSessionExerciseRow & { sets: WorkoutSetRow[] }>;
};

export type MemberMeal = {
  id: MemberPortalId;
  gym_id: MemberPortalId;
  member_id: MemberPortalId;
  meal_date: string;
  meal_time: string | null;
  meal_type: string;
  food_name: string;
  quantity: string | null;
  calories: number | null;
  protein: number | null;
  notes: string | null;
  created_at: string;
};

export type MemberProgress = {
  id: MemberPortalId;
  gym_id: MemberPortalId;
  member_id: MemberPortalId;
  progress_date: string;
  weight: number | null;
  body_fat: number | null;
  waist: number | null;
  chest: number | null;
  arms: number | null;
  notes: string | null;
  created_at: string;
};

export type MemberPhoto = {
  id: MemberPortalId;
  gym_id: MemberPortalId;
  member_id: MemberPortalId;
  photo_type: string;
  photo_url: string;
  photo_date: string;
  notes: string | null;
  created_at: string;
};

export type MemberSupportMessage = {
  id: MemberPortalId;
  gym_id: MemberPortalId;
  member_id: MemberPortalId;
  subject: string;
  message: string;
  status: string;
  created_at: string;
};

export type MemberProfile = {
  id: MemberPortalId;
  gym_id: MemberPortalId;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  height: number | null;
  current_weight: number | null;
  fitness_goal: string | null;
  medical_notes: string | null;
  created_at: string;
  updated_at: string | null;
};

export type MemberWorkoutPayload = Omit<MemberWorkout, "id" | "created_at">;
export type MemberMealPayload = Omit<MemberMeal, "id" | "created_at">;
export type MemberProgressPayload = Omit<MemberProgress, "id" | "created_at">;
export type MemberPhotoPayload = Omit<MemberPhoto, "id" | "created_at">;
export type MemberSupportMessagePayload = Omit<MemberSupportMessage, "id" | "created_at" | "status"> & {
  status?: string;
};
export type MemberProfilePayload = Omit<MemberProfile, "id" | "created_at" | "updated_at"> & {
  member_id: MemberPortalId;
};

export type MemberPortalApiResult<T> = {
  data: T | null;
  error: unknown;
};

export function getMemberPortalErrorMessage(error: unknown) {
  if (!error) {
    return "";
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object") {
    const errorRecord = error as { message?: string; details?: string; hint?: string; code?: string };
    return [errorRecord.message, errorRecord.details, errorRecord.hint, errorRecord.code].filter(Boolean).join(" ");
  }

  return String(error);
}

export function isMemberPortalStorageMissing(error: unknown) {
  const message = getMemberPortalErrorMessage(error).toLowerCase();
  return message.includes("schema cache") || message.includes("could not find") || message.includes("does not exist");
}

function logApiError(action: string, error: unknown) {
  if (error) {
    console.warn(`[MemberPortalApi] ${action}`, getMemberPortalErrorMessage(error), error);
  }
}

export async function getCurrentAdminGym(): Promise<MemberPortalApiResult<{ gym_id: MemberPortalId }>> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    logApiError("Failed to get auth user", userError);
    return { data: null, error: userError ?? new Error("No authenticated user") };
  }

  const { data, error } = await supabase.from("user_profiles").select("gym_id").eq("id", user.id).single();

  if (error || !data?.gym_id) {
    logApiError("Failed to get current admin gym", error);
    return { data: null, error: error ?? new Error("No gym is linked to this account") };
  }

  return { data: { gym_id: data.gym_id as MemberPortalId }, error: null };
}

export async function getMemberProfile(gymId: MemberPortalId, memberId: MemberPortalId): Promise<MemberPortalApiResult<MemberProfile>> {
  const { data, error } = await supabase
    .from("members")
    .select("id, gym_id, full_name, phone, email, height, current_weight, fitness_goal, medical_notes, created_at")
    .eq("gym_id", gymId)
    .eq("id", memberId)
    .maybeSingle();

  logApiError("Failed to get member profile", error);
  return { data: data as MemberProfile | null, error };
}

export async function getFirstGymMemberProfile(gymId: MemberPortalId): Promise<MemberPortalApiResult<MemberProfile>> {
  const { data, error } = await supabase
    .from("members")
    .select("id, gym_id, full_name, phone, email, height, current_weight, fitness_goal, medical_notes, created_at")
    .eq("gym_id", gymId)
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  logApiError("Failed to get first gym member profile", error);
  return { data: data as MemberProfile | null, error };
}

export async function saveMemberProfile(payload: MemberProfilePayload): Promise<MemberPortalApiResult<MemberProfile[]>> {
  const { member_id, ...memberPayload } = payload;
  const { data, error } = await supabase
    .from("members")
    .update(memberPayload)
    .eq("id", member_id)
    .eq("gym_id", payload.gym_id)
    .select("id, gym_id, full_name, phone, email, height, current_weight, fitness_goal, medical_notes, created_at");

  logApiError("Failed to update member profile", error);

  if (!error && (!data || data.length === 0)) {
    const missingMemberError = new Error("No matching member found for this gym_id and member_id");
    logApiError("Failed to update member profile", missingMemberError);
    return { data: null, error: missingMemberError };
  }

  return { data: data as MemberProfile[] | null, error };
}

export async function getMemberWorkouts(gymId: MemberPortalId, memberId: MemberPortalId): Promise<MemberPortalApiResult<MemberWorkout[]>> {
  const { data, error } = await supabase
    .from("member_workouts")
    .select("*")
    .eq("gym_id", gymId)
    .eq("member_id", memberId)
    .order("workout_date", { ascending: false });

  logApiError("Failed to get member workouts", error);
  return { data: data as MemberWorkout[] | null, error };
}

export async function addMemberWorkout(payload: MemberWorkoutPayload): Promise<MemberPortalApiResult<MemberWorkout[]>> {
  const { data, error } = await supabase.from("member_workouts").insert(payload).select("*");

  logApiError("Failed to add member workout", error);
  return { data: data as MemberWorkout[] | null, error };
}

export async function updateMemberWorkout(
  id: MemberPortalId,
  gymId: MemberPortalId,
  memberId: MemberPortalId,
  payload: Partial<MemberWorkoutPayload>,
): Promise<MemberPortalApiResult<MemberWorkout[]>> {
  const { data, error } = await supabase
    .from("member_workouts")
    .update(payload)
    .eq("id", id)
    .eq("gym_id", gymId)
    .eq("member_id", memberId)
    .select("*");

  logApiError("Failed to update member workout", error);
  return { data: data as MemberWorkout[] | null, error };
}

export async function deleteMemberWorkout(id: MemberPortalId, gymId: MemberPortalId, memberId: MemberPortalId): Promise<MemberPortalApiResult<null>> {
  const { error } = await supabase.from("member_workouts").delete().eq("id", id).eq("gym_id", gymId).eq("member_id", memberId);

  logApiError("Failed to delete member workout", error);
  return { data: null, error };
}

export async function getWorkoutSessions(gymId: MemberPortalId, memberId: MemberPortalId): Promise<MemberPortalApiResult<WorkoutSessionWithDetails[]>> {
  const { data: sessions, error: sessionsError } = await supabase
    .from("workout_sessions")
    .select("*")
    .eq("gym_id", gymId)
    .eq("member_id", memberId)
    .order("workout_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (sessionsError) {
    logApiError("Failed to get workout sessions", sessionsError);
    return { data: null, error: sessionsError };
  }

  const sessionRows = (sessions ?? []) as WorkoutSessionRow[];

  if (!sessionRows.length) {
    return { data: [], error: null };
  }

  const sessionIds = sessionRows.map((session) => session.id);

  const { data: exercises, error: exercisesError } = await supabase
    .from("workout_session_exercises")
    .select("*")
    .eq("gym_id", gymId)
    .eq("member_id", memberId)
    .in("session_id", sessionIds)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (exercisesError) {
    logApiError("Failed to get workout session exercises", exercisesError);
    return { data: null, error: exercisesError };
  }

  const exerciseRows = (exercises ?? []) as WorkoutSessionExerciseRow[];
  const exerciseIds = exerciseRows.map((exercise) => exercise.id);
  let setRows: WorkoutSetRow[] = [];

  if (exerciseIds.length) {
    const { data: sets, error: setsError } = await supabase
      .from("workout_sets")
      .select("*")
      .eq("gym_id", gymId)
      .eq("member_id", memberId)
      .in("session_exercise_id", exerciseIds)
      .order("set_number", { ascending: true });

    if (setsError) {
      logApiError("Failed to get workout sets", setsError);
      return { data: null, error: setsError };
    }

    setRows = (sets ?? []) as WorkoutSetRow[];
  }

  const data = sessionRows.map<WorkoutSessionWithDetails>((session) => ({
    ...session,
    exercises: exerciseRows
      .filter((exercise) => String(exercise.session_id) === String(session.id))
      .map((exercise) => ({
        ...exercise,
        sets: setRows.filter((set) => String(set.session_exercise_id) === String(exercise.id)),
      })),
  }));

  return { data, error: null };
}

export async function addWorkoutSession(payload: WorkoutSessionPayload): Promise<MemberPortalApiResult<WorkoutSessionWithDetails>> {
  const { exercises, ...sessionPayload } = payload;
  const { data: session, error: sessionError } = await supabase
    .from("workout_sessions")
    .insert(sessionPayload)
    .select("*")
    .maybeSingle();

  if (sessionError || !session?.id) {
    const error = sessionError ?? new Error("Workout session was not created");
    logApiError("Failed to add workout session", error);
    return { data: null, error };
  }

  const exercisePayloads = exercises.map((exercise, index) => ({
    session_id: session.id,
    gym_id: payload.gym_id,
    member_id: payload.member_id,
    exercise_name: exercise.exercise_name,
    muscle: exercise.muscle,
    equipment: exercise.equipment,
    notes: exercise.notes,
    sort_order: index + 1,
  }));

  const { data: insertedExercises, error: exercisesError } = await supabase
    .from("workout_session_exercises")
    .insert(exercisePayloads)
    .select("*");

  if (exercisesError || !insertedExercises) {
    logApiError("Failed to add workout session exercises", exercisesError);
    await supabase.from("workout_sessions").delete().eq("id", session.id).eq("gym_id", payload.gym_id).eq("member_id", payload.member_id);
    return { data: null, error: exercisesError ?? new Error("Workout exercises were not created") };
  }

  const insertedExerciseRows = insertedExercises as WorkoutSessionExerciseRow[];
  const setPayloads = insertedExerciseRows.flatMap((exerciseRow, exerciseIndex) =>
    exercises[exerciseIndex].sets.map((set) => ({
      session_id: session.id,
      session_exercise_id: exerciseRow.id,
      gym_id: payload.gym_id,
      member_id: payload.member_id,
      set_number: set.set_number,
      weight: set.weight,
      reps: set.reps,
      rpe: set.rpe,
      completed: set.completed,
    })),
  );

  let insertedSetRows: WorkoutSetRow[] = [];

  if (setPayloads.length) {
    const { data: insertedSets, error: setsError } = await supabase.from("workout_sets").insert(setPayloads).select("*");

    if (setsError || !insertedSets) {
      logApiError("Failed to add workout sets", setsError);
      await supabase.from("workout_sessions").delete().eq("id", session.id).eq("gym_id", payload.gym_id).eq("member_id", payload.member_id);
      return { data: null, error: setsError ?? new Error("Workout sets were not created") };
    }

    insertedSetRows = insertedSets as WorkoutSetRow[];
  }

  return {
    data: {
      ...(session as WorkoutSessionRow),
      exercises: insertedExerciseRows.map((exercise) => ({
        ...exercise,
        sets: insertedSetRows.filter((set) => String(set.session_exercise_id) === String(exercise.id)),
      })),
    },
    error: null,
  };
}

export async function deleteWorkoutSession(id: MemberPortalId, gymId: MemberPortalId, memberId: MemberPortalId): Promise<MemberPortalApiResult<null>> {
  const { error } = await supabase.from("workout_sessions").delete().eq("id", id).eq("gym_id", gymId).eq("member_id", memberId);

  logApiError("Failed to delete workout session", error);
  return { data: null, error };
}

export async function getMemberMeals(gymId: MemberPortalId, memberId: MemberPortalId): Promise<MemberPortalApiResult<MemberMeal[]>> {
  const { data, error } = await supabase
    .from("member_meals")
    .select("*")
    .eq("gym_id", gymId)
    .eq("member_id", memberId)
    .order("meal_date", { ascending: false });

  logApiError("Failed to get member meals", error);
  return { data: data as MemberMeal[] | null, error };
}

export async function addMemberMeal(payload: MemberMealPayload): Promise<MemberPortalApiResult<MemberMeal[]>> {
  const { data, error } = await supabase.from("member_meals").insert(payload).select("*");

  logApiError("Failed to add member meal", error);
  return { data: data as MemberMeal[] | null, error };
}

export async function updateMemberMeal(
  id: MemberPortalId,
  gymId: MemberPortalId,
  memberId: MemberPortalId,
  payload: Partial<MemberMealPayload>,
): Promise<MemberPortalApiResult<MemberMeal[]>> {
  const { data, error } = await supabase
    .from("member_meals")
    .update(payload)
    .eq("id", id)
    .eq("gym_id", gymId)
    .eq("member_id", memberId)
    .select("*");

  logApiError("Failed to update member meal", error);
  return { data: data as MemberMeal[] | null, error };
}

export async function deleteMemberMeal(id: MemberPortalId, gymId: MemberPortalId, memberId: MemberPortalId): Promise<MemberPortalApiResult<null>> {
  const { error } = await supabase.from("member_meals").delete().eq("id", id).eq("gym_id", gymId).eq("member_id", memberId);

  logApiError("Failed to delete member meal", error);
  return { data: null, error };
}

export async function getMemberProgress(gymId: MemberPortalId, memberId: MemberPortalId): Promise<MemberPortalApiResult<MemberProgress[]>> {
  const { data, error } = await supabase
    .from("member_progress")
    .select("*")
    .eq("gym_id", gymId)
    .eq("member_id", memberId)
    .order("progress_date", { ascending: false });

  logApiError("Failed to get member progress", error);
  return { data: data as MemberProgress[] | null, error };
}

export async function addMemberProgress(payload: MemberProgressPayload): Promise<MemberPortalApiResult<MemberProgress[]>> {
  const { data, error } = await supabase.from("member_progress").insert(payload).select("*");

  logApiError("Failed to add member progress", error);
  return { data: data as MemberProgress[] | null, error };
}

export async function updateMemberProgress(
  id: MemberPortalId,
  gymId: MemberPortalId,
  memberId: MemberPortalId,
  payload: Partial<MemberProgressPayload>,
): Promise<MemberPortalApiResult<MemberProgress[]>> {
  const { data, error } = await supabase
    .from("member_progress")
    .update(payload)
    .eq("id", id)
    .eq("gym_id", gymId)
    .eq("member_id", memberId)
    .select("*");

  logApiError("Failed to update member progress", error);
  return { data: data as MemberProgress[] | null, error };
}

export async function deleteMemberProgress(id: MemberPortalId, gymId: MemberPortalId, memberId: MemberPortalId): Promise<MemberPortalApiResult<null>> {
  const { error } = await supabase.from("member_progress").delete().eq("id", id).eq("gym_id", gymId).eq("member_id", memberId);

  logApiError("Failed to delete member progress", error);
  return { data: null, error };
}

export async function getMemberPhotos(gymId: MemberPortalId, memberId: MemberPortalId): Promise<MemberPortalApiResult<MemberPhoto[]>> {
  const { data, error } = await supabase
    .from("member_photos")
    .select("*")
    .eq("gym_id", gymId)
    .eq("member_id", memberId)
    .order("photo_date", { ascending: false });

  logApiError("Failed to get member photos", error);
  return { data: data as MemberPhoto[] | null, error };
}

export async function addMemberPhoto(payload: MemberPhotoPayload): Promise<MemberPortalApiResult<MemberPhoto[]>> {
  const { data, error } = await supabase.from("member_photos").insert(payload).select("*");

  logApiError("Failed to add member photo", error);
  return { data: data as MemberPhoto[] | null, error };
}

export async function deleteMemberPhoto(id: MemberPortalId, gymId: MemberPortalId, memberId: MemberPortalId): Promise<MemberPortalApiResult<null>> {
  const { error } = await supabase.from("member_photos").delete().eq("id", id).eq("gym_id", gymId).eq("member_id", memberId);

  logApiError("Failed to delete member photo", error);
  return { data: null, error };
}

export async function getMemberSupportMessages(gymId: MemberPortalId, memberId: MemberPortalId): Promise<MemberPortalApiResult<MemberSupportMessage[]>> {
  const { data, error } = await supabase
    .from("member_support_messages")
    .select("*")
    .eq("gym_id", gymId)
    .eq("member_id", memberId)
    .order("created_at", { ascending: false });

  logApiError("Failed to get member support messages", error);
  return { data: data as MemberSupportMessage[] | null, error };
}

export async function addMemberSupportMessage(payload: MemberSupportMessagePayload): Promise<MemberPortalApiResult<MemberSupportMessage[]>> {
  const { data, error } = await supabase
    .from("member_support_messages")
    .insert({ ...payload, status: payload.status ?? "Open" })
    .select("*");

  logApiError("Failed to add member support message", error);
  return { data: data as MemberSupportMessage[] | null, error };
}

export async function updateMemberSupportMessageStatus(
  id: MemberPortalId,
  gymId: MemberPortalId,
  memberId: MemberPortalId,
  status: string,
): Promise<MemberPortalApiResult<MemberSupportMessage[]>> {
  const { data, error } = await supabase
    .from("member_support_messages")
    .update({ status })
    .eq("id", id)
    .eq("gym_id", gymId)
    .eq("member_id", memberId)
    .select("*");

  logApiError("Failed to update member support message status", error);
  return { data: data as MemberSupportMessage[] | null, error };
}
