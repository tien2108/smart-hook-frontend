import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [showForgot, setShowForgot] = useState(false);

	const [resetEmail, setResetEmail] = useState('');
	const [resetStatus, setResetStatus] = useState('');
	const [resetLoading, setResetLoading] = useState(false);
	const [resetError, setResetError] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);
		try {
			await login(username, password);
			navigate('/');
		} catch (err) {
			setError(err.message);
			setShowForgot(true);
		} finally {
			setLoading(false);
		}
	};

	const handleResetPassword = async (e) => {
		e.preventDefault();
		setResetError('');
		setResetLoading(true);
		try {
			const res = await fetch(`${process.env.VITE_API_URL}/api/auth/forgot-password`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: resetEmail }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || 'Request failed');
			setResetStatus('sent');
		} catch (err) {
			setResetError(err.message);
		} finally {
			setResetLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-white w-full max-w-md p-6 rounded-xl">
				<h2 className="text-xl font-bold mb-4">Sign In</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						type="text"
						placeholder="Email or Username"
						required
						className="w-full border p-2 rounded"
					/>
					<input
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						type="password"
						placeholder="Password"
						required
						className="w-full border p-2 rounded"
					/>

					{error && <p className="text-red-500 text-sm">{error}</p>}

					<div className="flex justify-end gap-2">
						<Link to="/register" className="px-4 py-2 bg-gray-300 rounded">
							Register
						</Link>
						<button
							type="submit"
							disabled={loading}
							className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
							{loading ? 'Signing in...' : 'Sign In'}
						</button>
					</div>
				</form>

				{showForgot && (
					<div className="mt-4 pt-4 border-t">
						{resetStatus === 'sent' ? (
							<p className="text-sm text-green-600">
								Check your inbox — we sent a reset link to{' '}
								<strong>{resetEmail}</strong>.
							</p>
						) : (
							<>
								<p className="text-sm text-gray-500 mb-2">
									Forgot your password?
								</p>
								<form onSubmit={handleResetPassword} className="flex gap-2">
									<input
										value={resetEmail}
										onChange={(e) => setResetEmail(e.target.value)}
										type="email"
										placeholder="Your email"
										required
										className="flex-1 border p-2 rounded text-sm"
									/>
									<button
										type="submit"
										disabled={resetLoading}
										className="px-3 py-2 bg-gray-700 text-white text-sm rounded disabled:opacity-50">
										{resetLoading ? 'Sending...' : 'Send reset link'}
									</button>
								</form>
								{resetError && (
									<p className="text-red-500 text-xs mt-1">{resetError}</p>
								)}
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
}