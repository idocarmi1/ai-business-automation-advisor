const USER_KEY = 'autobiz_demo_user';
export const ADMIN_EMAIL = 'autobiz.advisor.ai@gmail.com';

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
  if (email?.toLowerCase() === ADMIN_EMAIL && password) {
    const adminUser = {
      fullName: 'מנהל המערכת',
      email: ADMIN_EMAIL,
      businessName: 'AutoBiz AI Advisor',
      password,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(adminUser));
    return adminUser;
  }

  const user = getCurrentUser();
  if (!user || user.email !== email || user.password !== password) {
    return null;
  }
  return user;
}

export function isAdminUser(user) {
  return user?.email?.toLowerCase() === ADMIN_EMAIL;
}

export function logoutDemoUser() {
  localStorage.removeItem(USER_KEY);
}
