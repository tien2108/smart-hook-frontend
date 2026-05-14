import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';

export default function DeviceModal({ mode, device, onClose }) {
	const isEdit = mode === 'edit';

	const [name, setName] = useState('');
	const [uuid, setUuid] = useState('');
  const [location, setLocation] = useState('');

	useEffect(() => {
		if (isEdit && device) {
			setName(device.name);
			setUuid(device.uuid);
		}
	}, [device, isEdit]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (isEdit) {
			await apiFetch(`/device/v1/device/${device.id}`, {
				method: 'PUT',
				body: JSON.stringify({ name, uuid }),
			});
		} else {
			await apiFetch(`/device/v1/add-device`, {
				method: 'POST',
				body: JSON.stringify({ name, uuid }),
			});
		}

		onClose();
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-white w-full max-w-md p-6 rounded-xl">
				<h2 className="text-xl font-bold mb-4">
					{isEdit ? 'Edit Device' : 'Add Device'}
				</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Device name"
						className="w-full border p-2 rounded"
					/>

					<input
						value={uuid}
						onChange={(e) => setUuid(e.target.value)}
						placeholder="Device UUID"
						className="w-full border p-2 rounded"
					/>
          <input value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Device location"
            className="w-full border p-2 rounded" />

					<div className="flex justify-end gap-2">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 bg-gray-300 rounded">
							Cancel
						</button>

						<button
							type="submit"
							className="px-4 py-2 bg-blue-500 text-white rounded">
							{isEdit ? 'Save' : 'Add'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
