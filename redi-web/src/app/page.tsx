"use client"; // for using useState

import { apiAddEmail, getEmails } from "@/api/api";
import React, { useState } from "react";
import { API_BASE_URL } from "../../constants/constants";

export default function Home() {
  const [email, setEmail] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pingResponse, setPingResponse] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      await apiAddEmail(email);
      setEmails((prev) => [...prev, email]); // update UI optimistically
      setEmail(""); // clear input
      alert("Email added successfully!");
    } catch {
      setError("Failed to add email");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmails = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getEmails();
      setEmails(list);
    } catch {
      setError("Failed to load emails");
    } finally {
      setLoading(false);
    }
  };

  const callPingApi = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/ping`);
      const text = await response.text();
      setPingResponse(text); // should be 'pong'
    } catch (error) {
      setPingResponse("Failed to call API");
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
        onClick={fetchEmails}
        disabled={loading}
        className={`mt-6 text-white rounded-md px-6 py-2 transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Loading emails..." : "Get emails"}
      </button>

      {emails.length > 0 && (
        <p className="mt-4 max-w-md break-words">{emails.join(" ")}</p>
      )}

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
