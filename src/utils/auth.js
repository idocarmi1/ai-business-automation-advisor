const USER_KEY = 'autobiz_demo_user';

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

// Demo authentication only. Passwords are stored in localStorage for classroom prototype behavior and are not production secure.
export function signUpDemoUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export function loginDemoUser(email, password) {
  const user = getCurrentUser();
  if (!user || user.email !== email || user.password !== password) {
    return null;
  }
  return user;
}

export function logoutDemoUser() {
  localStorage.removeItem(USER_KEY);
}
