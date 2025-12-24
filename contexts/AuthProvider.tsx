import { auth } from '@/app/config/firebase';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AppUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
  phoneNumber?: string | null;
  photoURL?: string | null;
}

interface AuthResult {
  success: boolean;
  message?: string;
  user?: AppUser;
}

interface AuthContextType {
  user: AppUser | null;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (userData: {
    email: string;
    password: string;
    name?: string;
    surname?: string;
    phone?: string;
    address?: string;
  }) => Promise<AuthResult>;
  register?: (userData: {
    email: string;
    password: string;
    name?: string;
    surname?: string;
    phone?: string;
    address?: string;
  }) => Promise<AuthResult>;
  logout: () => Promise<void>;
  loading: boolean;
  isLoading?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const appUser: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          phoneNumber: firebaseUser.phoneNumber,
          photoURL: firebaseUser.photoURL,
        };
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      const appUser: AppUser = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
      };
      
      return {
        success: true,
        message: 'Login successful',
        user: appUser
      };
    } catch (error: any) {
      let message = 'Login failed';
      if (error.code === 'auth/invalid-credential') {
        message = 'Invalid email or password';
      } else if (error.code === 'auth/user-not-found') {
        message = 'User not found';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Wrong password';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many attempts. Please try again later';
      }
      
      return {
        success: false,
        message: message
      };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData: {
    email: string;
    password: string;
    name?: string;
    surname?: string;
    phone?: string;
    address?: string;
  }): Promise<AuthResult> => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      
      const appUser: AppUser = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userData.name || null,
      };
      
      return {
        success: true,
        message: 'Account created successfully!',
        user: appUser
      };
    } catch (error: any) {
      let message = 'Failed to create account';
      if (error.code === 'auth/email-already-in-use') {
        message = 'Email already in use';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password is too weak';
      }
      
      return {
        success: false,
        message: message
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value: AuthContextType = {
    user,
    signIn,
    signUp,
    register: signUp,
    logout,
    loading,
    isLoading: loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
