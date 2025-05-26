import React from 'react';
import { OrderTracker } from '../components/OrderTracker';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const OrderTrackingPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black-900">
        <div className="p-6 bg-white rounded shadow text-center">
          <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
          <p className="mb-4">You must be logged in to track your order.</p>
          <Link to="/auth" className="text-blue-600 underline">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black-900">
      <OrderTracker />
    </div>
  );
};

export default OrderTrackingPage;