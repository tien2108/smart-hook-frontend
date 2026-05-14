import { Plus, Home } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';
import DeviceCard from '../components/DeviceCard';
import AddDeviceModal from '../components/AddDeviceModal';
import ConfigurationPanel from '../components/ConfigurationPanel';

export default function Devices() {
	const [devices, setDevices] = useState([]);

	useEffect(() => {
		// Simulate fetching devices from an API
		const fetchDevices = async () => {
			const data = await apiFetch('/device/v1/devices');
			const json = await data.json();
			const device_list = json.devices;
			setDevices(device_list);
		};
		fetchDevices();
	}, []);

	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [configDevice, setConfigDevice] = useState(null);

	const handleAddDevice = async (name, uuid, location) => {
		const res = await apiFetch('/device/v1/add-device', {
			method: 'POST',
			body: JSON.stringify({ name, uuid, location }),
		});
		const newDevice = await res.json();
		setDevices((prev) => [...prev, newDevice]);
	};	

	const handleRemoveDevice = async (id) => {
		await apiFetch(`/device/v1/${id}`, {
			method: 'DELETE',
		});
		setDevices((prev) => prev.filter((d) => d.id !== id));
	};

	return (
		<div className="max-w-7xl mx-auto px-6 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">My Devices</h1>
				<p className="text-gray-600">Manage your SmartHook devices</p>
			</div>

			{/* Stats Overview */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<div className="bg-white rounded-xl p-6 shadow-md">
					<p className="text-sm text-gray-600 mb-1">Total Devices</p>
					<p className="text-3xl font-bold text-gray-900">{devices.length}</p>
				</div>
				<div className="bg-white rounded-xl p-6 shadow-md">
					<p className="text-sm text-gray-600 mb-1">Active Now</p>
					<p className="text-3xl font-bold text-green-600">
						{devices.filter((d) => d.status === 'online').length}
					</p>
				</div>
				<div className="bg-white rounded-xl p-6 shadow-md">
					<p className="text-sm text-gray-600 mb-1">Offline</p>
					<p className="text-3xl font-bold text-gray-400">
						{devices.filter((d) => d.status === 'offline').length}
					</p>
				</div>
			</div>

			{/* Add Device Button */}
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-2xl font-bold text-gray-900">Your Devices</h2>
				<button
					onClick={() => setIsAddModalOpen(true)}
					className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md">
					<Plus className="w-5 h-5" />
					Add Device
				</button>
			</div>

			{/* Devices Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{devices.map((device) => (
					<DeviceCard
						key={device.id}
						name={device.name}
						location={device.location}
						status={device.status}
						lastActive={device.lastActive}
						onRemove={() => handleRemoveDevice(device.id)}
						onConfigure={() => setConfigDevice(device)}
					/>
				))}
			</div>

			{/* Empty State */}
			{devices.length === 0 && (
				<div className="text-center py-16">
					<div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
						<Home className="w-10 h-10 text-gray-400" />
					</div>
					<h3 className="text-xl font-semibold text-gray-900 mb-2">
						No devices yet
					</h3>
					<p className="text-gray-600 mb-6">
						Add your first SmartHook to get started
					</p>
					<button
						onClick={() => setIsAddModalOpen(true)}
						className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
						<Plus className="w-5 h-5" />
						Add Device
					</button>
				</div>
			)}

			{/* Modals */}
			<AddDeviceModal
				isOpen={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				onAdd={handleAddDevice}
			/>

			<ConfigurationPanel
				isOpen={configDevice !== null}
				onClose={() => setConfigDevice(null)}
				device={configDevice|| {}}
			/>
		</div>
	);
}

