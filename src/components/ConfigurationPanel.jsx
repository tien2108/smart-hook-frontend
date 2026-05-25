import { X, Cloud, Bus, Calendar, Mail, Music, Sun } from 'lucide-react';
import { useState } from 'react';
import { apiFetch } from '../lib/api';

export default function ConfigurationPanel({ isOpen, onClose, device }) {
	if (!isOpen) return null;
	console.log('Configuring device:', device);
	const [homeAddress, setHomeAddress] = useState(device.origin);
	const [workAddress, setWorkAddress] = useState(device.dest);
	const [preferMode, setPreferMode] = useState(device.preferMode || 'bus-train-metro');
	const handleUpdateSettings = async () => {
		// Implement API call to update device settings here
		// get values from form inputs and send to backend
		console.log('Updated settings:', { homeAddress, transitStop: workAddress });
		const res = await apiFetch(`/device/v1/${device.id}`, {
			method: 'POST',
			body: JSON.stringify({
				name: device.name,
				deviceLocation: homeAddress,
				destLocation: workAddress,
				preferMode: preferMode,
			}),
		});
		if (res.ok) {
			setHomeAddress(homeAddress);
			setWorkAddress(workAddress);
			onClose();
		}
	};

	return (
		<div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
				<div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
					<div>
						<h2 className="text-2xl font-bold text-gray-900">{device.name}</h2>
						<p className="text-gray-600">Configure display and settings</p>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
						<X className="w-5 h-5 text-gray-600" />
					</button>
				</div>

				<div className="p-6">
					{/* Location Settings */}
					<div className="mb-8">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Location & Transit
						</h3>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Home Address
								</label>
								<input
									type="text"
									value={homeAddress}
									onChange={(e) => setHomeAddress(e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Nearest Transit Stop
								</label>
								<input
									type="text"
									value={workAddress}
									onChange={(e) => setWorkAddress(e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Preferred Travel Mode
								</label>
								<select
									value={preferMode}
									onChange={(e) => setPreferMode(e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
									<option value="bus-train-metro">Bus + Train + Metro</option>
									<option value="bus">Bus</option>
									<option value="train">Train</option>
									<option value="bus-train">Bus + Train</option>
									<option value="walk">Walk</option>
									<option value="bike">Bike</option>
									<option value="drive">Drive</option>
									<option value="metro">Metro</option>
									<option value="bus-metro">Bus + Metro</option>
									<option value="train-metro">Train + Metro</option>
								</select>
							</div>
						</div>
					</div>

					{/* Save Button */}
					<div className="flex gap-3">
						<button
							onClick={onClose}
							className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
							Cancel
						</button>
						<button
							onClick={handleUpdateSettings}
							className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
							Save Changes
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
