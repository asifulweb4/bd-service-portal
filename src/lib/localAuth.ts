import { Transaction } from '../types';

export interface LocalUser {
  uid: string;
  email: string;
  phone?: string;
  displayName: string;
  balance: number;
  role: string;
  createdAt?: string;
}

type AuthListener = (user: LocalUser | null) => void;
const listeners = new Set<AuthListener>();

let currentUser: LocalUser | null = (() => {
  const stored = localStorage.getItem('local_auth_current_user');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
})();

export const localAuth = {
  // DB status check
  async checkDatabaseStatus(): Promise<{ configured: boolean; stable: boolean }> {
    try {
      const res = await fetch('/api/db-status');
      const data = await res.json();
      
      if (data.configured && data.stable && currentUser) {
        try {
          const profileRes = await fetch(`/api/user-profile?uid=${currentUser.uid}`);
          if (profileRes.ok) {
            const profile = await profileRes.json();
            currentUser = profile;
            localStorage.setItem('local_auth_current_user', JSON.stringify(profile));
            listeners.forEach((listener) => listener(currentUser));
          }
        } catch (e) {
          console.warn("Could not sync active backend user details:", e);
        }
      }
      return data;
    } catch (err) {
      return { configured: false, stable: false };
    }
  },

  getCurrentUser() {
    return currentUser;
  },

  subscribe(listener: AuthListener) {
    listeners.add(listener);
    listener(currentUser);
    return () => {
      listeners.delete(listener);
    };
  },

  _updateState(user: LocalUser | null) {
    currentUser = user;
    if (user) {
      localStorage.setItem('local_auth_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('local_auth_current_user');
    }
    listeners.forEach((listener) => listener(user));
  },

  async register(email: string, phone: string, name: string, passwordHash: string): Promise<LocalUser> {
    const emailKey = email.trim().toLowerCase();
    const phoneVal = phone ? phone.trim() : '';

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailKey, phone: phoneVal, name, password: passwordHash })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'নিবন্ধন ব্যর্থ হয়েছে। ডাটাবেজ কানেকশন চেক করুন।');
    }
    const newUser = await response.json() as LocalUser;
    this._updateState(newUser);
    return newUser;
  },

  async login(emailOrPhone: string, passwordHash: string): Promise<LocalUser> {
    const identifier = emailOrPhone.trim().toLowerCase();

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: identifier, password: passwordHash })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'লগইন ব্যর্থ হয়েছে। সঠিক ইমেইল/ফোন ও পাসওয়ার্ড প্রদান করুন।');
    }
    const loggedUser = await response.json() as LocalUser;
    this._updateState(loggedUser);
    return loggedUser;
  },

  async resetPassword(identifier: string, newPasswordHash: string): Promise<void> {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: identifier.trim(), newPassword: newPasswordHash })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে।');
    }
  },

  logout() {
    this._updateState(null);
  },

  async updateBalance(uid: string, newBalance: number): Promise<void> {
    const stored = localStorage.getItem('local_auth_current_user');
    if (stored) {
      const parsed = JSON.parse(stored) as LocalUser;
      if (parsed.uid === uid) {
        parsed.balance = newBalance;
        this._updateState(parsed);
      }
    }
  },

  async getTransactions(uid: string): Promise<Transaction[]> {
    try {
      const response = await fetch(`/api/transactions?uid=${uid}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.error("Unable to retrieve remote transactions:", err);
    }
    return [];
  }
};

