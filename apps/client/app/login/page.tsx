"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function UserAuth() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkSession() {
      const session = await getSession();
      if (session) {
        router.push("/dashboard");
      }
    }
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const res = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (res?.error) {
          throw new Error(res.error);
        }

        window.location.href = "/dashboard";
      } else {
        const res = await fetch("/login/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message || "Failed to create an account");
        }

        const loginRes = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (loginRes?.error) {
          throw new Error(loginRes.error);
        }

        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-300 dark:bg-gray-700">
      <div className="m-auto flex items-center align-center h-screen justify-center dark:bg-gray-700">
        <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md">
          <div className="px-6 py-4">
            <div className="flex justify-center mx-auto">
              <h3>PayU</h3>
            </div>
            <h3 className="mt-3 text-xl font-medium text-center text-black">
              {isLogin ? "Welcome Back" : "Create an Account"}
            </h3>
            <p className="mt-1 text-center text-gray-500 dark:text-gray-400">
              {isLogin ? "Login to continue" : "Sign up to get started"}
            </p>
            <form onSubmit={handleSubmit}>
              <div className="w-full mt-4">
                <input
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  aria-label="Email Address"
                  required
                />
              </div>
              <div className="w-full mt-4">
                <input
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  aria-label="Password"
                  required
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-500 text-center">{error}</p>
              )}
              <div className="flex items-center justify-between mt-4">
                {isLogin && (
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-300"
                  >
                    Forgot Password?
                  </a>
                )}
                <button
                  type="submit"
                  className="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-black rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                  disabled={loading}
                >
                  {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
                </button>
              </div>
            </form>
          </div>
          <div className="flex items-center justify-center py-4 text-center bg-black">
            <span className="text-sm text-white">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>
            <p
              className="mx-2 text-sm font-bold text-blue-500 dark:text-blue-400 hover:underline cursor-pointer"
              onClick={() => setIsLogin((prev) => !prev)}
            >
              {isLogin ? "Register" : "Login"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
