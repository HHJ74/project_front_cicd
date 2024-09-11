import React, { useState } from 'react';
import '../App.css';
import 로고 from './BI_logo_WHIPPED.svg';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.authData);
  return (
    <div className="navi">
      <div className="left">
        <p
          onClick={() => {
            navigate('/');
          }}
        >
          Home
        </p>
        <p
          onClick={() => {
            navigate('/subpage');
          }}
        >
          Shop
        </p>
        <p
          onClick={() => {
            navigate('/community');
          }}
        >
          Community
        </p>
      </div>
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
            <p>
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
