// pages/ForgotPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

export default function ForgotPassword() {
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setMessage('');
		setLoading(true);

		try {
			const res = await fetch(`${API}/auth/forgot-password`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Request failed');
			setMessage(
				data.message ||
					'If an account exists for that email, a reset link has been sent.',
			);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-white w-full max-w-md p-6 rounded-xl">
				<h2 className="text-xl font-bold mb-2">Forgot Password</h2>
				<p className="text-sm text-gray-600 mb-4">
					Enter your email and we'll send you a link to reset your password.
				</p>

				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						type="email"
						placeholder="Email"
						required
						className="w-full border p-2 rounded"
					/>

					{error && <p className="text-red-500 text-sm">{error}</p>}
					{message && <p className="text-green-600 text-sm">{message}</p>}

					<div className="flex justify-end gap-2">
						<Link to="/login" className="px-4 py-2 bg-gray-300 rounded">
							Back to Sign In
						</Link>
						<button
							type="submit"
							disabled={loading}
							className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
							{loading ? 'Sending...' : 'Send Reset Link'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
