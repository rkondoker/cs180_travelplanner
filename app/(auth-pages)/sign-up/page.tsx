// import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

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

  return (
    <div className="flex flex-col items-center justify-center mt-5 bg-trip-brown-200 rounded-xl text-white px-12 py-8 font-trip-main">
      <form className="flex flex-col min-w-64 max-w-64 mx-auto">
        <h1 className="text-2xl font-medium">Sign up</h1>
        <p className="text-sm text text-foreground">
          Already have an account?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>
        <div className="flex flex-col items-center gap-4 mt-8">
          {fields.map(({ label, name, type, placeholder }, index) => (
            <div key={index}>
              <Label htmlFor={name}>{label}</Label>
              <input
                name={name}
                placeholder={placeholder}
                type={type}
                required
                className="px-3 rounded-xl text-black"
              />
            </div>
          ))}
          <SubmitButton
            // formAction={signUpAction}
            pendingText="Signing up..."
            className="bg-trip-brown-100 w-1/4 text-trip-brown-200 px-16 py-2 rounded-full font-semibold hover:bg-[#cbb192] transition"
          >
            Sign up
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </div>
  );
}
