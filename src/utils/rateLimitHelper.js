// Rate limit helper utilities

const RATE_LIMIT_KEY = 'appwrite_rate_limit';
const RATE_LIMIT_DURATION = 2 * 60 * 1000; // 2 minutes in milliseconds

export const isRateLimited = () => {
  const lastAttempt = localStorage.getItem(RATE_LIMIT_KEY);
  if (!lastAttempt) return false;
  
  const timeSinceLastAttempt = Date.now() - parseInt(lastAttempt);
  return timeSinceLastAttempt < RATE_LIMIT_DURATION;
};

export const setRateLimit = () => {
  localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
};

export const clearRateLimit = () => {
  localStorage.removeItem(RATE_LIMIT_KEY);
};

export const getRemainingTime = () => {
  const lastAttempt = localStorage.getItem(RATE_LIMIT_KEY);
  if (!lastAttempt) return 0;
  
  const timeSinceLastAttempt = Date.now() - parseInt(lastAttempt);
  const remaining = RATE_LIMIT_DURATION - timeSinceLastAttempt;
  return Math.max(0, Math.ceil(remaining / 1000)); // Return seconds
};

export const formatRemainingTime = () => {
  const seconds = getRemainingTime();
  if (seconds <= 0) return null;
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
};
