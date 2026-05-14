import Header from '../components/Header';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
	return (
		<div className="app">
			<Header />
			<main className="page-content">
				<Outlet /> {/* 👈 active page renders here */}
			</main>
		</div>
	);
}
