import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import SubdomainTable from '@/components/subdomain-table';
import { ArrowRight } from 'lucide-react';
import { AuthContext } from '@/contexts/AuthContext';

export default function Home() {
  const { isAuthenticated, username, handleLoginRedirect, handleLogout } = useContext(AuthContext);
  const [subdomains, setSubdomains] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubdomains = async () => {
      try {
        const response = await fetch('https://behzod.pythonanywhere.com/api/subdomains/');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setSubdomains(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubdomains();
  }, []);

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Login/Logout Button */}
      <div className="absolute top-4 right-4 flex items-center space-x-4">
        {!isAuthenticated ? (
          <button
            onClick={handleLoginRedirect}
            className="bg-lime-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500"
          >
            Login
          </button>
        ) : (
          <>
            <span className="text-gray-700 text-sm">
                Hello,{' '}
                <Link
                    to="/profile"
                    className="text-blue-600 hover:underline font-medium"
                >
                    {username}
                </Link>!
                </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </>
        )}
      </div>

      {/* Page Content */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">Our Subdomains</h1>
        <p className="text-xl text-center text-gray-700">
          Review the existing subdomains of Dovuchcha and their respective purposes.{' '}
          {!isAuthenticated ? (
            <>
              If you want a subdomain for your personal or commercial project,{' '}
              <button
                onClick={handleLoginRedirect}
                className="text-blue-600 hover:underline text-lg font-medium"
              >
                Login to Order
              </button>
            </>
          ) : (
            <>
              If you want a subdomain for your personal or commercial project,{' '}
              <Link
                to="/order"
                className="inline-flex items-center text-blue-600 hover:underline text-lg font-medium"
              >
                Order New Subdomain <ArrowRight className="w-5 h-5 ml-1" aria-hidden="true" />
              </Link>
            </>
          )}
        </p>

        {/* Loading and Error States */}
        {isLoading ? (
          <p className="text-center text-gray-500">Loading subdomains...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : (
          <SubdomainTable subdomains={subdomains} />
        )}
      </div>
    </div>
  );
}