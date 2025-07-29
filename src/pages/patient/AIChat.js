import React from "react";
import ChatWidget from "../../components/ChatWidget";

export default function AIChat() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-semibold mb-4">AI Symptom Checker</h2>
      <ChatWidget />
    </div>
  );
}
