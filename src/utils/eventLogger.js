export function logEvent(eventName, details = {}) {
  const event = {
    event: eventName,
    details,
    timestamp: new Date().toISOString()
  };

  console.log('📡 FakeTube Event:', event);

  try {
    const existing = JSON.parse(localStorage.getItem('faketube_events') || '[]');
    existing.push(event);
    localStorage.setItem('faketube_events', JSON.stringify(existing));
  } catch (error) {
    console.error('Failed to store FakeTube event:', error);
  }
}

export function getLoggedEvents() {
  try {
    return JSON.parse(localStorage.getItem('faketube_events') || '[]');
  } catch {
    return [];
  }
}

export function clearLoggedEvents() {
  localStorage.removeItem('faketube_events');
}