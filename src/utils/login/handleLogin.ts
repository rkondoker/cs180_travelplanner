export type FormData = {
  email?: string;
  password?: string;
};

export const handleLogin = async (formData: FormData) => {
  const { email, password } = formData;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const response = await fetch("http://localhost:8080/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const user = await response.json();

  if (!response.ok) {
    throw new Error("The email or password is incorrect, please try again.");
  }

  return user;
};
