import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Purchase_Complete.css';

const Purchase_Complete = () => {
  const navigate = useNavigate();
  const handleHome = () => {
    navigate('/');
  };
  return (
    <div className="completeContainer">
      <div className="contentContainer">
        <div className="contentWrap">
          <div className="completeTitle">고객님의 주문이 완료 되었습니다.</div>
          <div className="completeSub">
            <p>-------------------------------------------------------------------------------</p>
            <div className="completeSubDes">
              <img src="/images/pngwing.png" alt="" style={{ width: '200px', height: '200px', margin: '20px 0' }} />
              <p>제품 구매가 완료되었습니다.</p>
              <p>주문번호 : 20240903-0001</p>
              <p>주문일자 : 2024년 09월 03일</p>
            </div>
            <p>-------------------------------------------------------------------------------</p>
          </div>
          <div className="completeSubTitle">구매가 완료 되었습니다.</div>
          <div className="completeSubTitle2">구매 후 1~2일 이후 받아 보실 수 있습니다.</div>
          <button onClick={handleHome} className="comleteButton">
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
};

export default Purchase_Complete;
