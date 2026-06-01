export async function sendSignupNotification(userData) {
  const response = await fetch('/api/send-signup-notification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.success === false) {
    throw new Error(payload.error || 'Failed to send signup notification.');
  }

  return payload;
}
