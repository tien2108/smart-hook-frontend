import { X, Wifi } from 'lucide-react';
import { useState } from 'react';

export default function AddDeviceModal({ isOpen, onClose, onAdd }) {
	const [name, setName] = useState('');
	const [deviceLocation, setDeviceLocation] = useState('');
	const [destLocation, setDestLocation] = useState('');
	const [UUID, setUUID] = useState('');
	const [mode, setMode] = useState('');
	const [step, setStep] = useState(1);

	if (!isOpen) return null;

	const handleSubmit = (e) => {
		e.preventDefault();
		if (name && deviceLocation && UUID) {
			onAdd(name, UUID, deviceLocation, mode);
			setName('');
			setDeviceLocation('');
			setUUID('');
			setMode('');
			setStep(1);
			onClose();
		}
	};

	return (
		<div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl max-w-md w-full p-6">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-2xl font-bold text-gray-900">Add New Device</h2>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
						<X className="w-5 h-5 text-gray-600" />
					</button>
				</div>

				<form onSubmit={handleSubmit}>
					<div className="space-y-4 mb-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Device Name
							</label>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="e.g., Entryway Hook"
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								UUID
							</label>
							<input
								type="text"
								value={UUID}
								onChange={(e) => setUUID(e.target.value)}
								placeholder="UUID"
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Device Location
							</label>
							<input
								type="text"
								value={deviceLocation}
								onChange={(e) => setDeviceLocation(e.target.value)}
								placeholder="e.g., Front Door"
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Preferred Travel Mode
							</label>
							<select
								value={mode}
								onChange={(e) => setMode(e.target.value)}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
								<option value="bus">Bus</option>
								<option value="train">Train</option>
								<option value="bus-train">Bus + Train</option>
								<option value="walk">Walk</option>
								<option value="bike">Bike</option>
								<option value="drive">Drive</option>
							</select>
						</div>
					</div>

					<div className="flex gap-3">
						<button
							type="button"
							onClick={() => setStep(1)}
							className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
							Back
						</button>
						<button
							type="submit"
							className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
							Add Device
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
