import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-trip-main relative">
      <div className="bg-trip-brown-200 rounded-xl p-8 shadow-lg w-125">
        <form className="flex flex-col min-w-64 items-center justify-center">
          <h1 className="text-3xl font-bold mb-2 text-white font-trip-main">
            Log in
          </h1>
          <p className="text-sm text-white mb-2">
            Don&apos;t have an account?{" "}
            <Link className="text-white font-medium underline" href="/sign-up">
              Sign up
            </Link>
          </p>
          <div className="flex flex-col items-center justify-center gap-2 mt-2">
            <div className="flex flex-col justify-start items-start gap-2">
              <Label htmlFor="email" className="text-white text-sm mb-1">
                Email
              </Label>
              <input
                className="w-full px-3 py-2 rounded bg-white text-black"
                name="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="flex flex-col justify-start items-start gap-2 mb-4">
              <Label htmlFor="password" className="text-white text-sm mb-1">
                Password
              </Label>
              <input
                className="w-full px-3 py-2 rounded bg-white text-black"
                type="password"
                name="password"
                placeholder="Your password"
                required
              />
            </div>
            <SubmitButton
              pendingText="Signing In..."
              formAction={signInAction}
              className="bg-trip-brown-100 w-1/2 text-trip-brown-200 px-4 py-2 rounded-full font-semibold hover:bg-[#cbb192] hover:scale-105 transition text-center"
            >
              Log In
            </SubmitButton>
            <FormMessage message={searchParams} />
          </div>
        </form>
      </div>
    </div>
  );
}
