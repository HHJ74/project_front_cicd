import React, { useState } from 'react';
import '../App.css';
import 로고 from './BI_logo_WHIPPED.svg';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCartSharp } from "react-icons/io5";
const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.auth.authData);
  const toggleMenu = () => {
    setIsOpen(!isOpen);  // 메뉴 상태를 토글
  };
  return (
    <div className="navi">
      <div className="hamburger" onClick={toggleMenu}>
       <RxHamburgerMenu />
      </div>
      <div className={`left ${isOpen ? 'open' : ''}`}>
        <p
          onClick={() => {
            navigate('/');
            setIsOpen(false);
          }}
        >
          Home
        </p>
        <p
          onClick={() => {
            navigate('/subpage');
            setIsOpen(false);
          }}
        >
          Shop
        </p>
        <p
          onClick={() => {
            navigate('/community');
            setIsOpen(false);
          }}
        >
          Community
        </p>
      </div>
    {/* <div className="hamburger" onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      <div className={`left ${isOpen ? 'open' : ''}`}>
        <p
          onClick={() => {
            navigate('/');
            setIsOpen(false); 
          }}
        >
          Home
        </p>
        <p
          onClick={() => {
            navigate('/subpage');
            setIsOpen(false);
          }}
        >
          Shop
        </p>
        <p
          onClick={() => {
            navigate('/community');
            setIsOpen(false);
          }}
        >
          Community
        </p>
      </div> */}
      <div className="logo">
        <img
          src={로고}
          alt="logo"
          style={{ height: '100%', width: '100%' }}
          onClick={() => {
            navigate('/');
          }}
        />
      </div>
      <div className="right">
        <div className="login">
          {user ? (
            <p className='logincart'>
              <span>{user.name}님</span>
              <span
                onClick={() => {
                  dispatch(logout());
                  alert('로그아웃 되었습니다.');
                  navigate('/');
                }}
              >
                {' '}
                Logout
              </span>
              
            </p>
           
          ) : (
            <>
              <span
                onClick={() => {
                  navigate('/login');
                }}
              >
                Login/
              </span>
              <span
                onClick={() => {
                  navigate('/join');
                }}
              >
                Join
              </span>
            </>
          )}
        </div>
        <div
          className="main_cart"
          onClick={() => {
            const userId = user ? user.id : null;

            if (!user) {
              alert('로그인이 필요합니다.');
              navigate('/login');
              return;
            }
            navigate('/cart');
          }}
        >
          Cart
        </div>
      </div>
    </div>
  );
};

export default Navbar;
