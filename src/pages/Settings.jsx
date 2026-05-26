import { Save, MapPin, Clock, Bell, Star, Trash } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/api';

export default function Profile() {
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [homeAddress, setHomeAddress] = useState('');
	const [destinationAddress, setDestinationAddress] = useState('');
	const [travelMode, setTravelMode] = useState('bus');
	const [departureTime, setDepartureTime] = useState('08:15');
	const [journeyNotifications, setJourneyNotifications] = useState(false);
	const [notifyMinutesBefore, setNotifyMinutesBefore] = useState(15);
	const [weatherAlerts, setWeatherAlerts] = useState(true);
	const [meteorAlerts, setMeteorAlerts] = useState(true);
	const [auroraAlerts, setAuroraAlerts] = useState(true);
	const [notificationMinutes, setNotificationMinutes] = useState(15);
	const [loading, setLoading] = useState(true);
	const [notifySaveStatus, setNotifySaveStatus] = useState('');

	const navigate = useNavigate();

	useEffect(() => {
		const fetchProfile = async () => {
			const res = await apiFetch('/user');
			const user = await res.json();
			setName(user.name);
			setHomeAddress(user.home_address);
			setDestinationAddress(user.dest_address);
			setTravelMode(user.travel_mode || 'bus-train-metro');
			setDepartureTime(user.departure_time);
			setJourneyNotifications(user.journey_notifications !== 0);
			setNotificationMinutes(user.notify_minutes_before ?? 15);
		};

		const fetchNotificationPrefs = async () => {
			try {
				const res = await apiFetch('/notifications/preferences');
				if (!res.ok) return;
				const prefs = await res.json();
				setJourneyNotifications(!!prefs.notify_enabled);
				setNotifyMinutesBefore(prefs.notify_minutes_before ?? 15);
			} catch (err) {
				console.error('Failed to load notification preferences', err);
			}
		};

		const fetchJourneyPrefs = async () => {
			try {
				const res = await apiFetch('/auth/me');
				if (!res.ok) return;
				const me = await res.json();
				if (me.departure_time) setDepartureTime(me.departure_time);
				if (me.travel_mode) setTravelMode(me.travel_mode);
			} catch (err) {
				console.error('Failed to load journey preferences', err);
			}
		};

		fetchProfile();
		fetchNotificationPrefs();
		fetchJourneyPrefs();
		setLoading(false);
	}, [loading]);

	const saveNotificationPrefs = async (overrides = {}) => {
		const body = {
			notify_enabled:
				overrides.notify_enabled !== undefined
					? overrides.notify_enabled
					: journeyNotifications,
			notify_minutes_before:
				overrides.notify_minutes_before !== undefined
					? overrides.notify_minutes_before
					: notifyMinutesBefore,
		};
		setNotifySaveStatus('Saving...');
		try {
			const res = await apiFetch('/notifications/preferences', {
				method: 'PATCH',
				body: JSON.stringify(body),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				setNotifySaveStatus(err.error || 'Failed to save');
				return;
			}
			setNotifySaveStatus('Saved');
			setTimeout(() => setNotifySaveStatus(''), 1500);
		} catch (err) {
			console.error('Error saving notification preferences', err);
			setNotifySaveStatus('Failed to save');
		}
	};

	const handleSave = async () => {
		try {
			const updates = {
				password,
				name,
				home_address: homeAddress,
				work_address: destinationAddress,
				travel_mode: travelMode,
				departure_time: departureTime,
				journey_notifications: journeyNotifications,
				departure_time: departureTime,
				notification_minutes: notificationMinutes,
			};
			console.log('Saving user settings', updates);
			const res = await apiFetch('/user', {
				method: 'POST',
				body: JSON.stringify(updates),
			});

			if (!res.ok) {
				console.error('Failed to save user settings', res.status);
			} else {
				console.log('User settings saved');
			}

			const journeyRes = await apiFetch('/auth/me', {
				method: 'PATCH',
				body: JSON.stringify({
					departure_time: departureTime,
					travel_mode: travelMode,
				}),
			});
			if (!journeyRes.ok) {
				const err = await journeyRes.json().catch(() => ({}));
				console.error('Failed to save journey preferences', err);
			}

			setLoading(true);
		} catch (error) {
			console.error('Error saving user settings', error);
		}
	};

	const handleDelete = async () => {
		console.log('Delete profile');
		try {
			const res = await apiFetch('/user', {
				method: 'DELETE',
			});

			if (!res.ok) {
				console.error('Failed to delete user', res.status);
				return;
			}

			console.log('User deleted');
			navigate('/login');
		} catch (error) {
			console.error('Error deleting user', error);
		}
	};

	return (
		<div className="max-w-4xl mx-auto px-6 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">User Profile</h1>
				<p className="text-gray-600">
					Manage your account, addresses, journey preferences, and notifications
				</p>
			</div>
			<div className="space-y-6">
				{/* Account Settings */}
				<div className="bg-white rounded-xl p-6 shadow-md">
					<div className="flex items-center gap-2 mb-4">
						<h2 className="text-xl font-semibold text-gray-900">
							Account Settings
						</h2>
					</div>

					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Name
							</label>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
								placeholder="Enter your name"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								New Password
							</label>
							<input
								type="text"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
								placeholder="Enter a new password"
							/>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-xl p-6 shadow-md">
					<div className="flex items-center gap-2 mb-4">
						<MapPin className="w-5 h-5 text-blue-600" />
						<h2 className="text-xl font-semibold text-gray-900">Addresses</h2>
					</div>

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
								placeholder="Enter your home address"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Destination Address (Work/School)
							</label>
							<input
								type="text"
								value={destinationAddress}
								onChange={(e) => setDestinationAddress(e.target.value)}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
								placeholder="Enter your destination address"
							/>
						</div>
					</div>
				</div>

				{/* Journey Preferences */}
				<div className="bg-white rounded-xl p-6 shadow-md">
					<div className="flex items-center gap-2 mb-4">
						<Clock className="w-5 h-5 text-blue-600" />
						<h2 className="text-xl font-semibold text-gray-900">
							Preferred Journey
						</h2>
					</div>

					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Departure Time
							</label>
							<input
								type="time"
								value={departureTime}
								onChange={(e) => setDepartureTime(e.target.value)}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Preferred Travel Mode
							</label>
							<select
								value={travelMode}
								onChange={(e) => setTravelMode(e.target.value)}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
								<option value="bus">Bus</option>
								<option value="train">Train</option>
								<option value="bus-train">Bus + Train</option>
								<option value="walk">Walk</option>
								<option value="bike">Bike</option>
								<option value="drive">Drive</option>
								<option value="metro">Metro</option>
								<option value="bus-metro">Bus + Metro</option>
								<option value="train-metro">Train + Metro</option>
								<option value="bus-train-metro">Bus + Train + Metro</option>
							</select>
						</div>

						<div className="bg-blue-50 rounded-lg p-4">
							<p className="text-sm text-gray-700">
								<span className="font-semibold">Estimated Journey Time:</span>{' '}
								28 minutes
							</p>
							<p className="text-sm text-gray-700 mt-1">
								<span className="font-semibold">Recommended Departure:</span>{' '}
								8:15 AM
							</p>
						</div>
					</div>
				</div>

				{/* Notification Preferences */}
				<div className="bg-white rounded-xl p-6 shadow-md">
					<div className="flex items-center gap-2 mb-4">
						<Bell className="w-5 h-5 text-blue-600" />
						<h2 className="text-xl font-semibold text-gray-900">
							Notifications
						</h2>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
							<div>
								<p className="font-medium text-gray-900">
									Journey Notifications
								</p>
								<p className="text-sm text-gray-600">
									Email me before I need to leave for the bus/metro
								</p>
							</div>
							<label className="relative inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									checked={journeyNotifications}
									onChange={(e) => {
										const next = e.target.checked;
										setJourneyNotifications(next);
										saveNotificationPrefs({ notify_enabled: next });
									}}
									className="sr-only peer"
								/>
								<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
							</label>
						</div>
						{journeyNotifications && (
							<div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
								<div>
									<p className="font-medium text-gray-900">Notification Time</p>
									<p className="text-sm text-gray-600">
										How many minutes before departure to notify you
									</p>
								</div>
								<input
									type="number"
									min="1"
									max="120"
									value={notificationMinutes}
									onChange={(e) =>
										setNotificationMinutes(Number(e.target.value))
									}
									className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-center font-medium"
								/>
								<span className="text-sm text-gray-600 ml-[-8px]">min</span>
							</div>
						)}
						<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
							<div>
								<p className="font-medium text-gray-900">Weather Alerts</p>
								<p className="text-sm text-gray-600">Severe weather warnings</p>
							</div>
							<label className="relative inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									checked={weatherAlerts}
									onChange={(e) => setWeatherAlerts(e.target.checked)}
									className="sr-only peer"
								/>
								<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
							</label>
						</div>
					</div>
				</div>

				{/* Fun Facts & Celestial Events */}
				<div className="bg-white rounded-xl p-6 shadow-md">
					<div className="flex items-center gap-2 mb-4">
						<Star className="w-5 h-5 text-purple-600" />
						<h2 className="text-xl font-semibold text-gray-900">
							Fun Facts & Celestial Events
						</h2>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
							<div>
								<p className="font-medium text-gray-900">
									Aurora (Northern Lights) Alerts
								</p>
								<p className="text-sm text-gray-600">
									Be notified when aurora activity is high in your area
								</p>
							</div>
							<label className="relative inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									checked={auroraAlerts}
									onChange={(e) => setAuroraAlerts(e.target.checked)}
									className="sr-only peer"
								/>
								<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
							</label>
						</div>
					</div>
				</div>

				{/* Save Button */}
				<div className="flex justify-between">
					<button
						onClick={handleDelete}
						className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-md">
						<Trash className="w-5 h-5" />
						Delete
					</button>
					<button
						onClick={handleSave}
						className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md">
						<Save className="w-5 h-5" />
						Save Changes
					</button>
				</div>
			</div>
		</div>
	);
}
