import React, { useState } from "react";
import FancyButton from "../components/FancyButton";

export default function FancyButtonDemo() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">FancyButton Demo</h1>
      <div className="space-y-6 w-full max-w-md">
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-2">Default</h2>
          <FancyButton onClick={() => alert('Clicked!')}>Click Me</FancyButton>
        </div>
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-2">Loading State</h2>
          <FancyButton loading={loading} onClick={() => setLoading(true)}>
            {loading ? 'Loading...' : 'Start Loading'}
          </FancyButton>
          {loading && (
            <button className="mt-2 text-blue-600 underline" onClick={() => setLoading(false)}>
              Stop Loading
            </button>
          )}
        </div>
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-2">Disabled</h2>
          <FancyButton disabled>Disabled Button</FancyButton>
        </div>
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-2">With Icon</h2>
          <FancyButton onClick={() => alert('Icon Clicked!')}>
            <span role="img" aria-label="star" className="mr-2">⭐</span>
            Starred
          </FancyButton>
        </div>
      </div>
    </div>
  );
} 