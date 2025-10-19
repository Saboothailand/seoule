import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { users, sessions, type User, type Session } from '../../../packages/database/schema';
import { eq, and, gt } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface AuthUser {
  user_id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'staff' | 'member';
  is_active: boolean;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

export async function createSession(userId: string): Promise<string> {
  const token = generateToken(userId);
  const expiresAt = new Date(Date.now() + SESSION_DURATION);
  
  await db.insert(sessions).values({
    user_id: userId,
    token,
    expires_at: expiresAt,
  });
  
  return token;
}

export async function getSession(token: string): Promise<Session | null> {
  const [session] = await db
    .select()
    .from(sessions)
    .where(
      and(
        eq(sessions.token, token),
        gt(sessions.expires_at, new Date())
      )
    )
    .limit(1);
  
  return session || null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  
  return user || null;
}

export async function getUserById(userId: string): Promise<User | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.user_id, userId))
    .limit(1);
  
  return user || null;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('session-token')?.value;
  
  if (!token) return null;
  
  const session = await getSession(token);
  if (!session) return null;
  
  const user = await getUserById(session.user_id);
  if (!user || !user.is_active) return null;
  
  return {
    user_id: user.user_id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    is_active: user.is_active,
  };
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export async function requireRole(requiredRole: 'admin' | 'staff' | 'member'): Promise<AuthUser> {
  const user = await requireAuth();
  
  const roleHierarchy = { member: 1, staff: 2, admin: 3 };
  if (roleHierarchy[user.role] < roleHierarchy[requiredRole]) {
    redirect('/unauthorized');
  }
  
  return user;
}

export async function logout(): Promise<void> {
  const cookieStore = cookies();
  const token = cookieStore.get('session-token')?.value;
  
  if (token) {
    await db.delete(sessions).where(eq(sessions.token, token));
  }
  
  cookieStore.delete('session-token');
}

export async function loginUser(email: string, password: string): Promise<AuthUser | null> {
  const user = await getUserByEmail(email);
  if (!user || !user.is_active) return null;
  
  const isValidPassword = await verifyPassword(password, user.password_hash);
  if (!isValidPassword) return null;
  
  const token = await createSession(user.user_id);
  
  // Set cookie
  const cookieStore = cookies();
  cookieStore.set('session-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
  });
  
  // Update last login
  await db
    .update(users)
    .set({ last_login: new Date() })
    .where(eq(users.user_id, user.user_id));
  
  return {
    user_id: user.user_id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    is_active: user.is_active,
  };
}
