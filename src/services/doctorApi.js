// Mock implementations for doctor workflows
import { fetchPatientRecords } from "./mockApi";
export const sendDoctorOtp = async (doctorId) => {
  console.debug("Mock: send OTP to doctor", doctorId);
  return Promise.resolve();
};

export const verifyDoctorOtp = async (doctorId, otp) => {
  console.debug("Mock: verify OTP for doctor", doctorId, otp);
  if (otp !== '123456') {
    throw new Error('Invalid OTP');
  }
  // login flow: returns doctor profile
  return Promise.resolve({ doctor: { id: doctorId, name: "Dr. Jane Doe" } });
};

// --- NEW: registration mocks ---

// Step 1: register doctor (collect name, email, NMC, phone, etc.)
// Step 1: register doctor (collect name, email, phone, specialization, location, password)
export const registerDoctor = async (data) => {
  console.debug("Mock: register doctor", data);
  const { name, email, phone, specialization, location, password } = data;
  // basic validations similar to frontend; throw error if invalid
  if (!name?.trim()) throw new Error("Name is required");
  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Invalid email");
  }
  if (!phone?.trim() || !/^\+?[\d\s\-()]{10,}$/.test(phone)) {
    throw new Error("Invalid phone number");
  }
  if (!specialization?.trim()) throw new Error("Specialization is required");
  if (!location?.trim()) throw new Error("Location is required");
  if (!password || password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
    throw new Error("Weak password");
  }
  // in real: save doctor and send OTP via SMS/email
  return Promise.resolve();
};

// Step 2: verify doctor signup OTP
export const verifyDoctorSignupOtp = async (doctorId, otp) => {
  console.debug("Mock: verify signup OTP", doctorId, otp);
  if (otp !== '123456') {
    throw new Error('Invalid OTP');
  }
  // returns same shape as verifyDoctorOtp
  return Promise.resolve({ doctor: { id: doctorId, name: "Dr. Jane Doe" } });
};

// your other mocks…

export const requestPatientConsent = async (patientId) => {
  console.debug("Mock: request consent for patient", patientId);
  // simulate patient verifying after 2s
  await new Promise(r => setTimeout(r, 2000));
  return Promise.resolve({ patient: { id: patientId, name: "John Smith" } });
};

export const fetchRecords = async (doctorId, patientId) => {
  console.debug("Mock: fetchRecords for", doctorId, patientId);
  // delegate to patient record fetcher so both doctor and patient view same data
  const patientRecords = await fetchPatientRecords(patientId);
  return { records: patientRecords };
};

export const saveRecord = async (record) => {
  console.debug("Mock: saveRecord", record);
  return Promise.resolve({ success: true });
};

export const fetchAccessHistory = async (doctorId) => {
  console.debug("Mock: fetchAccessHistory", doctorId);
  return Promise.resolve({
    history: [
      { time: "2025-06-22 10:00", patientId: "p1", action: "view", location: "Hospital" },
      { time: "2025-06-21 15:30", patientId: "p2", action: "upload", location: "Home Clinic" },
    ]
  });
};
