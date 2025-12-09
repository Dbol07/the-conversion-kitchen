// src/utils/spoonacularUsage.ts
// Updated for hybrid MealDB + Spoonacular fallback mode

// Spoonacular Free Tier Limits:
// - 50 points per day
// - 1 request per second
// - 2 concurrent requests
// TheMealDB does NOT consume any points, so we only track Spoonacular calls.

const DAILY_LIMIT = 50;               // Spoonacular free daily quota
const SOFT_LIMIT = 40;                // Show warnings near limit
const COOLDOWN_MS = 60_000;           // 1 minute cooldown when limit is hit
const STORAGE_KEY = "spoonacular_usage";

type InternalUsage = {
  date: string;
  count: number;
  blockedUntil?: number;
};

export type SpoonUsageInfo = {
  date: string;
  count: number;
  dailyLimit: number;
  remaining: number;
  isNearLimit: boolean;
  isBlocked: boolean;
  blockedMsRemaining: number;
};

function todayKey() {
  return new Date().toDateString();
}

function readUsage(): InternalUsage {
  if (typeof window === "undefined") {
    return { date: todayKey(), count: 0 };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: todayKey(), count: 0 };

    const parsed = JSON.parse(raw) as InternalUsage;

    if (parsed.date !== todayKey()) {
      return { date: todayKey(), count: 0 };
    }

    return parsed;
  } catch {
    return { date: todayKey(), count: 0 };
  }
}

function writeUsage(state: InternalUsage) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Public: get current usage (for banner / warning)
export function getSpoonUsage(): SpoonUsageInfo {
  const state = readUsage();
  const now = Date.now();

  const blockedMsRemaining = state.blockedUntil
    ? Math.max(0, state.blockedUntil - now)
    : 0;

  return {
    date: state.date,
    count: state.count,
    dailyLimit: DAILY_LIMIT,
    remaining: Math.max(0, DAILY_LIMIT - state.count),
    isNearLimit: state.count >= SOFT_LIMIT && state.count < DAILY_LIMIT,
    isBlocked: blockedMsRemaining > 0 || state.count >= DAILY_LIMIT,
    blockedMsRemaining,
  };
}

// Internal: increment usage count for Spoonacular-only requests
function registerCallAttempt(): SpoonUsageInfo {
  const state = readUsage();
  const now = Date.now();

  // Cooldown active?
  if (state.blockedUntil && now < state.blockedUntil) {
    return { ...getSpoonUsage(), isBlocked: true };
  }

  // Increment count ONLY for Spoonacular fallback
  state.count += 1;

  if (state.count >= DAILY_LIMIT) {
    state.blockedUntil = now + COOLDOWN_MS;
  }

  writeUsage(state);
  return getSpoonUsage();
}

// ======================================================
// 🔥 WRAPPED FETCH FOR SPOONACULAR ONLY
// ======================================================

export async function trackedSpoonFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const usage = registerCallAttempt();

  // Hard block when quota is exceeded
  if (usage.isBlocked && usage.count >= DAILY_LIMIT) {
    const err = new Error("SPOON_DAILY_LIMIT");
    (err as any).usage = usage;
    throw err;
  }

  const res = await fetch(input, init);

  // Spoonacular signals rate/limit issues with:
  // 401 = invalid key OR exhausted points
  // 402 = out of points
  // 429 = too many requests
  if (res.status === 401 || res.status === 402 || res.status === 429) {
    const state = readUsage();
    state.blockedUntil = Date.now() + COOLDOWN_MS;
    writeUsage(state);

    const err = new Error("SPOON_RATE_LIMIT");
    (err as any).usage = getSpoonUsage();
    throw err;
  }

  return res;
}
