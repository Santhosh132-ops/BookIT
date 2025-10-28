// frontend/src/App.tsx
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DetailsPage from './pages/DetailsPage';
import CheckoutPage from './pages/CheckoutPage';
import ResultPage from './pages/ResultPage';

// A simple container for the main layout
const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-100 font-sans">
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-indigo-700">BookIt: Experiences</h1>
      </div>
    </header>
    <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
      {children}
    </main>
  </div>
);

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* The :id parameter allows us to load specific experience data */}
        <Route path="/experiences/:id" element={<DetailsPage />} /> 
        <Route path="/checkout" element={<CheckoutPage />} />
        {/* The ResultPage will likely receive state via routing, e.g., /result?status=success */}
        <Route path="/result" element={<ResultPage />} /> 
        <Route path="*" element={<div className="text-xl text-center">404: Page Not Found</div>} />
      </Routes>
    </Layout>
  );
}

export default App;