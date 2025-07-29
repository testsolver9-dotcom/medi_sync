// File: src/components/doctor/StepIndicator.js
import { motion } from "framer-motion";

export default function StepIndicator({ current }) {
  const steps = [1, 2, 3];
  return (
    <div className="flex items-center justify-center space-x-2 mb-8">
      {steps.map((step) => (
        <motion.div
          key={step}
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{
            scale: current === step ? 1.2 : 1,
            opacity: current === step ? 1 : 0.5,
          }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
            current === step ? "bg-teal-600" : "bg-gray-300"
          }`}
        >
          {step}
        </motion.div>
      ))}
    </div>
  );
}
