import { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import "../global.css";

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();
  const segments = useSegments() as string[];

  useEffect(() => {
    // Check if a session already exists on app load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setInitialized(true)
    })

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!initialized) return

    const inAuthGroup = segments[0] === '(auth)'

    if (!session && !inAuthGroup) {
      // No session, send to login
      // COMMENTED OUT FOR TESTING
      router.replace('/(auth)/login' as any)
      // router.replace('/(app)' as any)
    } else if (session && inAuthGroup) {
      // Has session, send to main app
      router.replace('/(app)' as any)
    }
  }, [session, initialized])

  return <Slot />
}
