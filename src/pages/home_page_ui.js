import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-white px-4">
      <h1 className="text-4xl font-bold text-teal-700 mb-2 text-center">
        Welcome to MediSync
      </h1>
      <p className="text-gray-600 mb-8 text-center">
        Please select how you'd like to log in:
      </p>
      <div className="flex w-full justify-center">
        <div className="flex flex-col md:flex-row gap-4 md:space-x-6 w-full max-w-xs md:max-w-none md:w-auto">
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-center"
          >
            Patient Login
          </Link>
          <Link
            to="/doctor/login"
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition text-center"
          >
            Doctor Login
          </Link>
        </div>
      </div>
      {/* Remove FancyButton Demo link and add PathLab button */}
      <div className="mt-8 text-center">
        <Link to="/pathlab-auth" className="inline-block px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg shadow hover:from-yellow-600 hover:to-orange-600 font-semibold transition">
          PathLab Login / Register
        </Link>
      </div>
    </div>
  );
}
