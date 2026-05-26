// pages/ResetPassword.jsx
import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

export default function ResetPassword() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const token = searchParams.get('token');

	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [done, setDone] = useState(false);

	if (!token) {
		return (
			<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
				<div className="bg-white w-full max-w-md p-6 rounded-xl">
					<p className="text-red-500">Invalid or missing reset link.</p>
					<Link to="/login" className="text-blue-500 text-sm mt-2 block">
						Back to sign in
					</Link>
				</div>
			</div>
		);
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		if (password !== confirm) {
			setError('Passwords do not match');
			return;
		}
		if (password.length < 8) {
			setError('Password must be at least 8 characters');
			return;
		}

		setLoading(true);
		try {
			const res = await fetch(`${process.env.VITE_API_URL}/auth/reset-password`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token, password }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || 'Reset failed');
			setDone(true);
			setTimeout(() => navigate('/login'), 3000);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-white w-full max-w-md p-6 rounded-xl">
				<h2 className="text-xl font-bold mb-4">Set new password</h2>

				{done ? (
					<div>
						<p className="text-green-600 text-sm">
							Password reset! Redirecting you to sign in...
						</p>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-4">
						<input
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							type="password"
							placeholder="New password"
							required
							className="w-full border p-2 rounded"
						/>
						<input
							value={confirm}
							onChange={(e) => setConfirm(e.target.value)}
							type="password"
							placeholder="Confirm new password"
							required
							className="w-full border p-2 rounded"
						/>

						{error && <p className="text-red-500 text-sm">{error}</p>}

						<div className="flex justify-end">
							<button
								type="submit"
								disabled={loading}
								className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
								{loading ? 'Saving...' : 'Reset password'}
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}