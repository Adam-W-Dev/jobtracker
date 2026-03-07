// app/page.tsx
import { createClient } from "./utils/supabase/server";
import { getProfile } from "./actions/profiles";
import Tracker from "./Pages/Tracker";
import AuthModal from "./Components/AuthModal";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. If no session exists, show Login
  if (!user) {
    return <AuthModal />;
  }

  // 2. Use the action to get the data
  const profile = await getProfile();

  // 3. Render the app
  return (
    <main>
      <Tracker name={profile?.display_name || "User"} />
    </main>
  );
}