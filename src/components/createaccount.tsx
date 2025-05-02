const Login = () => {
  return (
    <div className="min-h-screen bg-trip-blue-200 flex items-center justify-center">
      <div className="bg-trip-brown-200 p-8 rounded-xl w-125 shadow-lg font-trip-main">
        <h2 className="text-white text-3xl font-bold font-trip-main mb-6 border-b border-white pb-2">
          Create Account
        </h2>

        <div className="mb-4">
          <label className="block text-white text-sm mb-1">Username</label>
          <input
            type="text"
            className="w-full px-3 py-2 rounded bg-white text-black"
          />
        </div>

        <div className="mb-6">
          <label className="block text-white text-sm mb-1">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 rounded bg-white text-black"
          />
        </div>

        <div className="mb-6">
          <label className="block text-white text-sm mb-1">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 rounded bg-white text-black"
          />
        </div>

        <div className="mb-6">
          <label className="block text-white text-sm mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            className="w-full px-3 py-2 rounded bg-white text-black"
          />
        </div>

        <div className="mb-6">
          <label className="block text-white text-sm mb-1">Email</label>
          <input
            type="password"
            className="w-full px-3 py-2 rounded bg-white text-black"
          />
        </div>

        <div className="mb-6">
          <label className="block text-white text-sm mb-1">Age</label>
          <input
            type="password"
            className="w-full px-3 py-2 rounded bg-white text-black"
          />
        </div>

        <div className="flex justify-center gap-30">
          <button className="bg-trip-brown-100 w-1/4 text-trip-brown-200 px-4 py-2 ml-1 rounded-full font-semibold hover:bg-[#cbb192] transition">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
