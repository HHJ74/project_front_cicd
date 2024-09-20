import React, { useEffect, useState } from 'react';
import data from './data';
import { Link, useNavigate } from 'react-router-dom';
import CartModal from './CartModal';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, updateItemQuantity } from '../redux/slices/cartSlice';
const Sub = () => {
  // const user = useSelector((state) => state.auth.user);
  const authData = useSelector((state) => state.auth.authData);
  const userId = authData ? authData.id : null;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [skinType, setSkinType] = useState(0);
  axios.defaults.withCredentials = false;



  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://whippedb4.hyee34.site/get_products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const checkProductInCart = async (productId, productSize, isDiy = false) => {
    try {
      // 장바구니에서 일반 상품과 DIY 상품 모두 가져오기
      const response = await axios.get(`https://whippedb4.hyee34.site/get_cart/${userId}`);
      const { cartItems, diyItems } = response.data;
      // console.log('Response data:', response.data); 
      if (isDiy) {
        // DIY 아이템을 찾는 경우
        return diyItems.find((item) => item.product_id === productId && item.cart_item_id);
      } else {
        // 일반 상품을 찾는 경우
        return cartItems.find((item) => item.product_id === productId && item.product_size === productSize);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      return null;
    }
  };
  

  const putCart = async (product) => {
    if (!authData) {
      alert('로그인 후 장바구니에 추가할 수 있습니다.');
      navigate('/login');
      return;
    }
    const productSize = '80g';
    // 선택한 제품을 selectedProduct로 설정
    setSelectedProduct(product);

    // 장바구니에 이미 있는지 확인
    const existingItem = await checkProductInCart(product.product_id, productSize);
    if (existingItem) {
      const shouldUpdate = window.confirm('상품이 이미 존재합니다. 추가하겠습니까?');

      if (shouldUpdate) {
        try {
          // 수량 업데이트
          const newQuantity = existingItem.quantity + 1;

          // 서버에 수량 업데이트 요청
          await axios.put(
            `https://whippedb4.hyee34.site/update_item/${userId}`,
            {
              product_id: product.product_id,
              quantity: newQuantity,
              product_size: productSize,
            },
            {
              headers: { 'Content-Type': 'application/json' },
            }
          );

          // Redux 상태에 수량 업데이트
          dispatch(
            updateItemQuantity({
              product_id: product.product_id,
              quantity: newQuantity,
              product_size: productSize,
            })
          );

          // 모달 열기
          modalOpen({
            ...product,
            quantity: newQuantity,
          });

          alert('수량이 추가되었습니다!');
        } catch (error) {
          console.error('Error updating item quantity:', error);
          alert('수량 추가에 실패했습니다.');
        }
      } else {
        return;
      }
    } else {
      const cartItem = {
        product_id: product.product_id,
        quantity: 1,
        added_at: new Date().toISOString(),

        product_size: productSize, // 추가된 부분
      };

      try {
        // 장바구니에 제품을 추가하는 API 호출
        await axios.post(`https://whippedb4.hyee34.site/add_item/${userId}`, cartItem, {
          headers: { 'Content-Type': 'application/json' },
        });

        // Redux 상태에 장바구니 아이템 추가
        dispatch(addItem(cartItem));

        // 모달 열기
        modalOpen({
          ...product,
          quantity: 1,
        });

        alert('장바구니에 추가되었습니다!');
      } catch (error) {
        console.error('Error adding item to cart:', error);
        alert('장바구니에 추가하는 데 실패했습니다.');
      }
    }
  };

  const purchaseOpen = (product) => {
    if (!authData) {
      alert('로그인 후 장바구니에 추가할 수 있습니다.');
      navigate('/login');
      return;
    }
    const productSize = '80g';
    // 선택한 제품을 selectedProduct로 설정
    setSelectedProduct(product);
    const productToPurchase = {
      productId: product.product_id,
      productName: product.p_name,
      price: product.p_price,
      quantity: 1,
      img: product.p_main_img,
      productSize: '80g', // Example product size
    };

    navigate('/purchase', { state: productToPurchase });
  };

  // modalOpen 함수에서 selectedProduct를 받아 모달 열기
  const modalOpen = (product) => {
    setSelectedProduct(product); // 선택한 제품 정보 저장
    setOpen(true); // 모달 열기
  };


  const handleCloseModal = () => {
    setOpen(false);
  };
 
 
  const modalClose = (e) => {
    // 모달 내부를 클릭하면 닫히지 않도록 이벤트 버블링 막기
    if (e.target.className === 'modal-backdrop') {
      setOpen(false);
    }
  };
  const filteredProducts = products.filter((product) => {
    if (skinType === 0) {
      return true; // All
    } else if (skinType === 1) {
      return product.product_id === 2 || product.product_id === 3;
    } else if (skinType === 2) {
      return product.product_id === 4 || product.product_id === 5;
    } else if (skinType === 3) {
      return product.product_id === 2 || product.product_id === 1;
    } else {
      return false;
    }
  });
  console.log(filteredProducts);

  return (
    <div style={{ backgroundColor: 'rgb(246, 246, 242)', height: "100%" }}>
      <div className="skinModal">
        <div className="skin_modal_wrapper">
          <div className="skin_modal_filter">filter</div>
          <div className="skin_modal_types">
            <div
              onClick={() => {
                setSkinType(0);
              }}
            >
              All
            </div>
            <div
              onClick={() => {
                setSkinType(1);
              }}
            >
              수부지
            </div>
            <div
              onClick={() => {
                setSkinType(2);
              }}
            >
              민감건성
            </div>
            <div
              onClick={() => {
                setSkinType(3);
              }}
            >
              민감지성
            </div>
          </div>
        </div>
      </div>
      <div className={`sub_wrapper ${open ? 'blur' : ''}`}>
      {filteredProducts
  .filter((product) => product.product_id <= 6)  // product_id가 5 이하인 제품만 필터링
  .map((product, key) => (
    <div className='sub_item_wrapper' key={key}>
      <div className="sub_item">
        <div className="sub_img">
        {product.product_id <= 5 ? (
            <Link to={`/product_detail/${product.product_id}`}>
              <div className="sub_hover">
                <p>{product.p_name}</p>
                <p>{product.p_price}원</p>
              </div>
            </Link>
          ) : product.product_id === 6 ? (
            <Link to="/diyItem">
              <div className="sub_hover">
                <p>{product.p_name}</p>
                <p>{product.p_price}원</p>
              </div>
            </Link>
          ) : (
            <div className="sub_hover">
              <p>{product.p_name}</p>
              <p>{product.p_price}원</p>
            </div>
          )}
          <img src={product.p_main_img} alt={product.p_name} />
        </div>
        <div className="sub_btn">
          {product.product_id <=5 ?
          <> <button onClick={() => putCart(product)}>장바구니에 넣기</button>
      
          <button onClick={() => purchaseOpen(product)}>구매하기</button></>: <button onClick={()=>{navigate('/diyItem')}}  >구매하기</button>}
         
        </div>
      </div>
    </div>
  ))}

      </div>
      {/* <div className='sub_item_wrapper'>
          <div className="sub_item">
            <div className="sub_img">
              <Link to={`/product_detail/${product.product_id}`}>
                <div className="sub_hover">
                  <p>{filteredProducts[5].p_name}</p>
                  <p>{filteredProducts[5].p_price}원</p>
                </div>
              </Link>
              <img src={filteredProducts[5].p_main_img} alt={filteredProducts[5].p_name} />
            </div>
            <div className="sub_btn">
              <button>구매하기</button>
            </div>
          </div>
          </div> */}
      {open && (
        <div
          className="modal-backdrop"
          onClick={modalClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CartModal product={selectedProduct} close={handleCloseModal} />
        </div>
      )}
    </div>
  );
};

export default Sub;
