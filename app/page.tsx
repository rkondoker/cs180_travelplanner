import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import LandingPage from "@/components/landing";

export default async function Home() {
  return (
    <>
      <LandingPage />
      {/* <Hero />
      <main className="flex-1 flex flex-col gap-6 px-4">
        <h2 className="font-medium text-xl mb-4">Next steps</h2>
        {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
      </main> */}
    </>
  );
}
