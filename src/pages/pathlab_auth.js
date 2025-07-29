import React, { useState } from "react";

export default function PathLabAuth() {
  const [tab, setTab] = useState(0); // 0 = login, 1 = register
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    labId: '',
    password: '',
    name: '',
    email: '',
    regNo: '',
    phone: '',
  });
  const [message, setMessage] = useState("");

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleLogin = e => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setTimeout(() => {
      setLoading(false);
      setMessage("Login successful (demo only)");
    }, 800);
  };

  const handleRegister = e => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setTimeout(() => {
      setLoading(false);
      setMessage("Registration successful (demo only)");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex mb-6">
          {["Login", "Register"].map((label, i) => (
            <button
              key={i}
              onClick={() => { setTab(i); setMessage(""); }}
              className={`flex-1 py-2 text-center rounded-t-lg ${tab === i ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {label}
            </button>
          ))}
        </div>
        {message && <div className={`mb-4 text-center font-semibold ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>{message}</div>}
        {tab === 0 ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              name="labId"
              value={form.labId}
              onChange={handleChange}
              placeholder="Lab ID"
              className="w-full px-4 py-2 border rounded"
              required
            />
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? 'Logging in…' : 'Login'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Lab Name"
              className="w-full px-4 py-2 border rounded"
              required
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-2 border rounded"
              required
            />
            <input
              name="regNo"
              value={form.regNo}
              onChange={handleChange}
              placeholder="Registration No."
              className="w-full px-4 py-2 border rounded"
              required
            />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full px-4 py-2 border rounded"
              required
            />
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? 'Registering…' : 'Register'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 