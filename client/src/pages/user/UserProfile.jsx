import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import { jwtDecode } from "jwt-decode";
import toast from 'react-hot-toast';

const UserProfile = () => {
  const { axios, setUser, setUToken, navigate } = useAppContext();
  const [user, setUserLocal] = useState(null);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('uToken');
    if (!token) return;
    const { id } = jwtDecode(token);

    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('/api/user/get-profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (data.success) {
          setUserLocal(data.userData);
          setBlogs(data.userData.blogs || []);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchProfile();
  }, [axios]);

  const handleLogout = () => {
    localStorage.removeItem('uToken');
    localStorage.removeItem('token');
    setUser(null);
    setUToken(null);
    toast.success('Logged out successfully.');
    navigate('/');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-gray-400">Loading profile...</span>
      </div>
    );
  }

  const isActive = user.isSubscribed && (!user.subscriptionExpiry || new Date(user.subscriptionExpiry) > new Date());
  const expiryDate = user.subscriptionExpiry ? new Date(user.subscriptionExpiry).toLocaleDateString() : 'N/A';

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center gap-6 mb-6">
        <img
          src={assets.user_avatar || 'https://avatars.githubusercontent.com/u/1?v=4'}
          alt="User avatar"
          className="w-20 h-20 rounded-full border-2 border-primary object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-700">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
          <p className="mt-2 text-sm px-3 py-1 rounded-full bg-primary/10 text-primary inline-block font-semibold">
            {user.role === 'admin' ? 'Admin' : 'User'}
          </p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="mb-8 px-6 py-2 bg-primary text-white rounded-full font-semibold shadow hover:bg-primary/90 transition"
      >
        Logout
      </button>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Subscription Status</h3>
        <div className="flex items-center gap-3">
          <span className={`inline-block w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-400'}`}></span>
          <span className="font-medium">{isActive ? 'Active' : 'Not Subscribed'}</span>
          {isActive && (
            <span className="ml-4 text-gray-400 text-sm">Expiry: {expiryDate}</span>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Your Blogs</h3>
        {blogs.length === 0 ? (
          <div className="text-gray-400">You haven’t published any blogs yet.</div>
        ) : (
          <ul className="space-y-2">
            {blogs.map(blog => (
              <li key={blog._id} className="p-3 bg-blue-50/50 rounded hover:bg-blue-100 transition">
                <div className="font-semibold text-primary">{blog.title}</div>
                <div className="text-xs text-gray-500">{blog.category} &middot; {blog.isPublished ? 'Published' : 'Draft'}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
