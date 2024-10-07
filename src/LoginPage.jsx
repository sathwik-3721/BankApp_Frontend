import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LockIcon, UserIcon } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function Component() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        alert("Check email or password");
        throw new Error("Login failed");
      }

      const result = await response.json();

      localStorage.setItem("token", result.token);
      localStorage.setItem("email", email);

      try {
        const token = result.token;
        const usernameResponse = await fetch(`http://localhost:8000/v1/bank/getUserName/${email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!usernameResponse.ok) {
          throw new Error("Failed to fetch username");
        }

        const usernameResult = await usernameResponse.json();
        localStorage.setItem("username", usernameResult.name);
      } catch (usernameError) {
        console.error("Error fetching username:", usernameError);
        localStorage.setItem("username", email.split('@')[0]);
      }

      navigate("/home/dashboard");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <div className="z-10 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-8 max-w-md w-full transition-all duration-300 ease-in-out hover:shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">miraBank</h1>
          <p className="text-blue-700">Login to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-blue-900 font-semibold">
              Email
            </Label>
            <div className="relative">
              <UserIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500"
                size={20}
              />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-white bg-opacity-50 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-blue-900 font-semibold">
              Password
            </Label>
            <div className="relative">
              <LockIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500"
                size={20}
              />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-white bg-opacity-50 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md"
                required
              />
            </div>
          </div>
          <div className="text-center">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
          >
            Log In
          </Button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-blue-700">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}