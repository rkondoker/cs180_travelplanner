import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex flex-col items-center justify-center mt-5 bg-trip-brown-200 rounded-xl text-white p-8 font-trip-main">
      <form className="flex flex-col min-w-64 items-center justify-center">
        <h1 className="text-2xl font-medium">Sign in</h1>
        <p className="text-sm text-foreground">
          Don't have an account?{" "}
          <Link
            className="text-foreground font-medium underline"
            href="/sign-up"
          >
            Sign up
          </Link>
        </p>
        <div className="flex flex-col items-center justify-center gap-2 mt-8">
          <div className="flex flex-col justify-start items-start gap-2">
            <Label htmlFor="email">Email</Label>
            <input
              className="px-3 rounded-xl"
              name="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="flex flex-col justify-start items-start gap-2">
            <Label htmlFor="password">Password</Label>
            <input
              className="rounded-xl px-3"
              type="password"
              name="password"
              placeholder="Your password"
              required
            />
          </div>
          <SubmitButton
            pendingText="Signing In..."
            formAction={signInAction}
            className="bg-trip-brown-100 w-1/4 text-trip-brown-200 px-16 py-2 rounded-full font-semibold hover:bg-[#cbb192] transition"
          >
            Sign in
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </div>
  );
}
