import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchFromApi } from '../utils/fetchFromApi';
import {Input, OAuth} from '../components';
import { useDispatch } from 'react-redux';
import { signInUser } from '../redux/users/userSlice';
import SyncLoader from "react-spinners/SyncLoader";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch =useDispatch();

  const handleChange = (e) => {
    setError({});
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        setLoading(true);
        const data= await fetchFromApi('https://react-state-api-production.up.railway.app/api/users/signin',formData,'POST');
        if(!data.success) {
          setLoading(false);
          setError({
            status: false,
            message:data?.message
          });
        }else{
          dispatch(signInUser(data.data.loggedInUser));
          setLoading(false);
          setError({
            status: true,
            message:data?.message
          });
            navigate('/');
        }
        
    } catch (error) {
       setLoading(false);
       setError({
        status: false,
        message:error.message
      });
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <Input
          type='email'
          placeholder='email'
          id='email'
          value={formData.email || ''}
          onChange={handleChange}
                
        />
        <Input
          type='password'
          placeholder='password'
          id='password'
          value={formData.password || ''}
          onChange={handleChange}
        
        />
        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-70'
        >
          {loading ? <SyncLoader size={10} color="#fff" /> : 'Sign In'}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Don&#39;t Have an account?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700'>Sign Up</span>
        </Link>
      </div>
      {error && (
        <p className={`${error.status ? 'text-green-500' : 'text-red-500'} mt-5`}>
          {error.message}
        </p>
      )}
    </div>
  );
}
