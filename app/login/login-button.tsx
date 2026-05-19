"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginButton() {
  const [error, setError] = useState<string | null>(null);

  async function signInWithGoogle() {
    setError(null);
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback`;

    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (signInError) {
      setError("No se pudo iniciar sesion con Google. Intentalo nuevamente.");
    }
  }

  return (
    <div className="stack">
      <button className="button" onClick={signInWithGoogle} type="button">
        Entrar con Google
      </button>
      {error ? <p className="form-message error-message">{error}</p> : null}
    </div>
  );
}
