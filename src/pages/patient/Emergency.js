import React, { useEffect, useState } from "react";
import SidebarNav from "../../components/SidebarNav";
import { getHospitals } from "../../services/mockApi"; // or your real endpoint

export default function Emergency() {
  const [loc, setLoc] = useState(null);
  const [hosp, setHosp] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHospitals = () => {
    setLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLoc(pos.coords);
        const list = await getHospitals(pos.coords.latitude, pos.coords.longitude);
        setHosp(list);
        setLoading(false);
      },
      () => {
        setError("Location access denied. Please enable location to find nearby hospitals.");
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNav />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-semibold mb-4">Emergency Support</h2>
        {loading ? (
          <p>Locating nearest hospitals…</p>
        ) : error ? (
          <div className="mb-4">
            <p className="text-red-600 mb-2">{error}</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={fetchHospitals}
            >
              Retry Location Access
            </button>
          </div>
        ) : hosp.length === 0 ? (
          <p>No nearby hospitals found.</p>
        ) : (
          <ul className="space-y-4">
            {hosp.map((h, i) => (
              <li key={i} className="bg-white p-4 rounded-lg shadow">
                <p className="font-semibold">{h.name}</p>
                <p className="text-sm">{h.address}</p>
                <a href={`tel:${h.phone}`} className="text-red-600 underline">
                  Call {h.phone}
                </a>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
