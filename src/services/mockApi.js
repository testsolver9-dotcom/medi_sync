// File: src/services/mockApi.js

// Enhanced fake in‐memory "database" with more realistic medical data
let _records = [
  { 
    id: 1, 
    date: "2024-12-15", 
    doctorName: "Dr. Sarah Johnson", 
    symptoms: "Fever, headache, body aches",
    diagnosis: "Viral Fever",
    medicines: "Paracetamol 650mg, Rest, Plenty of fluids",
    notes: "Patient advised to return if symptoms worsen. Follow-up in 3 days.",
    fileUrl: "#" 
  },
  { 
    id: 2, 
    date: "2024-11-28", 
    doctorName: "Dr. Michael Chen", 
    symptoms: "Chest pain, shortness of breath",
    diagnosis: "Anxiety-related chest discomfort",
    medicines: "Alprazolam 0.25mg (as needed), Relaxation exercises",
    notes: "ECG normal. Stress management techniques recommended.",
    fileUrl: "#" 
  },
  { 
    id: 3, 
    date: "2024-10-05", 
    doctorName: "Dr. Emily Williams", 
    symptoms: "Persistent cough, sore throat",
    diagnosis: "Upper Respiratory Tract Infection",
    medicines: "Azithromycin 500mg, Cough syrup, Throat lozenges",
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

// 1) Patient registration & OTP - UPDATED for new fields
export async function registerPatient(data) {
  console.log("registerPatient with new fields:", data);
  // Simulate API delay and validate new required fields
  const { fullName, email, phone, dateOfBirth, gender, address, password } = data;
  
  if (!fullName || !email || !phone || !dateOfBirth || !gender || !address || !password) {
    throw new Error('All required fields must be provided');
  }
  
  // Simulate validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Invalid email format');
  }
  
  return new Promise((res) => setTimeout(res, 800));
}

export async function verifySignupOtp(phone, otp) {
  console.log("verifySignupOtp", phone, otp);
  if (otp !== '123456') {
    throw new Error('Invalid OTP. Please enter 123456 for demo.');
  }
  return { 
    id: "patient999", 
    name: "Jane Doe", 
    age: 29, 
    sex: "Female", 
    weight: "65 kg", 
    height: "170 cm", 
    allergies: "Penicillin, Peanuts", 
    chronic: "Mild Hypertension",
    email: "jane.doe@email.com",
    phone: phone,
    address: "123 Main St, City, State 12345"
  };
}

// 2) Login & OTP
export async function sendOtp(phoneOrId) {
  console.log("sendOtp to", phoneOrId);
  return new Promise((res) => setTimeout(res, 800));
}

export async function verifyOtp(phoneOrId, otp) {
  console.log("verifyOtp", phoneOrId, otp);
  if (otp !== '123456') {
    throw new Error('Invalid OTP. Please enter 123456 for demo.');
  }
  return { 
    id: "patient999", 
    name: "Jane Doe", 
    age: 29, 
    sex: "Female", 
    weight: "65 kg", 
    height: "170 cm", 
    allergies: "Penicillin, Peanuts", 
    chronic: "Mild Hypertension",
    email: "jane.doe@email.com",
    phone: phoneOrId,
    address: "123 Main St, City, State 12345"
  };
}

// 3) Data fetchers
export async function fetchPatientRecords(patientId) {
  console.log("fetchPatientRecords for", patientId);
  return new Promise((res) => setTimeout(() => res([..._records]), 500));
}

export async function fetchPathReports(patientId) {
  console.log("fetchPathReports for", patientId);
  return new Promise((res) => setTimeout(() => res(_reports), 500));
}

export async function fetchAccessLogs(patientId) {
  console.log("fetchAccessLogs for", patientId);
  return new Promise((res) => setTimeout(() => res(_logs), 500));
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
      symptoms: record.symptoms || "General consultation",
      diagnosis: record.diagnosis || "Under observation",
      medicines: record.medicines || "As prescribed",
      notes: record.notes || "Follow-up as needed",
      fileUrl: "#"
    },
    ..._records
  ];
  return new Promise((res) => setTimeout(() => res({ success: true }), 800));
}

// 5) Enhanced AI Chat
export async function askAI(message) {
  console.log("AI Query:", message);
  
  // Enhanced AI responses based on keywords
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

// 6) Enhanced Hospital finder
export async function getHospitals(lat, lng) {
  // If no location, return empty array
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return [];
  }
  
  // Return enhanced mock hospitals with more details
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