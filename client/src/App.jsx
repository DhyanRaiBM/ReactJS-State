import { BrowserRouter, Route, Routes } from "react-router-dom";
import { About, Home, Profile, SignUp, SignIn, CreateListing, UpdateListing, Listing } from "./pages";
import { Footer, Header, Search } from "./components";
import Protected from "./components/Protected";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function App() {
  return (
    <BrowserRouter>
     <ToastContainer />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path='/search' element={<Search />} />
        <Route element={<Protected />} >
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/update-listing/:id" element={<UpdateListing />} />
          <Route path='/listing/:id' element={<Listing />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
