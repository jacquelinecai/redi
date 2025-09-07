'use client'; // for using useState

import React, { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Entered email: ${email}`);
    // Add further processing logic here if needed
  };

  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen p-8 gap-6">
      <h1 className="text-6xl font-bold">redi</h1>
      <p className="text-xl">are you redi to find love?</p>
      <p className="text-lg">if so enter your email</p>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded-md px-6 py-2 hover:bg-blue-700 transition"
        >
          Enter
        </button>
      </form>
    </div>
  );
}
