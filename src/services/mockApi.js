// File: src/services/mockApi.js

// Intercepts API calls and returns mock data instead of using real backend.

// File: src/services/mockApi.js

// Fake in‐memory “database”
let _records = [
  { id: 1, date: "2025-06-01", doctorName: "Dr. Smith", fileUrl: "#" },
  { id: 2, date: "2025-05-15", doctorName: "Dr. Jones", fileUrl: "#" },
];
const _reports = [
  { id: 1, date: "2025-06-05", labName: "Best Lab", summary: "All normal", fileUrl: "#" },
];
const _logs = [
  { time: "2025-06-10 14:23", action: "view", by: "doctor123" },
  { time: "2025-06-09 11:05", action: "download", by: "patient999" },
];

// 1) Patient registration & OTP
export async function registerPatient(data) {
  console.log("registerPatient", data);
  // simulate API delay
  return new Promise((res) => setTimeout(res, 500));
}

export async function verifySignupOtp(phone, otp) {
  console.log("verifySignupOtp", phone, otp);
  if (otp !== '123456') {
    throw new Error('Invalid OTP');
  }
  return { id: "patient999", name: "Jane Doe", age: 29, sex: "F", weight: 65, height: 170, allergies: "", chronic: "" };
}

// 2) Login & OTP
export async function sendOtp(phoneOrId) {
  console.log("sendOtp to", phoneOrId);
  return new Promise((res) => setTimeout(res, 500));
}

export async function verifyOtp(phoneOrId, otp) {
  console.log("verifyOtp", phoneOrId, otp);
  if (otp !== '123456') {
    throw new Error('Invalid OTP');
  }
  return { id: "patient999", name: "Jane Doe", age: 29, sex: "F", weight: 65, height: 170, allergies: "", chronic: "" };
}

// 3) Data fetchers
export async function fetchPatientRecords(patientId) {
  console.log("fetchPatientRecords for", patientId);
  return new Promise((res) => setTimeout(() => res([..._records]), 300));
}

export async function fetchPathReports(patientId) {
  console.log("fetchPathReports for", patientId);
  return new Promise((res) => setTimeout(() => res(_reports), 300));
}

export async function fetchAccessLogs(patientId) {
  console.log("fetchAccessLogs for", patientId);
  return new Promise((res) => setTimeout(() => res(_logs), 300));
}

// 4) Upload record
export async function uploadRecord(patientId, record) {
  console.log("uploadRecord for", patientId, record);
  // Add new record to the top
  _records = [
    {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      doctorName: record.doctorName || "Dr. Smith",
      symptoms: record.symptoms,
      diagnosis: record.diagnosis,
      medicines: record.medicines,
      notes: record.notes,
      fileUrl: "#"
    },
    ..._records
  ];
  return new Promise((res) => setTimeout(() => res({ success: true }), 500));
}

// 5) AI & Hospitals (already existed):
export async function askAI(message) {
  // ...
}
export async function getHospitals(lat, lng) {
  // If no location, return empty array
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return [];
  }
  // Return mock hospitals
  return [
    { name: 'City Hospital', address: '123 Main St', phone: '123-456-7890' },
    { name: 'Green Valley Clinic', address: '456 Oak Ave', phone: '987-654-3210' },
    { name: 'Red Cross Emergency', address: '789 Pine Rd', phone: '555-555-5555' }
  ];
}
