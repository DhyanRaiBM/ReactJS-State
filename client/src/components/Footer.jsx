import { FaGithub, FaInstagram, FaLinkedin, FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  return (
        <footer className="bg-gray-800 text-gray-300 py-4 flex flex-col justify-center items-center gap-2 ">
            <div className="flex justify-center space-x-4">
            <Link to="https://github.com/DhyanRaiBM" target="_blank" rel="noopener noreferrer">
                <FaGithub className="text-white text-2xl" />
            </Link>
            <Link to="https://www.instagram.com/_dhyan_rai?igsh=MWloNXM2YXV6ZDZrag==" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="text-white text-2xl" />
            </Link>
            <Link to="https://www.linkedin.com/in/dhyan-rai-bm/" target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="text-white text-2xl" />
            </Link>
            </div>
            <p>&copy; 2024 Dhyan Rai. All rights reserved.</p>
        </footer>
  );
}