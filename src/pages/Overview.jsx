import {
	Clock,
	MapPin,
	Zap,
	Star,
	Bus,
	CloudSun,
	Footprints,
	Train,
	TramFront,
	Ship,
	Bike,
	Car,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';
import WeatherDisplay from '../components/WeatherDisplay';
import TransitDisplay from '../components/TransitDisplay';

export default function Overview() {
	// use API data for this in the future
	const [recentActivity, setRecentActivity] = useState([]);

	// use API data for this in the future
	const [upcomingJourney, setUpcomingJourney] = useState({});

	const [deviceStats, setDeviceStats] = useState();
	const [weather, setWeather] = useState({});

	useEffect(() => {
		// Simulate fetching recent activity
		const fetchActivity = async () => {
			const res = await apiFetch('/data/activity');
			const data = await res.json();
			setRecentActivity(data);
		};

		// Simulate fetching upcoming journey
		const fetchJourney = async () => {
			// This will eventually come from the API, but for now we can hardcode it
			const res = await apiFetch('/data/travel');
			const data = await res.json();
			setUpcomingJourney(data);
		};

		// Simulate fetching weather data
		const fetchWeather = async () => {
			const res = await apiFetch('/data/weather');
			const data = await res.json();
			setWeather(data);
		};

		const fetchDeviceStats = async () => {
			const res = await apiFetch('/device/v1/devices');
			const json = await res.json();
			const devices = json.devices;
			const activeDeviceNum = devices.filter(
				(d) => d.status === 'online',
			).length;
			setDeviceStats(activeDeviceNum);
		};

		fetchDeviceStats();
		fetchActivity();
		fetchJourney();
		fetchWeather();
	}, []);

	return (
		<div className="max-w-7xl mx-auto px-6 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Good Morning!</h1>
				<p className="text-gray-600">
					Here's your overview for Wednesday, May 6
				</p>
			</div>

			{/* Main Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				{/* Weather - Large */}
				<div className="lg:col-span-1">
					<WeatherDisplay weather={weather} />
				</div>

				{/* Upcoming Journey */}
				<div className="lg:col-span-1">
					<div className="bg-white rounded-2xl p-6 shadow-xl h-full">
						<div className="flex items-center gap-2 mb-4">
							<MapPin className="w-6 h-6 text-blue-600" />
							<h3 className="text-xl font-semibold text-gray-900">
								Your Journey
							</h3>
						</div>

						<div className="space-y-4">
							<div>
								<p className="text-sm text-gray-600">To</p>
								<p className="font-semibold text-gray-900">
									{upcomingJourney.destination}
								</p>
							</div>

							<div className="flex items-center gap-4 py-3 px-4 bg-blue-50 rounded-lg">
								<Clock className="w-5 h-5 text-blue-600" />
								<div>
									<p className="text-sm text-gray-600">Leave by</p>
									<p className="font-bold text-blue-600 text-xl">
										{new Date(upcomingJourney.leaveHouseAt).toLocaleTimeString(
											'fi-FI',
											{
												hour: '2-digit',
												minute: '2-digit',
												timeZone: 'Europe/Helsinki',
											},
										)}
									</p>
								</div>
							</div>

							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">Mode</span>
									<span className="font-medium text-gray-900">
										{upcomingJourney.line}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">Bus #</span>
									<span className="font-medium text-gray-900">
										{upcomingJourney.mode}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">Duration</span>
									<span className="font-medium text-gray-900">
										{upcomingJourney.durationMinutes} minutes
									</span>
								</div>
							</div>

							{upcomingJourney.legs?.length > 0 && (
								<div className="pt-4 mt-2 border-t border-gray-100">
									<p className="text-sm font-semibold text-gray-700 mb-3">
										Itinerary
									</p>
									<ol className="space-y-2">
										{upcomingJourney.legs.map((leg, i) => (
											<JourneyLeg key={i} leg={leg} />
										))}
									</ol>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Secondary Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Quick Stats */}
				<div className="bg-white rounded-xl p-6 shadow-md">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						Quick Stats
					</h3>
					<div className="grid grid-cols-2 gap-4">
						<div className="bg-green-50 rounded-lg p-4">
							<Zap className="w-6 h-6 text-green-600 mb-2" />
							<p className="text-2xl font-bold text-gray-900">{deviceStats}</p>
							<p className="text-sm text-gray-600">Active Devices</p>
						</div>
						<div className="bg-purple-50 rounded-lg p-4">
							<Star className="w-6 h-6 text-purple-600 mb-2" />
							<p className="text-2xl font-bold text-gray-900">12</p>
							<p className="text-sm text-gray-600">Uses Today</p>
						</div>
						<div className="bg-blue-50 rounded-lg p-4">
							<Bus className="w-6 h-6 text-blue-600 mb-2" />
							<p className="text-2xl font-bold text-gray-900">5 min</p>
							<p className="text-sm text-gray-600">Next Bus</p>
						</div>
						<div className="bg-orange-50 rounded-lg p-4">
							<CloudSun className="w-6 h-6 text-orange-600 mb-2" />
							<p className="text-2xl font-bold text-gray-900">
								{weather.temperature}°
							</p>
							<p className="text-sm text-gray-600">Temperature</p>
						</div>
					</div>
				</div>

				{/* Recent Activity */}
				<div className="bg-white rounded-xl p-6 shadow-md">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						Recent Activity
					</h3>
					<div className="space-y-3">
						{recentActivity.map((activity, index) => (
							<div
								key={index}
								className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
								<div>
									<p className="font-medium text-gray-900">
										{activity.device_name}
									</p>
									<p className="text-sm text-gray-600">{activity.action}</p>
								</div>
								<span className="text-sm text-gray-500">{activity.time}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

const MODE_META = {
	WALK: { Icon: Footprints, label: 'Walk' },
	BUS: { Icon: Bus, label: 'bus' },
	RAIL: { Icon: Train, label: 'train' },
	SUBWAY: { Icon: Train, label: 'metro' },
	TRAM: { Icon: TramFront, label: 'tram' },
	FERRY: { Icon: Ship, label: 'ferry' },
	BICYCLE: { Icon: Bike, label: 'bike' },
	CAR: { Icon: Car, label: 'drive' },
};

function JourneyLeg({ leg }) {
	const meta = MODE_META[leg.mode] || { Icon: MapPin, label: leg.mode };
	const Icon = meta.Icon;
	const dest = leg.to && leg.to !== 'Destination' ? leg.to : 'destination';

	const description =
		leg.mode === 'WALK'
			? `Walk to ${dest}`
			: `Take ${leg.line ? `${leg.line} ` : ''}${meta.label} to ${dest}`;

	return (
		<li className="flex items-start gap-3">
			<Icon className="w-4 h-4 mt-0.5 text-blue-600 shrink-0" />
			<div className="flex-1 text-sm">
				<p className="text-gray-900">{description}</p>
				{leg.durationMinutes > 0 && (
					<p className="text-xs text-gray-500">{leg.durationMinutes} min</p>
				)}
			</div>
		</li>
	);
}
