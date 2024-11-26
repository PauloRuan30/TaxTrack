import React, { useState } from "react";

import { Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate a signup request

    if (name === "" || email === "" || password === "") {
      setError("Please fill in all fields");
    } else {
      // Here you would typically handle the signup logic

      console.log("Signing up with:", { name, email, password });

      // Reset error if signup is successful

      setError("");
    }
  };

  return (
    <div className="wrapper signUp">
      <div className="illustration">
        <img src="https://source.unsplash.com/random" alt="illustration" />
      </div>

      <div className="form">
        <div className="heading">CREATE AN ACCOUNT</div>

        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500">{error}</p>}

          <div>
            <label htmlFor="name">Name</label>

            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="email">E-Mail</label>

            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>

            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit">Submit</button>

          <h2 align="center" class="or">
            OR
          </h2>
        </form>

        <p>
          Have an account ? <Link to="/"> Login </Link>
        </p>
      </div>
    </div>
  );
}
