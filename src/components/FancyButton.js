// shared gradient button with spinner
import { motion } from "framer-motion";

export default function FancyButton({
  children,
  loading = false,
  onClick,
  className = "",
  ...props
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      disabled={loading}
      onClick={onClick}
      className={`
        relative flex items-center justify-center px-6 py-2 rounded-lg text-white font-medium
        bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5 mr-2 text-white absolute left-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none" viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
          <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75"/>
        </svg>
      )}
      <span className={loading ? "opacity-50" : ""}>{children}</span>
    </motion.button>
  );
}
