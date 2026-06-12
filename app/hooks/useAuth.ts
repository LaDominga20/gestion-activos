import { useEffect, useCallback, useSyncExternalStore } from 'react';
import { supabase } from '@/app/lib/supabase';
import { User } from '@/app/types';

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

let authState: AuthState = {
  user: null,
  loading: typeof window !== 'undefined', // Inicia en true solo en el cliente
  error: null,
};

const listeners = new Set<() => void>();
let initialized = false;

// Intentar recuperar la sesión inmediatamente al cargar el módulo
// Esto evita que los componentes vean un estado de "loading" si los datos ya están en localStorage
if (typeof window !== 'undefined') {
  try {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      authState = { ...authState, user: parsed, loading: false };
      
      // Sincronizar cookie inmediatamente para evitar rebotes del middleware
      if (!document.cookie.includes('auth_token=')) {
        document.cookie = `auth_token=${parsed.email}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      }
      initialized = true;
    }
  } catch (e) { /* Se manejará en initializeAuth si falla */ }
}

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function setAuthState(state: Partial<AuthState>) {
  authState = {
    ...authState,
    ...state,
  };
  notifyListeners();
}

function getSnapshot() {
  return authState;
}

// Snapshot estable para el servidor para evitar bucles de hidratación
const serverSnapshot: AuthState = {
  user: null,
  loading: false,
  error: null,
};

function getServerSnapshot() {
  return serverSnapshot;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function initializeAuth() {
  if (typeof window === 'undefined') {
    return;
  }
  
  // Si ya se inicializó, verificar que la cookie siga sincronizada
  if (initialized) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser && !document.cookie.includes('auth_token=')) {
      const parsed = JSON.parse(storedUser);
      document.cookie = `auth_token=${parsed.email}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    }
    return;
  }

  initialized = true;

  try {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (!document.cookie.includes('auth_token=')) {
        document.cookie = `auth_token=${parsed.email}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      }
      setAuthState({ user: parsed, loading: false });
      return;
    }
  } catch (error) {
    console.error('[useAuth] Error loading session:', error);
    try {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('auth_token');
    } catch (e) {}
  }
  setAuthState({ loading: false });
}

export async function login(email: string, password: string): Promise<true | string> {
  setAuthState({ loading: true, error: null });

  try {
    const { data, error: queryError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (queryError || !data) {
      const msg = (queryError && (queryError.message || String(queryError))) || 'Usuario o contraseña incorrectos';
      console.error('[useAuth] Query error:', queryError);
      setAuthState({ loading: false, error: msg });
      return msg;
    }

    const storedPassword = data.password || data.password_hash;
    if (storedPassword !== password) {
      const msg = 'Usuario o contraseña incorrectos';
      setAuthState({ loading: false, error: msg });
      return msg;
    }

    const userData: User = {
      id: data.id,
      email: data.email,
      full_name: data.full_name,
      role: data.role,
    };

    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('auth_token', email);

    // Sincronizar con cookie para que el middleware de Next.js pueda verlo
    document.cookie = `auth_token=${email}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

    setAuthState({ user: userData, loading: false, error: null });
    return true;
  } catch (err: any) {
    const msg = err?.message || 'Error en login';
    console.error('[useAuth] Exception during login:', err);
    setAuthState({ loading: false, error: msg });
    return msg;
  }
}

export function logout() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('auth_token');

  // Eliminar la cookie al cerrar sesión
  document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";

  setAuthState({ user: null, loading: false, error: null });
}

export function useAuth() {
  // El tercer parámetro asegura que el servidor no intente renderizar el estado de carga del cliente
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    initializeAuth();
  }, []);

  const isAdmin = useCallback(() => state.user?.role === 'admin', [state.user]);
  const isViewer = useCallback(() => state.user?.role === 'viewer', [state.user]);
  const isAuthenticated = useCallback(() => state.user !== null, [state.user]);

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    logout,
    isAdmin,
    isViewer,
    isAuthenticated,
  };
}
