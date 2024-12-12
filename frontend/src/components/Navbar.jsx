// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { UserCircleIcon, HeartIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const navLinks = [
  { title: 'Início', url: '/' },
  { title: 'Empresas', url: '/businessRegistration' },
  { title: 'Operações', url: '/importArchives' },
];

const iconList = [
  { icon: <HeartIcon className="h-6 w-6" /> },
  {
    icon: (
      <Link to="/login">
        <UserCircleIcon className="h-6 w-6" />
      </Link>
    ),
  },
];

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 769);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 769);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleModal = () => setShowModal(!showModal);

  return (
    <nav className="bg-[#151D20]">
      <div className="flex justify-between mx-auto items-center py-4 px-4 md:px-24">
        <div className="text-white font-bold text-xl">Logo</div>
        {!isMobile ? (
          <ul className="flex gap-8 items-center text-center cursor-pointer">
            {navLinks.map((link, index) => (
              <li key={index} className="text-white text-sm">
                <Link to={link.url}>{link.title}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex justify-end items-center gap-6 text-white cursor-pointer">
            {iconList.map((item, index) => (
              <div key={index}>{item.icon}</div>
            ))}
            <Bars3Icon onClick={toggleModal} className="h-6 w-6" />
          </div>
        )}
        {!isMobile && (
          <ul className="flex text-white gap-6 items-center">
            {iconList.map((item, index) => (
              <div key={index}>{item.icon}</div>
            ))}
          </ul>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-75">
          <div className="relative bg-gray-950 w-full h-full flex flex-col items-center justify-center p-4">
            <XMarkIcon className="absolute top-6 right-4 h-6 w-6 text-white cursor-pointer" onClick={toggleModal} />
            {navLinks.map((link, index) => (
              <Link
                to={link.url}
                key={index}
                className="text-white font-light text-2xl my-4"
                onClick={toggleModal}
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
