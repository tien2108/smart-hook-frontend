// pages/ResetPassword.jsx
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

export default function ResetPassword() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const token = searchParams.get('token') || '';

	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [done, setDone] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		if (!token) {
			setError('Missing reset token. Use the link from your email.');
			return;
		}
		if (password.length < 8) {
			setError('Password must be at least 8 characters.');
			return;
		}
		if (password !== confirm) {
			setError('Passwords do not match.');
			return;
		}

		setLoading(true);
		try {
			const res = await fetch(`${API}/auth/reset-password`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token, password }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Reset failed');
			setDone(true);
			setTimeout(() => navigate('/login'), 1500);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-white w-full max-w-md p-6 rounded-xl">
				<h2 className="text-xl font-bold mb-4">Reset Password</h2>

				{done ? (
					<div>
						<p className="text-green-600 mb-4">
							Password reset successful. Redirecting to sign in...
						</p>
						<Link to="/login" className="px-4 py-2 bg-blue-500 text-white rounded">
							Sign In
						</Link>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-4">
						<input
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							type="password"
							placeholder="New Password"
							required
							className="w-full border p-2 rounded"
						/>
						<input
							value={confirm}
							onChange={(e) => setConfirm(e.target.value)}
							type="password"
							placeholder="Confirm New Password"
							required
							className="w-full border p-2 rounded"
						/>

						{error && <p className="text-red-500 text-sm">{error}</p>}

						<div className="flex justify-end gap-2">
							<Link to="/login" className="px-4 py-2 bg-gray-300 rounded">
								Cancel
							</Link>
							<button
								type="submit"
								disabled={loading}
								className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
								{loading ? 'Resetting...' : 'Reset Password'}
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}
