import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation,Scrollbar } from 'swiper/modules';
import 'swiper/css/bundle';
import { signOutUser } from '../redux/users/userSlice';
import useCustomToast from '../hooks/useCustomToast';
import { refreshAccessToken } from '../utils/refreshAccessToken';
import PuffLoader from "react-spinners/PuffLoader";
import { fetchFromApi } from '../utils/fetchFromApi';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Contact } from '../components';

export default function Listing() {
  SwiperCore.use([Navigation,Scrollbar]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const params = useParams();
  const [copied, setCopied] = useState(false);
  const { notifyError,notifySuccess } = useCustomToast();
  const {currentUser} =useSelector((state)=>state.user);
  const [contact, setContact] = useState(false);

  //=useEffect to get the listing info:
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const data=await fetchFromApi(`/api/listings/get-listing/${params.id}`);
        if(data.statusCode === 401){
            console.log('log error 1');
            const response =await refreshAccessToken();
            if(response.statusCode === 401){
            console.log('log error 2');
            notifyError(response.message)
            dispatch(signOutUser());
            }else{
            return fetchListing();
            }
        }
        if(data.success === true){
            setListing(data.data);
            setLoading(false);
            setError(false);
        }
        
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, []);

  return (
    <main>
      {loading && <div className='flex h-[80vh] items-center justify-center'>
        <p className='text-2xl'> <PuffLoader size={50} color="gray" /></p>
      </div> }
      {error && (
        <p className='text-center my-7 text-2xl font-bold  '>Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div className='flex items-start justify-center p-2 sm:p-3 gap-2 max-md:flex-col'>
          <Swiper 
            navigation
            scrollbar={{ draggable: true }}
            // spaceBetween={50}
             // slidesPerView={3}
             className='max-md:w-full w-[50%] rounded-lg  flex-1 mt-11 '
          >
            {listing.imageUrls.map((url) => (
              <SwiperSlide  key={url}>
                <div
                  className='h-[420px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-black'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-1 flex-col max-w-4xl mx-auto  my-7 p-3 gap-4'>
            <p className='text-2xl font-semibold'>
              {listing.name} - ₹{' '}
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </p>
            <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  ₹{+listing.regularPrice - +listing.discountPrice} Off
                </p>
              )}
            </div>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description - </span>
              {listing.description}
            </p>
            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
            {currentUser && listing.user._id !== currentUser._id && !contact && (
              <button onClick={()=>setContact(true)} className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3 sm:max-w-80'>
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing}/>}
          </div>
        </div>
      )}
    </main>
  );
}