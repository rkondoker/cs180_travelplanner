"use client";
import { useState } from "react";
import { FormData, handleLogin } from "@/utils/login/handleLogin";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({});
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const user = await handleLogin(formData);
      setError(null);
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/account");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occured");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="absolute top-50 left-1/2 transform -translate-x-1/2 z-10">
        {error && (
          <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
            {error}
          </div>
        )}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        className="bg-trip-brown-200 p-8 rounded-xl w-125 shadow-lg font-trip-main"
      >
        <form onSubmit={handleSubmit}>
          <h2 className="text-white text-3xl font-bold font-trip-main mb-6 border-b border-white pb-2">
            Log in
          </h2>
          <div className="mb-4">
            <label className="block text-white text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-3 py-2 rounded bg-white text-black"
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-3 py-2 rounded bg-white text-black"
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-center gap-30">
            <Link
              href="/createaccount"
              className="bg-trip-brown-100 hover:bg-[#cbb192] text-trip-brown-200 font-semibold py-2 px-6 rounded-full transition duration-300 transform hover:scale-105 text-center"
            >
              Sign Up
            </Link>
            <button
              type="submit"
              className="bg-trip-brown-100 w-1/4 text-trip-brown-200 px-4 py-2 ml-1 rounded-full font-semibold hover:bg-[#cbb192] hover:scale-105 transition"
            >
              Log In
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
