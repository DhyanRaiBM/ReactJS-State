import { GoogleAuthProvider, signInWithPopup,getAuth     } from 'firebase/auth';
import { app } from '../utils/firebase'; 
import { fetchFromApi } from '../utils/fetchFromApi';
import { signInUser } from '../redux/users/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const OAuth = () => {
    const dispatch =useDispatch();
    const navigate =useNavigate();

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app); // Get the authentication object
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            const data=await fetchFromApi(
                "/api/users/google",
                {
                    username: user.displayName,
                    email:user.email,
                    avatar:user.photoURL,

                },
                "POST"
            )
            if(data.success){
                dispatch(signInUser(data.data.loggedInUser));
                setTimeout(() => {
                  navigate('/');
                }, 2000);
              }else{
                throw new Error("Failed to Sign In");
              }

        } catch (error) {
            console.error(error.message);
        }
    };
    
  return (
    <button
        onClick={handleGoogleClick}
        type='button'
        className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
    >
        Continue with google
  </button>
  )
}
export default OAuth