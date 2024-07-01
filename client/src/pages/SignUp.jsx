import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchFromApi } from '../utils/fetchFromApi';
import {Input, OAuth} from '../components';
import SyncLoader from "react-spinners/SyncLoader";


export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        const data= await fetchFromApi('/api/users/signup',formData,'POST');

        if(!data.success) {
          setLoading(false);
          setError({
            status: false,
            message:data?.message
          });
        }else{
          setLoading(false);
          setError({
            status: true,
            message:data?.message
          });
          setTimeout(() => {
            navigate('/sign-in');
          }, 2000);
        }
        
    } catch (error) {
       setLoading(false);
       setError({
        status: false,
        message:data?.message
      });
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <Input
          type='text'
          placeholder='username'
          id='username'
          value={formData.username || ''}
          onChange={handleChange}
        />
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
          {loading ? <SyncLoader size={10} color="#fff" /> : 'Sign Up'}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={'/sign-in'}>
          <span className='text-blue-700'>Sign in</span>
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
