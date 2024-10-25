import React, { useState } from "react";

import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate a login request

    if (email === "" || password === "") {
      setError("Please fill in all fields");
    } else {
      // Here you would typically handle the login logic

      console.log("Logging in with:", { email, password });

      // Reset error if login is successful

      setError("");
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-screen bg-white">
      {/* Left Side - Login Form */}

      <div className="flex flex-col justify-center items-center p-8 md:w-1/2 relative">
        <div className="w-full max-w-md">
          <h1 className="text-black text-[32px] font-medium font-['Poppins'] mb-2">
            Bem-vindo de volta
          </h1>

          <p className="text-black text-base font-medium font-['Poppins'] mb-6">
            Insira suas credenciais para acessar sua conta
          </p>

          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500">{error}</p>}

            {/* Email Field */}

            <div className="mb-4">
              <label className="block text-black text-sm font-medium mb-1">
                Email
              </label>

              <input
                type="email"
                placeholder="Insira seu Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 pl-2.5 py-2.5 rounded-[10px] border border-[#d9d9d9] placeholder-[#d9d9d9]"
              />
            </div>

            {/* Password Field */}

            <div className="mb-4 relative">
              <label className="block text-black text-sm font-medium mb-1">
                Senha
              </label>

              <input
                type="password"
                placeholder="Insira sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 pl-2.5 py-2.5 rounded-[10px] border border-[#d9d9d9] placeholder-[#d9d9d9]"
              />

              <Link
                to="/Signup"
                className="absolute right-0 top-0 text-[#0c2991] text-[10px] font-medium font-['Poppins']"
              >
                Esqueceu sua senha?
              </Link>
            </div>

            {/* Remember Me */}

            <div className="flex items-center mb-4">
              <input type="checkbox" className="mr-2" />

              <span className="text-black text-[9px] font-medium font-['Poppins']">
                Lembrar por 30 dias
              </span>
            </div>

            {/* Login Button */}

            <button
              type="submit"
              className="w-full h-10 bg-[#3a5b22] text-white text-[13px] font-bold font-['Poppins'] rounded-[10px] mb-4"
            >
              Login
            </button>

            {/* Or Divider */}

            <div className="flex items-center mb-4">
              <div className="flex-grow border-t border-neutral-100"></div>

              <span className="mx-2 text-black text-[9px] font-medium font-['Poppins']">
                Or
              </span>

              <div className="flex -grow border-t border-neutral-100"></div>
            </div>

            {/* Sign in with Google */}

            <div className="flex items-center justify-center mb-4">
              <div className="px-5 py-1 rounded-[10px] border border-[#d9d9d9] flex items-center">
                <div className="w-6 h-6 relative mr-2" />

                <span className="text-black text-xs font-medium font-['Poppins']">
                  Sign in with Google
                </span>
              </div>
            </div>

            {/* Sign Up Link */}

            <p className="text-sm text-center">
              Não possui uma conta?{" "}
              <Link to="/Signup" className="text-[#0f3cde]">
                Inscreva-se
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Illustration */}

      <div className="flex-1 bg-[#5085a5] rounded-tl-[394px] rounded-tr-[394px] relative">
        <img
          className="absolute left-1/2 transform -translate-x-1/2 top-10"
          src="https://via.placeholder.com/531x537"
          alt="illustration"
        />
      </div>
    </div>
  );
}
