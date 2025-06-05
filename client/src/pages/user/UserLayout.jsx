import React from 'react'
import { assets } from '../../assets/assets'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const UserSidebar = ({ navigate }) => (
  <div className='w-64 bg-white border-r border-gray-200 flex flex-col py-8 px-4'>
    
    <button className='mb-4 text-left font-semibold text-gray-700 hover:text-primary' onClick={() => navigate('/user')}>
      Profile
    </button>
    <button className='mb-4 text-left font-semibold text-gray-700 hover:text-primary' onClick={() => navigate('/user/subscription')}>
      Subscription
    </button>
    <button className='mb-4 text-left font-semibold text-gray-700 hover:text-primary' onClick={()=> navigate('/user/comments')} >
      Comments
    </button>
  </div>
);

const UserLayout = () => {
  const { axios, setToken, navigate } = useAppContext();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('utoken');
    axios.defaults.headers.common['Authorization'] = null;
    setToken(null);
    window.location.reload();
    navigate('/');
  };

  return (
    <>
      <div className='flex items-center justify-between py-2 h-[70px] px-4 sm:px-12 border-b border-gray-200'>
        <img src={assets.logo} alt="" className='w-32 sm:w-40 cursor-pointer' onClick={() => navigate('/')} />
        <button onClick={logout} className='text-sm px-8 py-2 bg-primary text-white rounded-full cursor-pointer'>Logout</button>
      </div>
      <div className='flex h-[calc(100vh-70px)]'>
        <UserSidebar navigate={navigate} />
        <div className='flex-1 bg-blue-50/50 p-4 overflow-y-auto'>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default UserLayout;
