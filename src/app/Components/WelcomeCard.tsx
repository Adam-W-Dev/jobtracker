"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "../utils/supabase/client";
import { useRouter } from "next/navigation";
import styles from "../styles/tracker.module.css";

type Props = {
  title: string;
  user: string;
};

export default function WelcomeCard({ title, user }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <>
      {/* NAVBAR with Welcome and Settings */}
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <div className={styles.navLogo}>{title}</div>

          <div className={styles.settingsWrapper} ref={dropdownRef}>
            <button className={styles.settingsBtn} onClick={() => setIsOpen(!isOpen)}>
              Settings ▾
            </button>

            {isOpen && (
              <div className={styles.dropdown}>
                <button onClick={handleSignOut} className={styles.signOutBtn}>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* HERO with centered Bordered Name */}
      <header className={styles.heroSection}>
        <span className={styles.heroLabel}>Active Account</span>
        <div className={styles.userNameCard}>
          {user}
        </div>
      </header>
    </>
  );
}