// src/hooks/use-login.ts

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app'; // 1. Impor FirebaseError
import { auth } from '@/lib/firebase';

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard/sensor');
    } catch (error) { // 2. Tangkap error sebagai 'unknown' (default)
      let errorMessage = "Terjadi kesalahan. Silakan coba lagi.";
      
      // 3. Periksa apakah error berasal dari Firebase
      if (error instanceof FirebaseError) {
        switch (error.code) { // 4. Akses 'error.code' dengan aman
          case 'auth/user-not-found':
            errorMessage = "Email tidak terdaftar.";
            break;
          case 'auth/wrong-password':
            errorMessage = "Password yang Anda masukkan salah.";
            break;
          case 'auth/invalid-credential':
            errorMessage = "Kredensial yang Anda masukkan tidak valid.";
            break;
          case 'auth/invalid-email':
            errorMessage = "Format email tidak valid.";
            break;
          default:
            console.error("Firebase login error:", error);
        }
      } else {
        // Tangani error lain yang mungkin bukan dari Firebase
        console.error("Unexpected error:", error);
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}