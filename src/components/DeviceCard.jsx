import { MoreVertical, Power, Settings, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function DeviceCard({
	name,
	location,
	status,
	lastActive,
	onRemove,
	onConfigure,
}) {
	const [showMenu, setShowMenu] = useState(false);

	return (
		<div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow relative">
			<div className="flex items-start justify-between mb-4">
				<div className="flex items-center gap-3">
					<div
						className={`w-3 h-3 rounded-full ${status === 'online' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
					<div>
						<h3 className="font-semibold text-gray-900">{name}</h3>
						<p className="text-sm text-gray-500">{location}</p>
					</div>
				</div>
			</div>

			<div className="space-y-2 text-sm">
				<div className="flex justify-between">
					<span className="text-gray-600">Status</span>
					<span
						className={`font-medium ${status === 'online' ? 'text-green-600' : 'text-gray-400'}`}>
						{status === 'online' ? 'Online' : 'Offline'}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="text-gray-600">Last Active</span>
					<span className="text-gray-900">{lastActive}</span>
				</div>
			</div>

			<div className="flex items-center justify-end gap-2 mt-4">
				<button
					onClick={onConfigure}
					className="mt-4 w-full bg-blue-50 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors">
					Configure
				</button>
        <button
          onClick={onRemove}
          className="mt-4 w-full bg-red-50 text-red-600 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors">
          Remove Device
        </button>
			</div>
		</div>
	);
}
