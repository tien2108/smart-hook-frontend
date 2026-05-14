import { Bus, Clock, MapPin } from 'lucide-react';

export default function TransitDisplay() {
	const routes = [
		{
			number: '42',
			destination: 'Downtown',
			time: '5 min',
			color: 'bg-green-500',
		},
		{
			number: '18',
			destination: 'University',
			time: '12 min',
			color: 'bg-blue-500',
		},
		{
			number: '7',
			destination: 'Airport',
			time: '18 min',
			color: 'bg-orange-500',
		},
	];

	return (
		<div className="bg-white rounded-2xl p-6 shadow-xl">
			<div className="flex items-center gap-2 mb-4">
				<Bus className="w-6 h-6 text-gray-700" />
				<h3 className="text-xl font-semibold text-gray-900">Next Buses</h3>
			</div>

			<div className="space-y-3">
				{routes.map((route, index) => (
					<div
						key={index}
						className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
						<div className="flex items-center gap-3">
							<div
								className={`${route.color} text-white font-bold rounded-lg px-3 py-2 text-sm min-w-[50px] text-center`}>
								{route.number}
							</div>
							<div>
								<p className="font-medium text-gray-900">{route.destination}</p>
								<div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
									<MapPin className="w-3 h-3" />
									<span>Main & 5th St</span>
								</div>
							</div>
						</div>
						<div className="flex items-center gap-1 text-green-600 font-semibold">
							<Clock className="w-4 h-4" />
							<span>{route.time}</span>
						</div>
					</div>
				))}
			</div>

			<div className="mt-4 pt-4 border-t border-gray-200">
				<p className="text-sm text-gray-600">
					<span className="font-semibold">Journey time to work:</span> 28 min
				</p>
			</div>
		</div>
	);
}
