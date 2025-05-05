const Login = () => {
  const fields = [
    { label: "Username", type: "text", name: "username" },
    { label: "Password", type: "password", name: "password" },
    { label: "Confirm Password", type: "password", name: "confirmPassword" },
    { label: "Email", type: "email", name: "email" },
    { label: "Age", type: "number", name: "age" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-trip-brown-200 p-8 rounded-xl w-[32rem] shadow-lg font-trip-main">
        <h2 className="text-white text-3xl font-bold mb-6 border-b border-white pb-2">
          Create Account
        </h2>

        {fields.map((field) => (
          <div className="mb-6" key={field.name}>
            <label className="block text-white text-sm mb-1">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              className="w-full px-3 py-2 rounded bg-white text-black"
            />
          </div>
        ))}

        <div className="flex justify-center">
          <button className="bg-trip-brown-100 w-1/4 text-trip-brown-200 px-4 py-2 ml-1 rounded-full font-semibold hover:bg-[#cbb192] transition">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
