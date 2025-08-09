// File: src/services/realApi.js
// Real API service that connects to FastAPI backend

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Utility function to handle API errors
const handleApiError = (error) => {
  if (error.response && error.response.data && error.response.data.detail) {
    throw new Error(error.response.data.detail);
  }
  throw new Error(error.message || 'An error occurred');
};

// Utility function to make API calls
const apiCall = async (endpoint, method = 'GET', data = null) => {
  const url = `${BACKEND_URL}${endpoint}`;
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.detail || 'API request failed');
    }
    
    return result;
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error);
    throw error;
  }
};

// Patient Authentication APIs
export async function sendOtp(phoneOrId) {
  console.log("Real API: sendOtp to", phoneOrId);
  
  try {
    const result = await apiCall('/api/patient/send-otp', 'POST', {
      phone: phoneOrId
    });
    
    return result;
  } catch (error) {
    throw new Error(error.message || 'Failed to send OTP');
  }
}

export async function verifyOtp(phoneOrId, otp) {
  console.log("Real API: verifyOtp", phoneOrId, otp);
  
  try {
    const result = await apiCall('/api/patient/verify-otp', 'POST', {
      phone: phoneOrId,
      otp: otp
    });
    
    return result.user_data;
  } catch (error) {
    throw new Error(error.message || 'Invalid OTP');
  }
}

export async function registerPatient(data) {
  console.log("Real API: registerPatient", data);
  
  try {
    const result = await apiCall('/api/patient/register', 'POST', data);
    return result;
  } catch (error) {
    throw new Error(error.message || 'Registration failed');
  }
}

export async function verifySignupOtp(phone, otp) {
  console.log("Real API: verifySignupOtp", phone, otp);
  
  try {
    const result = await apiCall('/api/patient/verify-register-otp', 'POST', {
      phone: phone,
      otp: otp
    });
    
    return result.user_data;
  } catch (error) {
    throw new Error(error.message || 'Invalid registration OTP');
  }
}

// Doctor Authentication APIs
export async function sendDoctorOtp(doctorId) {
  console.log("Real API: sendDoctorOtp", doctorId);
  
  // For doctor login, we need to get phone number by doctor ID first
  // For now, using doctorId as phone number for demo
  try {
    const result = await apiCall('/api/doctor/send-otp', 'POST', {
      phone: doctorId
    });
    
    return result;
  } catch (error) {
    throw new Error(error.message || 'Failed to send doctor OTP');
  }
}

export async function verifyDoctorOtp(doctorId, otp) {
  console.log("Real API: verifyDoctorOtp", doctorId, otp);
  
  try {
    const result = await apiCall('/api/doctor/verify-otp', 'POST', {
      phone: doctorId,
      otp: otp
    });
    
    return { doctor: result.user_data };
  } catch (error) {
    throw new Error(error.message || 'Invalid doctor OTP');
  }
}

export async function registerDoctor(data) {
  console.log("Real API: registerDoctor", data);
  
  try {
    const result = await apiCall('/api/doctor/register', 'POST', data);
    return result;
  } catch (error) {
    throw new Error(error.message || 'Doctor registration failed');
  }
}

export async function verifyDoctorSignupOtp(phone, otp) {
  console.log("Real API: verifyDoctorSignupOtp", phone, otp);
  
  try {
    const result = await apiCall('/api/doctor/verify-register-otp', 'POST', {
      phone: phone,
      otp: otp
    });
    
    return { doctor: result.user_data };
  } catch (error) {
    throw new Error(error.message || 'Invalid doctor registration OTP');
  }
}

// Keep existing mock functions for other features that don't need OTP
// These will continue to work as before

// Enhanced fake in‐memory "database" with more realistic medical data
let _records = [
  {
    id: 1,
    date: "2024-12-15",
    doctorName: "Dr. Sarah Johnson",
    title: "Fever Consultation",
    description: "Patient reports fever, headache and body aches",
    prescription: "Paracetamol 650mg, Rest, Plenty of fluids",
    tests_recommended: "",
    notes: "Patient advised to return if symptoms worsen. Follow‑up in 3 days.",
    fileUrl: "#"
  },
  {
    id: 2,
    date: "2024-11-28",
    doctorName: "Dr. Michael Chen",
    title: "Chest Discomfort",
    description: "Chest pain, shortness of breath",
    prescription: "Alprazolam 0.25mg (as needed), Relaxation exercises",
    tests_recommended: "ECG",
    notes: "ECG normal. Stress management techniques recommended.",
    fileUrl: "#"
  },
  {
    id: 3,
    date: "2024-10-05",
    doctorName: "Dr. Emily Williams",
    title: "Upper Respiratory Infection",
    description: "Persistent cough and sore throat",
    prescription: "Azithromycin 500mg, Cough syrup, Throat lozenges",
    tests_recommended: "",
    notes: "Complete course of antibiotics. Voice rest recommended.",
    fileUrl: "#"
  }
];

const _reports = [
  { 
    id: 1, 
    date: "2024-12-10", 
    labName: "City Diagnostics", 
    summary: "Complete Blood Count: All parameters within normal limits. Hemoglobin: 13.5 g/dL, WBC: 7,200/μL, Platelets: 250,000/μL. No signs of infection or anemia.", 
    testType: "Complete Blood Count",
    status: "Normal",
    fileUrl: "#" 
  },
  { 
    id: 2, 
    date: "2024-11-20", 
    labName: "MedLab Plus", 
    summary: "Lipid Profile: Total Cholesterol: 180 mg/dL (Normal), HDL: 45 mg/dL, LDL: 110 mg/dL, Triglycerides: 125 mg/dL. Maintain healthy diet and exercise.", 
    testType: "Lipid Profile",
    status: "Normal",
    fileUrl: "#" 
  },
  { 
    id: 3, 
    date: "2024-09-15", 
    labName: "Prime Health Labs", 
    summary: "Thyroid Function Test: TSH: 2.1 mIU/L (Normal), T3: 1.2 ng/mL, T4: 8.5 μg/dL. Thyroid function is normal.", 
    testType: "Thyroid Function",
    status: "Normal",
    fileUrl: "#" 
  }
];

const _logs = [
  { time: "2024-12-15 14:23", action: "View Record", by: "Dr. Sarah Johnson (ID: DOC001)" },
  { time: "2024-12-15 14:20", action: "Create Record", by: "Dr. Sarah Johnson (ID: DOC001)" },
  { time: "2024-12-10 09:15", action: "View Lab Report", by: "You (Patient)" },
  { time: "2024-11-28 16:45", action: "Download Record", by: "Dr. Michael Chen (ID: DOC002)" },
  { time: "2024-11-28 16:30", action: "View Record", by: "Dr. Michael Chen (ID: DOC002)" },
  { time: "2024-11-20 11:20", action: "Upload Lab Report", by: "MedLab Plus (LAB001)" }
];

// Data fetchers (keep mock for now)
export async function fetchPatientRecords(patientId) {
  console.log("Mock: fetchPatientRecords for", patientId);
  return new Promise((res) => setTimeout(() => res([..._records]), 500));
}

export async function fetchPathReports(patientId) {
  console.log("Mock: fetchPathReports for", patientId);
  return new Promise((res) => setTimeout(() => res(_reports), 500));
}

export async function fetchAccessLogs(patientId) {
  console.log("Mock: fetchAccessLogs for", patientId);
  return new Promise((res) => setTimeout(() => res(_logs), 500));
}

// Upload record
export async function uploadRecord(patientId, record) {
  console.log("Mock: uploadRecord for", patientId, record);
  _records = [
    {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      doctorName: record.doctorName || "Dr. Smith",
      title: record.title || "Untitled Record",
      description: record.description || "",
      prescription: record.prescription || "",
      tests_recommended: record.tests_recommended || "",
      notes: record.notes || "",
      fileUrl: "#"
    },
    ..._records
  ];
  return new Promise((res) => setTimeout(() => res({ success: true }), 800));
}

// Enhanced AI Chat
export async function askAI(message) {
  console.log("Mock: AI Query:", message);
  
  const responses = {
    'fever': "Based on your symptoms, you might have a viral infection. Monitor your temperature, stay hydrated, and rest. If fever persists above 100.4°F (38°C) for more than 3 days, consult a doctor.",
    'headache': "Headaches can have various causes. Try rest, hydration, and over-the-counter pain relievers. If severe or persistent, or accompanied by vision changes, seek medical attention.",
    'cough': "A persistent cough could indicate respiratory infection. Stay hydrated, use honey for throat relief. If cough persists more than 2 weeks or accompanied by blood, consult a healthcare provider.",
    'chest pain': "Chest pain should be taken seriously. If sudden, severe, or accompanied by shortness of breath, sweating, or nausea, seek immediate medical attention.",
    'stomach': "For stomach discomfort, try bland foods, stay hydrated, and avoid spicy foods. If severe pain, vomiting, or fever occurs, consult a doctor.",
    'default': "I understand you're concerned about your health. While I can provide general information, it's important to consult with a healthcare professional for proper diagnosis and treatment. Would you like me to help you find nearby medical facilities?"
  };

  const lowerMessage = message.toLowerCase();
  let response = responses.default;
  
  for (const [keyword, reply] of Object.entries(responses)) {
    if (lowerMessage.includes(keyword) && keyword !== 'default') {
      response = reply;
      break;
    }
  }

  return new Promise((resolve) => {
    setTimeout(() => resolve({ response }), 1000);
  });
}

// Enhanced Hospital finder
export async function getHospitals(lat, lng) {
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return [];
  }
  
  return [
    { 
      name: 'City General Hospital', 
      address: '123 Main Street, Downtown', 
      phone: '+1-555-0101',
      distance: '0.8 km',
      specialty: 'Emergency Care, General Medicine',
      rating: '4.5/5'
    },
    { 
      name: 'St. Mary\'s Medical Center', 
      address: '456 Oak Avenue, Midtown', 
      phone: '+1-555-0202',
      distance: '1.2 km',
      specialty: 'Cardiology, Emergency Care',
      rating: '4.7/5'
    },
    { 
      name: 'Green Valley Emergency Clinic', 
      address: '789 Pine Road, Suburbs', 
      phone: '+1-555-0303',
      distance: '2.1 km',
      specialty: '24/7 Emergency, Urgent Care',
      rating: '4.3/5'
    },
    { 
      name: 'Metro Health Complex', 
      address: '321 Elm Street, City Center', 
      phone: '+1-555-0404',
      distance: '2.8 km',
      specialty: 'Multi-Specialty Hospital',
      rating: '4.6/5'
    }
  ];
}

// Keep existing doctor API functions for other features
export const requestPatientConsent = async (patientId) => {
  console.debug("Mock: request consent for patient", patientId);
  await new Promise(r => setTimeout(r, 2000));
  return Promise.resolve({ patient: { id: patientId, name: "John Smith" } });
};

export const fetchRecords = async (doctorId, patientId) => {
  console.debug("Mock: fetchRecords for", doctorId, patientId);
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