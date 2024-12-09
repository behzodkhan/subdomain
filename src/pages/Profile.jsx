import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthContext';
import { MailIcon, UserIcon, ExternalLinkIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Profile() {
  const { username, email, id, isAuthenticated, handleLogout } = useContext(AuthContext);
  const [subdomains, setSubdomains] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // React Router hook for navigation

  useEffect(() => {
    // Redirect to home page if user is not authenticated
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    const fetchUserSubdomains = async () => {
      try {
        const response = await fetch(`https://behzod.pythonanywhere.com/api/subdomains/users/${id}/`);
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

    fetchUserSubdomains();
  }, [id, isAuthenticated, navigate]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'inactive':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <div>
          <div>
            <Link to="/" className="text-blue-600 hover:underline font-medium text-sm">
              &larr; Back to Home
            </Link>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2 text-sm">Review your subdomains</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-5 py-2 rounded-lg shadow-md font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
        >
          Logout
        </button>
      </header>

      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">User Information</h2>
          <div className="space-y-6">
            {/* Username Field */}
            <div className="space-y-1">
              <Label htmlFor="username" className="flex items-center text-sm font-medium text-gray-700 space-x-2">
                <UserIcon className="h-5 w-5 text-blue-500" />
                <span>Username</span>
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                disabled
                className="bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <Label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700 space-x-2">
                <MailIcon className="h-5 w-5 text-blue-500" />
                <span>Email</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Note Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-lg flex items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Important Information</h2>
            <p className="text-sm text-gray-600 mb-4">
              You cannot change your username or email from this page. To update your account information, please visit the{' '}
              <a
                href="https://accounts.dovuchcha.uz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-medium hover:underline inline-flex items-center"
              >
                Dovuchcha Account Center <ExternalLinkIcon className="w-4 h-4 ml-1" />
              </a>
              .
            </p>
            <p className="text-sm text-gray-600">
              For further assistance, contact our support team.
            </p>
          </div>
        </div>
      </section>

      {/* Subdomains */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Subdomains</h2>
        {isLoading ? (
          <p className="text-gray-500 text-center">Loading your subdomains...</p>
        ) : error ? (
          <p className="text-red-500 text-center">Error: {error}</p>
        ) : subdomains.length > 0 ? (
          <div className="overflow-hidden bg-white shadow-lg rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Subdomain</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subdomains.map((subdomain) => (
                  <tr key={subdomain.id}>
                    <td className="px-6 py-4 text-gray-800 font-medium">
                      <a
                        href={`https://${subdomain.name}.dovuchcha.uz`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {subdomain.name}.dovuchcha.uz
                      </a>
                    </td>
                    <td className={`px-6 py-4 text-sm rounded-md font-medium ${getStatusColor(subdomain.status)}`}>
                      {subdomain.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center">You have not created any subdomains yet.</p>
        )}
      </section>
    </div>
  );
}