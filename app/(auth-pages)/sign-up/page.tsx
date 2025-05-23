import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

// import { signUpAction } from "@/app/actions"; // Uncomment when using formAction

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;

  const fields = [
    {
      label: "Email",
      name: "email",
      type: "email",
      placeholder: "email@example.com",
    },
    {
      label: "Username",
      name: "username",
      type: "text",
      placeholder: "user_example",
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      placeholder: "Your Password",
    },
    {
      label: "Confirm Password",
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirm Your Password",
    },
  ];

  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-trip-brown-200 p-8 rounded-xl w-[32rem] shadow-lg font-trip-main">
        <h2 className="text-white text-3xl font-bold mb-2 border-b border-white pb-2">
          Create Account
        </h2>
        <p className="text-sm text-white mb-6">
          Already have an account?{" "}
          <Link href="/sign-in" className="underline text-trip-brown-100">
            Sign in
          </Link>
        </p>

        <form className="flex flex-col gap-4">
          {fields.map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <Label htmlFor={name} className="text-white text-sm mb-1 block">
                {label}
              </Label>
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                required
                className="w-full px-3 py-2 rounded bg-white text-black"
              />
            </div>
          ))}

          <div className="flex justify-center mt-4">
            <SubmitButton
              // formAction={signUpAction}
              pendingText="Signing up..."
              className="bg-trip-brown-100 w-1/4 text-trip-brown-200 px-4 py-2 rounded-full font-semibold hover:bg-[#cbb192] hover:scale-105 transition"
            >
              Sign Up
            </SubmitButton>
          </div>
          <FormMessage message={searchParams} />
        </form>
      </div>
    </div>
  );
}
