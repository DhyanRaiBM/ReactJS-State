import { useDispatch, useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../utils/firebase';
import { Input, Modal } from '../components';
import { fetchFromApi } from '../utils/fetchFromApi';
import { signInUser, signOutUser } from '../redux/users/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import useCustomToast from '../hooks/useCustomToast';
import { refreshAccessToken } from '../utils/refreshAccessToken';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [fileProgress, setFileProgress] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifyError,notifySuccess } =useCustomToast();
  const [userListings, setUserListings] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [listingModalOpen, setListingModalOpen] = useState(null);

  console.log(userListings);


  //=Firebase storage rules :
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  //=Handle file upload :
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileProgress(Math.round(progress));
        setFileUploadError(false);
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  //=Handle change:
  function handleChange(e){
    setFormData({...formData,[e.target.id]:e.target.value});
  }

  //=Handle submit:
  async function handleSubmit(e){
    e.preventDefault();
    try {
      setLoading(true);
      const data= await fetchFromApi('https://react-state-api-production.up.railway.app/api/users/update',formData,'PATCH');

      if(data.statusCode === 401){
        const response =await refreshAccessToken();
        if(response.statusCode === 401){
          notifyError(response.message)
          dispatch(signOutUser());
        }else{
          return handleSubmit(e);
        }
      }
      
      if(!data.success) {
        setLoading(false);
        setError({
          status: false,
          message:data?.message
        });
      }else{
        dispatch(signInUser(data.data));
        setLoading(false);
        setError({
          status: true,
          message:data?.message
        });
      }
      
  } catch (error) {
    console.log(error);
     setLoading(false);
     setError({
      status: false,
      message:error.message
    });
  }
  }

  //=Handle sign out:
  async function handleSignOut(){
     try {
        const data=await fetchFromApi("https://react-state-api-production.up.railway.app/api/users/signout",{},"POST");
        dispatch(signOutUser());
        if(data.success){
          notifySuccess(data.message);
        }
        if(data.statusCode === 401){
          const response =await refreshAccessToken();
          if(response.statusCode === 401){
            notifyError(response.message)
            dispatch(signOutUser());
          }else{
            return handleSignOut();
          }
        }

     } catch (error) {
        console.log(error);
        notifyError("Failed to sign out");
     }
  }

  //=Handle delete user :
  async function handleDelete(){
    try {
      const data= await fetchFromApi('https://react-state-api-production.up.railway.app/api/users/delete',{},'POST');

      if(data.statusCode === 401){
        const response =await refreshAccessToken();
        if(response.statusCode === 401){
          notifyError(response.message)
          dispatch(signOutUser());
        }else{
          return handleDelete();
        }
      }
      
      if(!data.success) {
        notifyError("Failed to delete Account");
      }else{
        dispatch(signOutUser());
        navigate("/sign-in");
        notifySuccess(data.message);
      }
      
  } catch (error) {
    console.log(error);
    notifyError("Failed to delete Account");
  }
  }

  //=Handle show listings :
  async function showListings() {
    try {
      const data = await fetchFromApi('https://react-state-api-production.up.railway.app/api/listings/get-listings');
      if(data.statusCode === 401){
        const response =await refreshAccessToken();
        if(response.statusCode === 401){
          notifyError(response.message)
          dispatch(signOutUser());
        }else{
          return showListings();
        }
      }
      if (data.success === false) {
        notifyError("Failed to get listings");
        console.log(data.message);
        return;
      }

      setUserListings(data.data);
    } catch (error) {
      notifyError("Failed to get listings");
      console.log(error.message);
    }
  }

  //=Handle delete listings:
  async function handleListingDelete(listingId) {
    try {
      const data = await fetchFromApi(`https://react-state-api-production.up.railway.app/api/listings/delete/${listingId}`,{},'DELETE');
      if(data.statusCode === 401){
        console.log('1');
        const response =await refreshAccessToken();
        if(response.statusCode === 401){
          notifyError(response.message)
          dispatch(signOutUser());
        }else{
          return handleListingDelete(listingId);
        }
      }
      if (data.success === false) {
        console.log('2');

        console.log(data.message);
        return;
      }

      if(data.success === true){
          setUserListings((prev) =>
          prev.filter((listing) => listing._id !== listingId)
        );
        setModalOpen(false);
      }

    } catch (error) {
      console.log(error.message);
    }
  };

  return (
      <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type='file'
            ref={fileRef}
            hidden
            accept='image/*'
          />
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            alt='profile'
            className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
          />
          <p className='text-sm self-center'>
            {
              fileUploadError ||fileProgress ?(
                fileUploadError ? (
                  <span className='text-red-700'>
                    Failed to upload Image(image must be less than 2 mb)
                  </span>
                ) :fileProgress > 0 && fileProgress < 100 ? (
                  <span className='text-slate-700'>{`Uploading ${fileProgress}%`}</span>
                ) : (
                  ''
                )
              ):""
            }
          </p>
          <Input
            type='email'
            placeholder='email'
            id='email'
            value={formData.email||''}
            disabled
          />
            <Input
              type='username'
              placeholder='username'
              id='username'
              value={formData.username||''}
              onChange={handleChange}
            />
          <Input
            type='password'
            placeholder='password'
            id='password'
            value={formData.password||''}
            onChange={handleChange}
          />
          <button
            disabled={loading} 
            className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
            {loading ? 'Loading..' : 'update'}
          </button>
          <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={"/create-listing"}>
            Create Listing
          </Link>
        </form>
        <div className='flex justify-between mt-5'>
          <span className='text-red-700 cursor-pointer'
                onClick={()=>setModalOpen(true)}
          >
            Delete account
          </span>
          


          <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
              <div className="text-center w-56">
                <div className="mx-auto my-4 w-48">
                  <h3 className="text-lg font-black text-gray-800">Confirm Delete</h3>
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete this Account?
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                     className="bg-red-700 text-white rounded-lg p-2 uppercase hover:opacity-95 disabled:opacity-80 w-full"
                     onClick={handleDelete}
                     >
                      Delete
                     </button>
                  <button
                    className="bg-slate-700 text-white rounded-lg p-2 uppercase hover:opacity-95 disabled:opacity-80 w-full"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
          </Modal>


          <span className='text-red-700 cursor-pointer'
                onClick={handleSignOut}
          >
            Sign out
          </span>
        </div>
        {error && (
          <p className={`${error.status ? 'text-green-500' : 'text-red-500'} mt-5 mb-5`}>
            {error.message}
          </p>
        )}
        <button onClick={showListings} className='text-green-700 w-full'>
          Show Listings
        </button>

        {userListings &&
          userListings.length > 0 &&
          <div className="flex flex-col gap-4">
            <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
            {userListings.map((listing) => (
              <div
                key={listing._id}
                className='border rounded-lg p-3 flex justify-between items-center gap-4'
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt='listing cover'
                    className='h-16 w-16 object-contain'
                  />
                </Link>
                <Link
                  className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                  to={`/listing/${listing._id}`}
                >
                  <p>{listing.name}</p>
                </Link>

                <div className='flex flex-col item-center'>
                  <button className='text-red-700 uppercase'
                          onClick={() => setListingModalOpen(listing._id)}
                  >
                    Delete
                  </button>

                  {/*Delete listing modal*/}
                    <Modal open={listingModalOpen ===listing._id} onClose={() => setListingModalOpen(null)}>
                        <div className="text-center w-56">
                          <div className="mx-auto my-4 w-48">
                            <h3 className="text-lg font-black text-gray-800">Confirm Delete</h3>
                            <p className="text-sm text-gray-500">
                              Are you sure you want to delete this Listing?
                            </p>
                          </div>
                          <div className="flex gap-4">
                            <button
                              className="bg-red-700 text-white rounded-lg p-2 uppercase hover:opacity-95 disabled:opacity-80 w-full"
                              onClick={()=>handleListingDelete(listing._id)}
                              >
                                Delete
                              </button>
                            <button
                              className="bg-slate-700 text-white rounded-lg p-2 uppercase hover:opacity-95 disabled:opacity-80 w-full"
                              onClick={() => setListingModalOpen(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                    </Modal>
                  <Link to={`/update-listing/${listing._id}`}>
                      <button className='text-green-700 uppercase'>Edit</button>
                  </Link>
                </div>
              </div>
            ))}

            
          </div>}
      </div>
    );
  }