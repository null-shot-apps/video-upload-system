import { User, UserRole } from '@/types';

// Mock authentication - replace with real auth system
export function getCurrentUser(): User | null {
  // In production, this would check session/JWT/cookies
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('showroom_user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null) {
  if (typeof window === 'undefined') return;
  
  if (user) {
    localStorage.setItem('showroom_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('showroom_user');
  }
}

export function canUploadVideos(user: User | null): boolean {
  if (!user) return false;
  return user.role === 'Landlord' || user.role === 'Agent';
}

export function requireAuth(user: User | null): user is User {
  return user !== null;
}

export function requireUploadPermission(user: User | null): boolean {
  return requireAuth(user) && canUploadVideos(user);
}

// Mock login for demo - replace with real auth
export function mockLogin(role: UserRole) {
  const user: User = {
    id: Math.random().toString(36).substr(2, 9),
    name: role === 'Landlord' ? 'John Landlord' : 'Jane Agent',
    email: `${role.toLowerCase()}@showroom.ng`,
    role,
    phone: '+234 800 000 0000'
  };
  setCurrentUser(user);
  return user;
}

export function logout() {
  setCurrentUser(null);
}

