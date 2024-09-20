import React, { useEffect, useState } from 'react';
import 스킨타입 from './skin_all.jpg';
import data from './data';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Skin.css';

const Skin = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('one');
  const [skin, setSkin] = useState('1');
  // const [product, setProduct] = useState(data);

  const [type1, setType1] = useState(false);
  const [type2, setType2] = useState(false);
  const [type3, setType3] = useState(false);

  const btnClick1 = () => {
    setType1(true);
    setType2(false);
    setType3(false);
  };
  const btnClick2 = () => {
    setType1(false);
    setType2(true);
    setType3(false);
  };
  const btnClick3 = () => {
    setType1(false);
    setType2(false);
    setType3(true);
  };
  const [item, setItem] = useState([]);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get('https://whipped-back.purple-coding.site/get_product');
        setItem(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchProduct();
  }, []);
  // 피부 타입별 이미지 클릭 시 해당 페이지로 이동하는 함수
  const openProduct = (id) => {
    navigate(`/product_detail/${id}`);
  };

  return (
    <div className="slider">
      {view === 'one' ? (
        <div className="skin_img_one">
          <img src={스킨타입} alt="" style={{ width: '100%', height: '100%' }} />
        </div>
      ) : (
        ''
      )}
      {view === 'two' && skin === '1' ? (
        <div className="skin_img_two" style={{ padding: '20px', gap: '20px' }}>
          <img src={item[0].p_main_img} alt="" onClick={() => openProduct(item[0].product_id)} />

          <div onClick={() => openProduct(item[0].product_id)}>
            <div>{item[0].p_name}</div>
            <div>{item[0].p_price}</div>
          </div>
          <img src={item[2].p_main_img} alt="" onClick={() => openProduct(item[2].product_id)} />
          <div onClick={() => openProduct(item[2].product_id)}>
            <div>{item[2].p_name}</div>
            <div>{item[2].p_price}</div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      {view === 'two' && skin === '2' ? (
        <div className="skin_img_two" style={{ padding: '20px', gap: '20px' }}>
          <img src={item[3].p_main_img} alt="" onClick={() => openProduct(item[3].product_id)} />

          <div onClick={() => openProduct(item[3].product_id)}>
            <div>{item[3].p_name}</div>
            <div>{item[3].p_price}</div>
          </div>
          <img src={item[4].p_main_img} alt="" onClick={() => openProduct(item[4].product_id)} />
          <div onClick={() => openProduct(item[4].product_id)}>
            <div>{item[4].p_name}</div>
            <div>{item[4].p_price}</div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      {view === 'two' && skin === '3' ? (
        <div className="skin_img_two" style={{ padding: '20px', gap: '20px' }}>
          <img src={item[0].p_main_img} alt="" onClick={() => openProduct(item[0].product_id)} />
          <div onClick={() => openProduct(item[0].product_id)}>
            <div>{item[0].p_name}</div>
            <div>{item[0].p_price}</div>
          </div>
          <img src={item[1].p_main_img} alt="" onClick={() => openProduct(item[1].product_id)} />
          <div onClick={() => openProduct(item[1].product_id)}>
            <div>{item[1].p_name}</div>
            <div>{item[1].p_price}</div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <div className="skin_btn">
        <div className="skin_btn1">
          {type1 ? (
            <button
              onClick={() => {
                setView('two');
                setSkin('1');
                btnClick1();
              }}
            >
              수부지
            </button>
          ) : (
            <button
              onClick={() => {
                setView('two');
                setSkin('1');
                btnClick1();
              }}
            >
              수부지
            </button>
          )}
        </div>
        <div className="skin_btn2">
          {type2 ? (
            <button
              onClick={() => {
                setView('two');
                setSkin('2');
                btnClick2();
              }}
            >
              민감건성
            </button>
          ) : (
            <button
              onClick={() => {
                setView('two');
                setSkin('2');
                btnClick2();
              }}
            >
              민감건성
            </button>
          )}
        </div>
        <div className="skin_btn3">
          {type3 ? (
            <button
              onClick={() => {
                setView('two');
                setSkin('3');
                btnClick3();
              }}
            >
              민감지성
            </button>
          ) : (
            <button
              onClick={() => {
                setView('two');
                setSkin('3');
                btnClick3();
              }}
            >
              민감지성
            </button>
          )}
        </div>

        {/* <button onClick={()=>{setView('two'); setSkin('2'); btnClick2()}}>민감건성</button>
            <button onClick={()=>{setView('two'); setSkin('3'); btnClick3()}}>민감지성</button> */}
      </div>
    </div>
  );
};

export default Skin;
