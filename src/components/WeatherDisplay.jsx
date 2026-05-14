import { Cloud, Droplets, Wind, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';

export default function WeatherDisplay() {
	const today = new Date().toLocaleDateString('en-GB', {
		weekday: 'long',
		day: 'numeric',
		month: 'numeric',
		year: 'numeric',
	});

	// Output: "Monday, 11/05/2026"

	const [weather, setWeather] = useState({});

	useEffect(() => {
		// Simulate fetching weather data
		const fetchWeather = async () => {
			const res = await apiFetch('/data/weather');
			const data = await res.json();
			setWeather(data);
		};

		fetchWeather();
	}, []);

	return (
		<div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
			<div className="flex items-start justify-between mb-4">
				<div>
					<p className="text-sm opacity-90">{today}</p>
					<p className="text-5xl font-bold mt-2">{weather.temperature}°</p>
					<p className="text-lg mt-1">{weather.weather_description}</p>
				</div>
				<Sun className="w-16 h-16 opacity-90" />
			</div>

			<div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/20">
				<div className="flex items-center gap-2">
					<Droplets className="w-5 h-5" />
					<div>
						<p className="text-xs opacity-75">Humidity</p>
						<p className="font-semibold">{weather.humidity}%</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Wind className="w-5 h-5" />
					<div>
						<p className="text-xs opacity-75">Wind</p>
						<p className="font-semibold">{weather.wind_speed} km/h</p>
					</div>
				</div>
				<div>
					<p className="text-xs opacity-75">Feels Like</p>
					<p className="font-semibold">{weather.feels_like}°</p>
				</div>
			</div>
		</div>
	);
}
