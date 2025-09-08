'use client'; // for using useState

import React, { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [pingResponse, setPingResponse] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Entered email: ${email}`);
    // Add further processing logic here if needed
  };

  const callPingApi = async () => {
    try {
      const response = await fetch('http://localhost:3001/ping'); // adjust URL if your backend runs elsewhere
      const text = await response.text();
      setPingResponse(text); // should be 'pong'
    } catch (error) {
      setPingResponse('Failed to call API');
    }
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

      <button
        onClick={callPingApi}
        className="mt-6 bg-green-600 text-white rounded-md px-6 py-2 hover:bg-green-700 transition"
      >
        Call /ping API
      </button>

      {pingResponse && <p className="mt-4 text-lg">Response: {pingResponse}</p>}
    </div>
  );
}
