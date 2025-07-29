// patient-only step indicator for OTP flows
import { motion } from "framer-motion";

export default function PatientStepIndicator({ current }) {
  const steps = [1, 2];
  return (
    <div className="flex items-center justify-center space-x-2 mb-6">
      {steps.map((s) => (
        <motion.div
          key={s}
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: s === current ? 1.2 : 1, opacity: s === current ? 1 : 0.5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
            s === current ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          {s}
        </motion.div>
      ))}
    </div>
  );
}
