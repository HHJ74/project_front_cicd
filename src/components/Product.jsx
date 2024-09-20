import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';

const Product = () => {
  const [pData, setPdata] = useState([]);

  useEffect(() => {
    // 서버가 먼저 실행되어야 성공적으로 연결됩니다.
    axios.get('https://whipped-back.purple-coding.site/get_products').then((response) => {
      // console.log(response.data);
      setPdata(response.data);
    });
  }, []);
  return (
    <div className="wrap">
      <div style={{ display: 'flex', gap: '20px' }}>
        {pData.map((value, key) => {
          return (
            <div className="img" key={key}>
              <Link to={`/product_detail/${value.product_id}`}>
                {/* {console.log(value.product_id)} */}
                <img src={value.p_main_img} alt={value.p_main_img} style={{ width: '300px', height: '400px' }} />
                <p>{value.p_name}</p>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Product;
