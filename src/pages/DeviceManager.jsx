import { useEffect, useState } from "react";

const DEVICE_API_URL =`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/device/v1`; // fallback if env var is missing

export default function DeviceManager() {

  const [devices, setDevices] = useState([]);
  const [uuid, setUuid] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchDevices = async () => {
    try {
      const res = await fetch(`${DEVICE_API_URL}/devices`);
      const data = await res.json();
      setDevices(data.devices || []);
    } catch (err) {
      console.error("Error fetching devices:", err);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const addDevice = async () => {
    if (!uuid || !name || !type) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${DEVICE_API_URL}/add-device`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uuid, name, type }),
      });

      const text = await res.text();
      const data = JSON.parse(text);

      if (!res.ok) throw new Error(data.message);

      setUuid("");
      setName("");
      setType("");
      fetchDevices();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteDevice = async (id) => {
    try {
      const res = await fetch(`${DEVICE_API_URL}/device/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      fetchDevices();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Device Manager</h1>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 rounded w-full"
          placeholder="UUID"
          value={uuid}
          onChange={(e) => setUuid(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full"
          placeholder="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 rounded"
          onClick={addDevice}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      <ul className="space-y-2">
        {devices.map((d) => (
          <li
            key={d.id}
            className="flex justify-between items-center border p-3 rounded"
          >
            <span>
              {d.name} ({d.type}) - {d.uuid} - <em>{d.status}</em>
            </span>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => deleteDevice(d.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
