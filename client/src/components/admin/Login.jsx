import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { axios, setToken, setUToken } = useAppContext()
  const [email, setEmail] = useState('temporary@gmail.com');
  const [password, setPassword] = useState('BlogidityPassword@1');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        // Registration flow
        const { data } = await axios.post('/api/user/register', { name, email, password });
        if (data.success) {
          toast.success('Registration successful');
          setIsRegister(false);
          setName('');
          localStorage.removeItem('token');
          localStorage.setItem('uToken',data.token);
          setUToken(data.token);
          navigate('/user')
        } else {
          toast.error(data.message);
        }
        return;
      }
      // Login flow
      const endpoint = isAdmin ? '/api/admin/login' : '/api/user/login';
      const { data } = await axios.post(endpoint, { email, password });
      if (data.success) {
        setToken(data.token);
        if (isAdmin) {
          localStorage.removeItem('uToken');
          localStorage.setItem('token', data.token);
          setToken(data.token);
          navigate('/admin');
        } else {
          localStorage.removeItem('token');
          localStorage.setItem('uToken', data.token);
          setUToken(data.token);
          navigate('/user');
        }
        axios.defaults.headers.common['Authorization'] = data.token;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
useEffect(() => {
  if (isRegister) {
    setEmail('');
    setPassword('');
  } else if (isAdmin) {
    setEmail('admin@example.com');
    setPassword('greatstack');
  } else {
    setEmail('temporary@gmail.com');
    setPassword('BlogidityPassword@1');
  }
}, [isAdmin, isRegister]);

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg'>
        <div className='flex flex-col items-center justify-center '>
          <div className='w-full py-6 text-center'>
            <h1 className='text-3xl font-bold'>
              <span className='text-primary'>
                {isRegister ? "User" : (isAdmin ? "Admin" : "User")}
              </span> {isRegister ? "Register" : "Login"}
            </h1>
            <p className='font-light'>
              {isRegister
                ? 'Create a new user account'
                : `Enter your credentials to access the ${isAdmin ? "admin" : "user"} panel`}
            </p>
          </div>
          <form onSubmit={handleSubmit} className='mt-6 w-full sm:max-w-md text-gray-600'>
            {isRegister && (
              <div className='flex flex-col'>
                <label>Name</label>
                <input
                  onChange={e => setName(e.target.value)}
                  value={name}
                  type="text"
                  required
                  placeholder='Your name'
                  className='border-b-2 border-gray-300 p-2 outline-none mb-6'
                />
              </div>
            )}
            <div className='flex flex-col'>
              <label>Email</label>
              <input
                onChange={e => setEmail(e.target.value)}
                value={email}
                type="email"
                required
                placeholder='Your email id'
                className='border-b-2 border-gray-300 p-2 outline-none mb-6'
              />
            </div>
            <div className='flex flex-col'>
              <label>Password</label>
              <input
                onChange={e => setPassword(e.target.value)}
                value={password}
                type="password"
                required
                placeholder='Your password'
                className='border-b-2 border-gray-300 p-2 outline-none mb-6'
              />
            </div>
            <button
              type='submit'
              className='w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all'
            >
              {isRegister ? 'Register' : 'Login'}
            </button>
          </form>
          {!isRegister && (
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className='mt-4 text-sm text-primary underline cursor-pointer'
            >
              {isAdmin ? 'Switch to user Login' : 'Switch to admin login'}
            </button>
          )}
          {!isAdmin && (
            <button
              onClick={() => setIsRegister(!isRegister)}
              className='mt-2 text-xs text-primary underline cursor-pointer'
            >
              {isRegister ? 'Back to Login' : 'Register as new user'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login
