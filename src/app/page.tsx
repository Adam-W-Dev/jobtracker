// app/page.tsx
import { createClient } from "./utils/supabase/server";
import { getProfile } from "./actions/profiles";
import Tracker from "./Pages/Tracker";
import AuthModal from "./Components/AuthModal";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return <AuthModal />;
  }
  const profile = await getProfile();
  return (
    <main>
      <Tracker name={profile?.display_name || "User"} />
    </main>
  );
}