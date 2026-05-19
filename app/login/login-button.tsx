"use client";

import { createClient } from "@/lib/supabase/client";

export function LoginButton() {
  async function signInWithGoogle() {
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback`;

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
  }

  return (
    <button className="button" onClick={signInWithGoogle} type="button">
      Entrar con Google
    </button>
  );
}
