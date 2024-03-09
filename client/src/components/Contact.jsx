import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact({ listing }) {
  const [message, setMessage] = useState('');

  return (
    <>
      {listing?.user && (
        <div className='flex flex-col gap-2'>
          <p>
            Contact <span className='font-semibold'>{listing?.user?.username}</span>{' '}
            for{' '}
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={(e)=>setMessage(e.target.value)}
            placeholder='Enter your message here...'
            className='w-full border p-3 rounded-lg outline-none'
          ></textarea>

          <Link
          to={`mailto:${listing.user.email}?subject=Regarding : ${listing.name}&body=${message}`}
          className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
          >
            Send Message          
          </Link>
        </div>
      )}
    </>
  );
}