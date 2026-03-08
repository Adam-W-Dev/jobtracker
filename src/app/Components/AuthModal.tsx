"use client";

import { useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";
import { useRouter } from "next/navigation";
import styles from "@/app/styles/tracker.module.css";

type AuthMode = "login" | "signup";

export default function AuthModal() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);

    const cleanEmail = email.trim();
    const cleanName = displayName.trim();

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { display_name: cleanName || cleanEmail.split("@")[0] },
          },
        });

        if (error) throw error;
        alert("Success! Please log in with your new account.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) throw error;
        router.refresh();
      }
    } catch (error: any) {
      alert(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.nameModal}>
      <form onSubmit={handleAuth} className={styles.modalContent}>
        <h2>{mode === "signup" ? "Create Account" : "Welcome Back"}</h2>
        {mode === "signup" && (
          <input
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className={styles.input}
            autoComplete="name"
            required
          />
        )}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          autoComplete="email"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          required
        />

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Processing..." : mode === "signup" ? "Create Account" : "Sign In"}
        </button>

       <p className={styles.toggleText}>
      {mode === "login" ? "Don't have an account? " : "Already have an account? "}
      
      <span
        className={styles.linkText}
        onClick={() => { 
          setMode(mode === "login" ? "signup" : "login");
          setDisplayName("");
        }}
      >
        {mode === "login" ? "Sign Up" : "Login"}
      </span>
    </p>
      </form>
    </div>
  );
}