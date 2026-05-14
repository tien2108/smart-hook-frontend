import { Home, Smartphone, User, Settings, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
	const location = useLocation();
	const { logout } = useAuth();

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	const navItems = [
		{ path: '/', icon: Home, label: 'Overview' },
		{ path: '/devices', icon: Smartphone, label: 'Devices' },
		{ path: '/settings', icon: Settings, label: 'Settings' },
	];

	return (
		<nav className="bg-white shadow-sm border-b border-gray-200">
			<div className="max-w-7xl mx-auto px-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3 py-4">
						<div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
							<Home className="w-6 h-6 text-white" />
						</div>
						<div>
							<h1 className="text-xl font-bold text-gray-900">SmartHook</h1>
						</div>
					</div>

					<div className="flex gap-1">
						{navItems.map((item) => {
							const Icon = item.icon;
							const isActive = location.pathname === item.path;
							return (
								<Link
									key={item.path}
									to={item.path}
									className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
										isActive
											? 'bg-blue-50 text-blue-600 font-medium'
											: 'text-gray-600 hover:bg-gray-50'
									}`}>
									<Icon className="w-5 h-5" />
									<span className="hidden md:inline">{item.label}</span>
								</Link>
							);
						})}

						<div className="w-px h-6 bg-gray-200 mx-2" />

						<button
							onClick={handleLogout}
							className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-gray-600 hover:bg-red-50 hover:text-red-600">
							<LogOut className="w-5 h-5" />
							<span className="hidden md:inline">Log out</span>
						</button>
					</div>
				</div>
			</div>
		</nav>
	);
}
