'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '@/lib/firebase';


export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccessMessage("Berhasil Login!");
      
      setTimeout(() => {
        router.push('/dashboard/sensor');
      }, 2000);

    } catch (error) {
      let errorMessage = "Terjadi kesalahan. Silakan coba lagi.";
      
      if (error instanceof FirebaseError) {
        switch (error.code) {
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
        console.error("Unexpected error:", error);
      }
      setError(errorMessage);
      setIsLoading(false); // Hentikan loading hanya jika terjadi error
    } 
  };

  return { login, isLoading, error, successMessage };
}