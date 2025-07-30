import React, { useEffect, useState } from "react";
import SidebarNav from "../../components/SidebarNav";
import { getHospitals } from "../../services/mockApi";
import { motion, AnimatePresence } from "framer-motion";

export default function Emergency() {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(null);

  const fetchHospitals = () => {
    setLoading(true);
    setError("");
    
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLocation(pos.coords);
        try {
          const hospitalList = await getHospitals(pos.coords.latitude, pos.coords.longitude);
          setHospitals(hospitalList);
        } catch (err) {
          setError("Failed to fetch nearby hospitals. Please try again.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError("Location access denied. Please enable location services to find nearby hospitals.");
        setLoading(false);
        // For demo purposes, show mock hospitals even without location
        getHospitals(40.7128, -74.0060).then(setHospitals);
      }
    );
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleCall = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleDirections = (hospital) => {
    // In a real app, this would open maps with directions
    const address = encodeURIComponent(hospital.address);
    window.open(`https://www.google.com/maps/search/${address}`, '_blank');
  };

  const emergencyNumbers = [
    { name: "Emergency Services", number: "911", description: "Police, Fire, Medical Emergency" },
    { name: "Poison Control", number: "1-800-222-1222", description: "24/7 Poison Emergency" },
    { name: "Crisis Hotline", number: "988", description: "Suicide & Crisis Lifeline" }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNav />
      <main className="flex-1 overflow-y-auto p-8">
        {/* Emergency Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-lg p-8 text-white mb-8"
        >
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            🚨 Emergency Support
          </h1>
          <p className="text-red-100">
            Quick access to nearby hospitals and emergency services. If this is a life-threatening emergency, call 911 immediately.
          </p>
        </motion.div>

        {/* Emergency Numbers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Emergency Hotlines</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {emergencyNumbers.map((emergency, index) => (
              <div key={index} className="bg-red-50 border border-red-200 rounded-xl p-4">
                <h3 className="font-semibold text-red-800 mb-1">{emergency.name}</h3>
                <p className="text-sm text-red-600 mb-3">{emergency.description}</p>
                <button
                  onClick={() => handleCall(emergency.number)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                >
                  Call {emergency.number}
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Nearby Hospitals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Nearby Hospitals</h2>
            <button
              onClick={fetchHospitals}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              🔄 Refresh Location
            </button>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-12"
              >
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Locating nearby hospitals...</p>
                </div>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <div className="text-red-600 text-5xl mb-4">⚠️</div>
                  <p className="text-red-700 mb-4">{error}</p>
                  <button
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    onClick={fetchHospitals}
                  >
                    Try Again
                  </button>
                </div>
              </motion.div>
            ) : hospitals.length === 0 ? (
              <motion.div
                key="no-hospitals"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <p className="text-gray-600">No nearby hospitals found.</p>
              </motion.div>
            ) : (
              <motion.div
                key="hospitals"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {hospitals.map((hospital, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{hospital.name}</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p className="flex items-center">
                            <span className="mr-2">📍</span>
                            {hospital.address}
                          </p>
                          <p className="flex items-center">
                            <span className="mr-2">🏥</span>
                            {hospital.specialty}
                          </p>
                          <p className="flex items-center">
                            <span className="mr-2">📏</span>
                            Distance: {hospital.distance}
                          </p>
                          <p className="flex items-center">
                            <span className="mr-2">⭐</span>
                            Rating: {hospital.rating}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleCall(hospital.phone)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
                      >
                        📞 Call {hospital.phone}
                      </button>
                      <button
                        onClick={() => handleDirections(hospital)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
                      >
                        🗺️ Get Directions
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Emergency Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mt-8"
        >
          <h3 className="text-xl font-semibold text-orange-800 mb-4">💡 Emergency Tips</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-orange-700">
            <div>
              <h4 className="font-semibold mb-2">Before Emergency:</h4>
              <ul className="space-y-1">
                <li>• Keep emergency contacts readily available</li>
                <li>• Know your medical history and allergies</li>
                <li>• Have insurance information accessible</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">During Emergency:</h4>
              <ul className="space-y-1">
                <li>• Stay calm and call 911 if life-threatening</li>
                <li>• Provide clear location information</li>
                <li>• Follow dispatcher instructions</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}