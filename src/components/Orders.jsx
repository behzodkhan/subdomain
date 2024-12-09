import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { AuthContext } from '@/contexts/AuthContext';
import { Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";

export function OrderForm() {
  const [subdomain, setSubdomain] = useState('');
  const [subdomains, setSubdomains] = useState([]);
  const [purpose, setPurpose] = useState('');
  const { toast } = useToast();
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
  const { email, id } = useContext(AuthContext);

  const [isSubmitting, setIsSubmitting] = useState(false);


  const doesExist = subdomains.some((s) => {
    const existingSubdomain = s.name.split('.')[0].toLowerCase();
    return existingSubdomain === subdomain.toLowerCase();
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name: subdomain,
      user: id,
      purpose,
      status: 'pending',
    };

    try {
      const response = await fetch('https://behzod.pythonanywhere.com/api/subdomains/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create subdomain.');
      }

      const data = await response.json();

      // Redirect to home after successful submission
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* Header with Back Link */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="text-lime-600 hover:underline text-sm font-medium">
          &larr; Back to Home
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Order New Subdomain</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="subdomain">Subdomain</Label>
          <div className="flex space-x-2">
            <Input
              id="subdomain"
              placeholder="e.g., blog, shop, support"
              onChange={(e) => setSubdomain(e.target.value)}
              value={subdomain}
              required
              className="flex-1"
            />
            <Input
              type="text"
              value=".dovuchcha.uz"
              disabled
              className="w-[150px] bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>
          {doesExist && (
            <p className="text-red-600 text-sm">
              This subdomain already exists. Please choose another one.
            </p>
          )}
        </div>

        {/* Email Field with Tooltip */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-gray-100 text-gray-500 cursor-not-allowed w-full"
              />
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-gray-800 text-white text-sm px-3 py-2 rounded-md shadow-md">
              You cannot change your email here. To update it, visit your Dovuchcha Account Center: <a href="https://accounts.dovuchcha.uz" className="text-blue-400 hover:underline">accounts.dovuchcha.uz</a>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="space-y-2">
          <Label htmlFor="purpose">Purpose</Label>
          <Textarea
            id="purpose"
            placeholder="Describe the purpose of this subdomain"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
          />
        </div>
        <Button 
          type="submit" 
          className="w-full"
          disabled={doesExist || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Order'}
        </Button>
      </form>

      {/* Terms and Conditions */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Terms and Conditions</h3>
        <ul className="list-disc pl-5 text-sm text-gray-600 mt-2 space-y-1">
          <li>Subdomains must adhere to company policies and guidelines.</li>
          <li>Requests for offensive or inappropriate subdomains will be rejected.</li>
          <li>Subdomains are allocated on a first-come, first-served basis.</li>
          <li>Each request will be reviewed and approved by the administrative team.</li>
          <li>Maintenance and updates of subdomains are the responsibility of the requester.</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mt-4">Rules for Subdomain Requests</h3>
        <ul className="list-disc pl-5 text-sm text-gray-600 mt-2 space-y-1">
          <li>Provide a clear and concise purpose for the requested subdomain.</li>
          <li>Ensure the subdomain aligns with organizational objectives.</li>
          <li>Duplicate or redundant subdomains will not be approved.</li>
          <li>Requests must be submitted through the official form.</li>
          <li>Violation of terms may result in suspension or removal of the subdomain.</li>
        </ul>
      </div>
    </div>
  );
}

export default OrderForm;