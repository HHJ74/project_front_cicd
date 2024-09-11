import React from 'react';
// import 미들 from './미들.jpg'
// import 사진 from './skin_all.jpg'
import middle2 from './middle3.png';
// import 미들3 from './whipped.jpeg'
import { useNavigate } from 'react-router-dom';
const Middle = () => {
  const navigate = useNavigate();
  return (
    <div className="middle_wrapper">
      <div className="middle_txt">
        <div className="txt_top">
          <p>
            Each product is formulated with intention <br></br>
            and crafted with care, harnessing the power of nature <br></br>
            to nurture your skin, while reflecting your commitment <br />
            to a cruelty-free and sustainable lifestyle.
          </p>
          <a href="/subpage">shop all products</a>
        </div>
        <div className="txt-bottom">
          <p
            onClick={() => {
              navigate('/');
            }}
            style={{ cursor: 'pointer' }}
          >
            <span style={{ marginRight: '30px' }}>01</span> Our Story
          </p>
          <p
            onClick={() => {
              navigate('/');
            }}
            style={{ cursor: 'pointer' }}
          >
            <span style={{ marginRight: '30px' }}>02</span> Community
          </p>
          <p
            onClick={() => {
              navigate('/');
            }}
            style={{ cursor: 'pointer' }}
          >
            <span style={{ marginRight: '30px' }}>03</span> Contact
          </p>
        </div>
      </div>
      <div className="middle_img">
        <img src={middle2} alt="" />
      </div>
    </div>
  );
};

export default Middle;
