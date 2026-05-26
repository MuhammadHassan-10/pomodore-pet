const getTodayKey = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `pomo_${y}-${m}-${day}`;
};

export const loadHistory = () => {
  const today = getTodayKey();
  // Purge old keys
  Object.keys(localStorage)
    .filter(k => k.startsWith('pomo_') && k !== today)
    .forEach(k => localStorage.removeItem(k));
  try {
    return JSON.parse(localStorage.getItem(today) || '[]');
  } catch {
    return [];
  }
};

export const saveSession = (durationSecs) => {
  const history = loadHistory();
  const now = new Date();
  const hours = now.getHours();
  const mins = String(now.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  const h12 = hours % 12 || 12;
  const timeLabel = `${h12}:${mins}${ampm}`;

  const totalMins = Math.floor(durationSecs / 60);
  const totalSecs = String(durationSecs % 60).padStart(2, '0');
  const durationLabel = `${totalMins}:${totalSecs}`;

  const entry = {
    id: Date.now(),
    durationLabel,
    timeLabel,
    durationSecs,
  };

  history.unshift(entry);
  localStorage.setItem(getTodayKey(), JSON.stringify(history));
  return entry;
};
