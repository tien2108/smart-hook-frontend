// pages/Login.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		try {
			await login(email, password);
			navigate('/');
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-white w-full max-w-md p-6 rounded-xl">
				<h2 className="text-xl font-bold mb-4">Sign In</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						type="email"
						placeholder="Email"
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
			</div>
		</div>
	);
}
