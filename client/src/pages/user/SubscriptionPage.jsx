import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const SubscriptionPage = () => {
  const { axios } = useAppContext();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get token from localStorage
  const token = localStorage.getItem('uToken');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/user/get-profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (data.success) {
          setUser(data.userData);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [axios, token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <span className="text-gray-400 text-lg">Loading subscription status...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <span className="text-red-400 text-lg">User not found.</span>
      </div>
    );
  }

  const isActive = user.isSubscribed && (!user.subscriptionExpiry || new Date(user.subscriptionExpiry) > new Date());

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-green-50 via-white to-green-100">
      {isActive ? (
        <div className="flex flex-col items-center">
          {/* Animated green tick in a circular bg */}
          <div className="relative mb-8">
            <div className="w-28 h-28 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
              <svg
                className="w-16 h-16 text-green-500 animate-zoom"
                fill="none"
                stroke="currentColor"
                strokeWidth={5}
                viewBox="0 0 48 48"
              >
                <circle cx="24" cy="24" r="22" stroke="currentColor" strokeOpacity="0.15" />
                <path
                  d="M16 24l6 6 10-12"
                  stroke="currentColor"
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {/* Zoom-in/Zoom-out animation */}
            <style>
              {`
                @keyframes zoom {
                  0%, 100% { transform: scale(1);}
                  50% { transform: scale(1.15);}
                }
                .animate-zoom {
                  animation: zoom 1.4s infinite;
                }
              `}
            </style>
          </div>
          <h2 className="text-3xl font-bold text-green-700 mb-2">You’re Subscribed!</h2>
          <p className="text-lg text-gray-700 mb-4">
            Welcome, <span className="font-semibold text-green-600">{user.name}</span>.<br />
            Enjoy all premium content and features.
          </p>
          <div className="bg-green-50 px-6 py-3 rounded-full text-green-700 font-medium shadow">
            Thank you for supporting us!
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center mb-8">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" strokeWidth={4} viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="22" stroke="currentColor" strokeOpacity="0.12" />
              <path d="M16 24l6 6 10-12" stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No Active Subscription</h2>
          <p className="text-lg text-gray-500 mb-6">
            Hi, <span className="font-semibold">{user.name}</span>.<br />
            Subscribe now to unlock all premium blogs and features!
          </p>
          <button className="px-8 py-3 bg-green-500 text-white rounded-full font-semibold shadow-lg hover:bg-green-600 transition-all">
            Subscribe Now
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;
