import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AuthUser } from '../types';

interface AuthCtx { user: AuthUser | null; login: (email: string, pw: string) => boolean; logout: () => void; }
const Ctx = createContext<AuthCtx>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try { return JSON.parse(localStorage.getItem('invoiceapp_user') || 'null'); }
    catch { return null; }
  });

  const login = (email: string, pw: string) => {
    if (email === 'admin@demo.de' && pw === 'admin123') {
      const u = { email, name: 'Admin' };
      setUser(u);
      localStorage.setItem('invoiceapp_user', JSON.stringify(u));
      return true;
    }
    return false;
  };

  const logout = () => { setUser(null); localStorage.removeItem('invoiceapp_user'); };
  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
