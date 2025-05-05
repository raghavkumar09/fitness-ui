import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import FitnessPlansPage from './pages/FitnessPlansPage';
import AssignPlanPage from './pages/AssignPlanPage';

const App: React.FC = () => {

  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    setUserRole(storedRole);
  }, []);

  const handleLoginSuccess = (role: string) => {
    setUserRole(role);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('userRole');
    setUserRole(null);
    navigate('/');
  };

  const isAuthenticated = !!userRole;
  const isCoach = userRole === 'coach';

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        <nav className="bg-gray-800 p-4 text-white shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/fitness-plans" className="text-xl font-bold">EnrichMe Fitness</Link>
            <div>
              {isAuthenticated ? (
                <>
                  <Link to="/fitness-plans" className="mr-4 hover:text-gray-300">Plans</Link>
                  {isCoach && (
                    <Link to="/assign-plan" className="mr-4 hover:text-gray-300">Assign Plan</Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="hover:text-gray-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/" className="hover:text-gray-300">Login</Link>
              )}
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/"
            element={isAuthenticated ? <Navigate to="/fitness-plans" replace /> : <LoginPage onLoginSuccess={handleLoginSuccess} />} />

          {/* Protected routes: Require authentication */}
          <Route path="/fitness-plans" element={isAuthenticated ? <FitnessPlansPage /> : <Navigate to="/" replace />} />

          {/* Protected route for coaches: Require authentication and coach role */}
          <Route path="/assign-plan" element={isCoach ? <AssignPlanPage /> : (isAuthenticated ? <Navigate to="/fitness-plans" replace /> : <Navigate to="/" replace />)} />


          {/* Redirect unknown paths */}
          <Route path="*" element={isAuthenticated ? <Navigate to="/fitness-plans" replace /> : <Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
};

export default App;