import React, { useEffect, useState } from 'react';
import { MdCatchingPokemon, MdClose } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../redux/slices/cartSlice';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

const CartModal = ({ product, close, quantity }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [carts, setCarts] = useState([]);
  const [diyItems, setDiyItems] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [quantities, setQuantities] = useState({});
  const authData = useSelector((state) => state.auth.authData);
  const navigate = useNavigate();
  
  const userId = authData ? authData.id : null;

  // Fetch carts and DIY items
  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const response = await axios.get(`https://whipped-back.purple-coding.site/get_cart/${userId}`);
        const { cartItems, diyItems } = response.data;
  
        if (!Array.isArray(cartItems) || !Array.isArray(diyItems)) {
          throw new Error('Invalid data structure');
        }
  
        // 상품 상세 정보를 요청하는 배열 생성
        const productRequests = cartItems.map(item =>
          axios.get(`https://whipped-back.purple-coding.site/get_detail_products/${item.product_id}`)
        );
  
        // 수량을 관리할 Map 생성
        const quantityMap = {};
        cartItems.forEach(item => {
          quantityMap[item.product_id] = item.quantity;
        });
        setQuantities(quantityMap);
  
        // 모든 제품 세부 정보를 가져옴
        const productResponses = await Promise.all(productRequests);
  
        // 제품 세부 정보를 결합
        const productsWithDetails = cartItems.map((item, index) => ({
          ...item,
          details: productResponses[index]?.data[0] || {}, // 방어적 코딩
        }));
  
        // DIY 아이템 상태 업데이트 (details를 포함하는 경우)
        const diyProductRequests = diyItems.map(item =>
          axios.get(`https://whipped-back.purple-coding.site/get_detail_products/${item.product_id}`)
        );
  
        const diyProductResponses = await Promise.all(diyProductRequests);
        const diyItemsWithDetails = diyItems.map((item, index) => ({
          ...item,
          details: diyProductResponses[index]?.data[0] || {}, // 방어적 코딩
        }));
  
        // 장바구니와 DIY 아이템 결합
        const allItems = [...productsWithDetails, ...diyItemsWithDetails];
  
        setCarts(allItems); // 결합된 데이터를 상태에 설정
      } catch (error) {
        console.error('Error fetching carts:', error);
      }
    };
  
    fetchCarts();
  }, [userId]);
  
  // useEffect(() => {
  //   const fetchCarts = async () => {
  //     try {
  //       const response = await axios.get(`https://whipped-back.purple-coding.site/get_cart/${userId}`);
  //       const { cartItems, diyItems } = response.data;
  
  //       if (!Array.isArray(cartItems) || !Array.isArray(diyItems)) {
  //         throw new Error('Invalid data structure');
  //       }
  
  //       // Fetch details for regular products
  //       const productRequests = cartItems.map(item =>
  //         axios.get(`https://whipped-back.purple-coding.site/get_detail_products/${item.product_id}`)
  //       );
  
  //       // Create a quantity map
  //       const quantityMap = {};
  //       cartItems.forEach(item => {
  //         quantityMap[item.product_id] = item.quantity;
  //       });
  //       setQuantities(quantityMap);
  
  //       // Fetch product details
  //       const productResponses = await Promise.all(productRequests);
  //       const productsWithDetails = cartItems.map((item, index) => ({
  //         ...item,
  //         details: productResponses[index].data[0], // Assuming one product per response
  //       }));
  
  //       setCarts(productsWithDetails);
  
  //       // Fetch details for DIY items
  //       const diyProductRequests = diyItems.map(item =>
  //         axios.get(`https://whipped-back.purple-coding.site/get_detail_products/${item.product_id}`)
  //       );
  
  //       const diyProductResponses = await Promise.all(diyProductRequests);
  //       const diyItemsWithDetails = diyItems.map((item, index) => ({
  //         ...item,
  //         details: diyProductResponses[index].data[0], // Assuming one product per response
  //       }));
  
  //       setDiyItems(diyItemsWithDetails);
  //     } catch (error) {
  //       console.error('Error fetching carts:', error);
  //     }
  //   };
  
  //   fetchCarts();
  // }, [userId]);

  const handleOrderAll = () => {
    // 일반 상품 아이템 처리
    const allItems = carts.map((item) => ({
      productId: item.product_id,
      productSize: item.product_size,
      quantity: item.quantity,
      productName: item.product_size === '80g' ? item.details?.p_name : item.details?.p_name_1,
      price: item.product_size === '80g' ? item.details?.p_price : item.details?.p_price_1,
      img: item.product_size === '80g' ? item.details?.p_main_img : item.details?.p_main_img_1,
      details: item.details, // Include details
      selected_options: item.selected_options || [],
    }));

    // DIY 상품 아이템 처리
    const diyItemsMapped = diyItems.map((item) => ({
      productId: item.product_id,
      productSize: null,  // DIY 아이템은 사이즈가 없으므로 null로 설정
      quantity: item.quantity,
      productName: item.details?.p_name, // DIY 아이템의 이름
      price: item.details?.p_price,      // DIY 아이템의 가격
      img: item.details?.p_main_img,     // DIY 아이템의 이미지
      details: item.details,    
      
               // Include details
    }));
  
    // 일반 상품과 DIY 상품을 합침
    const allItemsWithDiy = [...allItems, ...diyItemsMapped];
    
    // 구매 페이지로 이동
    navigate('/purchase', {
      state: { selectedItems: allItemsWithDiy },
    });
  };
  

  const putCart = async () => {
    const userId = authData.id;
    
    const cartItem = {
      product_id: product.product_id,
      quantity: 1,
      added_at: new Date().toISOString(),
    };
      
    try {
      await axios.post(`https://whipped-back.purple-coding.site/add_item/${userId}`, cartItem, {
        headers: { 'Content-Type': 'application/json' },
      });

      dispatch(addItem(cartItem));
      alert('장바구니에 추가되었습니다!');
    } catch (error) {
      console.error('Error adding item to cart:', error);
      alert('장바구니에 추가하는 데 실패했습니다.');
    }
  };

  // Calculate pagination indices
//   const indexOfLastItem = currentPage * itemsPerPage;
// const indexOfFirstItem = indexOfLastItem - itemsPerPage;
// const currentItems = carts.slice(indexOfFirstItem, indexOfLastItem);

// const totalPages = Math.ceil(carts.length / itemsPerPage);
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = carts.slice(indexOfFirstItem, indexOfLastItem);

const totalPages = Math.ceil(carts.length / itemsPerPage);



  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

// console.log(carts);
  return (
    <div className="modal_wrapper">
      <div className="modal_inner">
        <div className="modal1">
          <p>옵션선택</p>
          <p>
            <MdClose onClick={close} style={{ cursor: 'pointer', height: '30px', width: '30px' }} />
          </p>
        </div>
        <span></span>
  
        {currentItems.map((item, idx) => (
          <div key={item.id || idx} className="modal2">
            <div className="modal2_img">


            <img src={item.product_size ? (item.product_size === '80g' ? item.details?.p_main_img : item.details?.p_main_img_1) : item.details?.p_main_img} />
            </div>
            <div className="modal2_txt">
              <p>상품이름 : 
                {item.product_size ? (item.product_size === '80g' ? item.details?.p_name : item.details?.p_name_1): item.details?.p_name}</p>
                
                <p style={{color : 'rgb(153, 150, 150)'}}>{item.product_size ? '' : item.selected_options.join(', ')}</p>
              
              <p>수량 : {item.quantity} </p>
              <p>가격 : {item.product_size
    ? (item.product_size === '80g'
        ? new Intl.NumberFormat().format(
            (parseInt(item.details?.p_price?.replace(/,/g, ''), 10) || 0) * (parseInt(item.quantity, 10) || 0)
          )
        : new Intl.NumberFormat().format(
            (parseInt(item.details?.p_price_1?.replace(/,/g, ''), 10) || 0) * (parseInt(item.quantity, 10) || 0)
          )
      )
    : new Intl.NumberFormat().format(
        (parseInt(item.details?.p_price?.replace(/,/g, ''), 10) || 0) * (parseInt(item.quantity, 10) || 0)
      )
}원</p>
            </div>
          </div>
        ))}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <div className="modal3">
          <button onClick={handleOrderAll}>바로 구매하기</button>
          <button onClick={() => navigate('/cart')}>장바구니 이동</button>
        </div>
      </div>
    </div>
  );}

  export default CartModal;