import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MdCatchingPokemon, MdCleaningServices, MdClose } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
const Cart = () => {
  const navigate = useNavigate();
  const [carts, setCarts] = useState([]);
  const authData = useSelector((state) => state.auth.authData);
  const userId = authData ? authData.id : null;
  const [isOpen, setIsOpen] = useState(true);
  const [isNormal, setIsNormal] = useState(true);
  const [totalPrice, setTotalPrice] = useState('');
  const [diPrice, setDiyPrice] = useState('')
  const { productId } = useParams();
  const [diyItem, setDiyItems] = useState([])
  const openItems = () => {
    setIsOpen(!isOpen);
  };
  const normalItem = () => {
    setIsNormal(!isNormal);
  };
  //  선택상품 보내기
  const [checkItems, setCheckItems] = useState([]);
  const handleSingleCheck = (checked, productId, productSize, quantity, isDiy = false, cartItemId = null,) => {
    if (checked) {
      // 배열에 선택된 아이템 추가
      setCheckItems((prev) => [...prev, { productId, productSize, quantity, isDiy, cartItemId, }]);
    } else {
      // 선택 해제된 아이템을 배열에서 제거
      setCheckItems((prev) =>
        prev.filter(
          (item) =>
            !(item.productId === productId && item.productSize === productSize && item.isDiy === isDiy)
        )
      );
    }
  };
  
  const selectedPurchase = () => {
    if (checkItems.length === 0) {
      alert('선택된 상품이 없습니다.');
      return;
    }
  
    const selectedItems = checkItems.map((item) => {
      if (item.isDiy) {
        // DIY 아이템의 경우
        const diyItemm = diyItem.find(diy => diy.cart_item_id === item.cartItemId);
        return {
          productId: item.productId,
          productSize: null, // DIY는 사이즈가 없으므로 null
          quantity: item.quantity,
          productName: diyItemm?.details?.p_name || '', // DIY 아이템의 이름
          price: diyItemm?.details?.p_price || '', // DIY 아이템의 가격
          img: diyItemm?.details?.p_main_img || '', // DIY 아이템의 이미지
          details: diyItemm?.details || {}, // Include details
          selected_options: diyItemm?.selected_options || [], 
        };
      } else {
        // 일반 아이템의 경우
        const cartItem = carts.find(
          (cart) => cart.product_id === item.productId && cart.product_size === item.productSize
        );
        return {
          productId: item.productId,
          productSize: item.productSize,
          quantity: item.quantity,
          productName: cartItem
            ? item.productSize === '80g'
              ? cartItem.details?.p_name
              : cartItem.details?.p_name_1
            : '',
          price: cartItem ? (item.productSize === '80g' ? cartItem.details?.p_price : cartItem.details?.p_price_1) : '',
          img: cartItem
            ? item.productSize === '80g'
              ? cartItem.details?.p_main_img
              : cartItem.details?.p_main_img_1
            : '',
          details: cartItem ? cartItem.details : {}, // Include details if available
        };
      }
    });
  
    navigate('/purchase', {
      state: { selectedItems },
    });
    console.log(checkItems);
  };
  

  // 전체 상품 주문

  // 선택 상품  1개 보내기
  const handlePurchase = (cart) => {
    navigate('/purchase', {
      state: {
        productId: cart.product_id,
        productName: cart.product_size === '80g' ? cart.details?.p_name : cart.details?.p_name_1,
        productSize: cart.product_size,
        quantity: cart.quantity,
        price: cart.product_size === '80g' ? cart.details?.p_price : cart.details?.p_price_1,
        img: cart.product_size === '80g' ? cart.details?.p_main_img : cart.details?.p_main_img_1,
      },
    });
  };
  const handleDiyPurchase= (item) =>{
    navigate('/purchase', {
      state : {
        productId : item.product_id,
        productName : item.details?.p_name,
        productSize : null,
        quantity : item.quantity,
        price : item.details?.p_price,
        img : item.details?.p_main_img,
        selected_options: item.selected_options || [], 
      }
    })
  }
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
    }));
  
    // DIY 상품 아이템 처리
    const diyItemsMapped = diyItem.map((item) => ({
      productId: item.product_id,
      productSize: null,  // DIY 아이템은 사이즈가 없으므로 null로 설정
      quantity: item.quantity,
      productName: item.details?.p_name, // DIY 아이템의 이름
      price: item.details?.p_price,      // DIY 아이템의 가격
      img: item.details?.p_main_img,     // DIY 아이템의 이미지
      details: item.details,   
      selected_options: item.selected_options || [],          // Include details
    }));
  
    // 일반 상품과 DIY 상품을 합침
    const allItemsWithDiy = [...allItems, ...diyItemsMapped];
  
    // 구매 페이지로 이동
    navigate('/purchase', {
      state: { selectedItems: allItemsWithDiy },
    });
  };
  

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const response = await axios.get(`https://whipped.purple-coding.site/get_cart/${userId}`);
        const {cartItems, diyItems } = response.data;
        const productRequests = cartItems.map((item) =>
          axios.get(`https://whipped.purple-coding.site/get_detail_products/${item.product_id}`)
        );

        const productResponses = await Promise.all(productRequests);

        const productsWithDetails = cartItems.map((item, index) => ({
          ...item,
          details: productResponses[index].data[0],
        }));



        const diyRequests = diyItems.map((item) =>
          axios.get(`https://whipped.purple-coding.site/get_detail_products/${item.product_id}`)
        );
        const diyResponses = await Promise.all(diyRequests);
  
        const productsWithDiyDetails = diyItems.map((item, index) => ({
          ...item,
          details: diyResponses[index].data[0],
        }));
        const sortedCarts = productsWithDetails.sort((a, b) => {
          if (a.product_id !== b.product_id) {
            return a.product_id - b.product_id;
          }
          return (a.product_size || '').localeCompare(b.product_size || '');
        });
  
        // 정렬: DIY 상품은 cart_item_id 기준으로 정렬
        const sortedDiyItems = productsWithDiyDetails.sort((a, b) => a.cart_item_id - b.cart_item_id);
  
        // 상태 업데이트
        setCarts(sortedCarts);
        setDiyItems(sortedDiyItems);
  
        // 가격 계산
        calculateTotalPrice(sortedCarts);
        calculateDiyPrice(sortedDiyItems);
  
      } catch (error) {
        console.log('Error fetching carts:', error);
      }
    };
    fetchCarts();
  }, [userId]);
  const calculateTotalPrice = (carts) => {
    const total = carts.reduce((sum, item) => {
      const itemPriceKey = item.product_size === '80g' ? 'p_price' : 'p_price_1';
      const itemPrice = parseInt(item.details?.[itemPriceKey]?.replace(/,/g, ''), 10) || 0;
      return sum + itemPrice * (item.quantity || 1);
    }, 0);
  
    return total;
  };
  
  const calculateDiyPrice = (diyItem) => {
    const total = diyItem.reduce((sum, item) => {
      const diyPrice = parseInt(item.details?.p_price.replace(/,/g, ''), 10) || 0;
      return sum + diyPrice * (item.quantity || 1);
    }, 0);
  
    return total;
  };
  
  useEffect(() => {
    if (carts && diyItem) {
      const cartTotal = calculateTotalPrice(carts);
      const diyTotal = calculateDiyPrice(diyItem);
      const grandTotal = cartTotal + diyTotal;
  
      const formattedTotal = new Intl.NumberFormat().format(grandTotal);
      setTotalPrice(formattedTotal);
  
    }
  }, [carts, diyItem]);
  

  
  
  const quantityChange = async (userId, productId, productSize, newQuantity, cartItemId) => {
    try {
      if (newQuantity < 1) return;
  
      const requestBody = cartItemId
        ? { cartItemId, newQuantity }
        : { productId, productSize, newQuantity };
  
      // 수량 업데이트 요청
      await axios.post(`https://whipped.purple-coding.site/update_quantity/${userId}`, requestBody);
  
      // 장바구니와 DIY 아이템 모두 새로 가져오기
      const response = await axios.get(`https://whipped.purple-coding.site/get_cart/${userId}`);
      const { cartItems, diyItems } = response.data;
  
      // 장바구니와 DIY 아이템의 상세 정보를 가져옵니다.
      const productRequests = cartItems.map(item =>
        axios.get(`https://whipped.purple-coding.site/get_detail_products/${item.product_id}`)
      );
      const productResponses = await Promise.all(productRequests);
  
      const productsWithDetails = cartItems.map((item, index) => ({
        ...item,
        details: productResponses[index].data[0],
      }));
  
      const diyRequests = diyItems.map(item =>
        axios.get(`https://whipped.purple-coding.site/get_detail_products/${item.product_id}`)
      );
      const diyResponses = await Promise.all(diyRequests);
  
      const productsWithDiyDetails = diyItems.map((item, index) => ({
        ...item,
        details: diyResponses[index].data[0],
      }));
  
 // 정렬 기준을 정의합니다
 const sortedCartItems = productsWithDetails.sort((a, b) => {
  if (a.product_id !== b.product_id) {
    return a.product_id - b.product_id;
  }
  return (a.product_size || '').localeCompare(b.product_size || '');
});

const sortedDiyItems = productsWithDiyDetails.sort((a, b) => a.cart_item_id - b.cart_item_id);

// 상태 업데이트
setCarts(sortedCartItems);
setDiyItems(sortedDiyItems);

// 총 가격 재계산
calculateTotalPrice(sortedCartItems);
calculateDiyPrice(sortedDiyItems);

  
    } catch (error) {
      console.log('Failed to update quantity', error.response || error.message);
    }
  };
  
  
  

  

  const noItem = async (userId, productId, productSize, cartItemId) => {
    try {
      const isDiyItem = productSize === null;

    
      if (isDiyItem) {
        // DIY 아이템 삭제 요청
        await axios.post(`https://whipped.purple-coding.site/delete_item/${userId}`, { cartItemId });
      } else {
        // 일반 아이템 삭제 요청
        await axios.post(`https://whipped.purple-coding.site/delete_item/${userId}`, { productId, productSize });
      }
  
      // 장바구니에서 삭제된 아이템 필터링
      let updatedCarts = carts.filter((item) =>
        !(item.product_id === productId && item.product_size === productSize) &&
        !(item.is_bundle && item.cart_item_id === cartItemId)
      );
  
      // 일반 아이템의 상세 정보 요청
      const productRequests = updatedCarts
        .filter(item => !item.is_bundle)  // is_bundle이 false인 경우에만 요청
        .map((item) =>
          axios.get(`https://whipped.purple-coding.site/get_detail_products/${item.product_id}`)
        );
  
      const productResponses = await Promise.all(productRequests);
  
      updatedCarts = updatedCarts.map((item) => {
        // 일반 아이템의 경우
        if (!item.is_bundle) {
          return {
            ...item,
            details: productResponses.find(response => response.data[0].product_id === item.product_id)?.data[0] || item.details,
          };
        }
        return item;
      });
  
      // DIY 아이템의 경우, details는 이미 포함되어 있어 필터링만 필요
      const updatedDiyItems = diyItem.filter(item =>
        item.cart_item_id !== cartItemId
      );
      const sortedCarts = updatedCarts.sort((a, b) => {
        if (a.product_id !== b.product_id) {
          return a.product_id - b.product_id;
        }
        return (a.product_size || '').localeCompare(b.product_size || '');
      });
  
      const sortedDiyItems = updatedDiyItems.sort((a, b) => a.cart_item_id - b.cart_item_id);
  
      setCarts(sortedCarts);
      setDiyItems(sortedDiyItems);
  
      calculateTotalPrice(sortedCarts);
      calculateDiyPrice(sortedDiyItems);
    } catch (error) {
      console.log('Failed to delete item', error);
    }
  };
  
  const deleteAll = async()=>{
    try {
     const response = await axios.post(`https://whipped.purple-coding.site/delete_all/${userId}`)
      if (response.status === 200) {
        // Clear the cart items state to reflect the changes
        setCarts([])
        setDiyItems([]);
        console.log("All cart items deleted successfully.");
      }
    } catch (error) {
      console.log('Failed to delete item', error);
    }
  }
 
  // console.log(diyItem);
  return (
    <div className="cart" style={{ height: 'max-content' }}>
      <div className="cart_wrapper">
        <div className="cart_order">
          <p>1. 장바구니</p>
          <p>2. 주문서작성</p>
          <p>3. 주문완료</p>
        </div>
        <div className="cart_content">
          <div className="map_wrapper">
            <div>
              <div
                onClick={() => {
                  openItems();
                  normalItem();
                }}
                className="cart_open"
              >
                장바구니상품
              </div>
              {isNormal ? <><div className="cart_normal">일반상품 ({carts.length + diyItem.length}) </div>
              <div className="cart_normal_2"><button onClick={deleteAll} className='delete_all_btn'>전체 삭제</button></div></> : ''
              }
            </div>
            <div className="All">
            {/* <button  className="deleteAll_btn">전체 삭제</button> */}
            </div>
            {carts.map((cart, idx) => {
              const uniqueProductKey = `${cart.product_id}_${cart.product_size}`;
              if (isOpen === true)
                return (
                  <div className="cart_products">
                    <input
                      type="checkBox"
                      style={{ marginRight: '20px' }}
                      onChange={(e) =>
                        handleSingleCheck(e.target.checked, cart.product_id, cart.product_size, cart.quantity, cart.selected_options)
                      }
                      checked={checkItems.some(
                        (item) => item.productId === cart.product_id && item.productSize === cart.product_size
                      )}
                    />

                    <Link to={`/product_detail/${cart.product_id}`}>
                      {' '}
                      <div className="cart_left">
                        <img
                          src={cart.product_size === '80g' ? cart.details?.p_main_img : cart.details?.p_main_img_1}
                          alt=""
                        />
                      </div>
                    </Link>
                    <div className="cart_right">
                      <div className="cart_up">
                        <div className="cart_up_txt">
                          <Link
                            to={`/product_detail/${cart.product_id}`}
                            style={{ textDecoration: 'none', color: 'black' }}
                          >
                            <p>
                              상품이름 : {cart.product_size === '80g' ? cart.details?.p_name : cart.details?.p_name_1}
                            </p>
                          </Link>
                          <p>
                            
                            {cart.product_size === '80g'
                              ? new Intl.NumberFormat().format(
                                  parseInt(cart.details?.p_price.replace(/,/g, '')) * parseInt(cart.quantity)
                                )
                              : new Intl.NumberFormat().format(
                                  parseInt(cart.details?.p_price_1.replace(/,/g, '')) * parseInt(cart.quantity)
                                )}
                            원
                          </p>
                          <p>배송 : [무료] / 기본배송</p>
                        </div>
                        <div style={{ width: '100px' }}>
                          <MdClose
                            style={{ cursor: 'pointer', height: '30px', width: '30px', color: '#d3d0d0' }}
                            onClick={() => {
                              noItem(userId, cart.product_id, cart.product_size);
                            }}
                          />
                        </div>
                      </div>
                      <div className="cart_down">
                        <div>
                          <button
                            className="quantity_btn"
                            onClick={() =>
                              quantityChange(userId, cart.product_id, cart.product_size, cart.quantity - 1)
                            }
                          >
                            -
                          </button>
                          <div>{cart.quantity}</div>
                          <button
                            className="quantity_btn"
                            onClick={() =>
                              quantityChange(userId, cart.product_id, cart.product_size, cart.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                        <div className="cart_down_btn">
                          {/* <button>관심상품</button> */}
                          <button
                            onClick={() => {
                              navigate('/purchase');
                              handlePurchase(cart);
                            }}
                          >
                            주문하기
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
            })}
           
            {diyItem.map((item,idx)=>{
              if(isOpen === true)
                return(
                <div className="cart_products">
                   <input
      type="checkbox"
      style={{ marginRight: '20px' }}
      onChange={(e) =>
        handleSingleCheck(e.target.checked, item.product_id, null, item.quantity, true, item.cart_item_id)
      }
      checked={checkItems.some(
        (checkedItem) => checkedItem.cartItemId === item.cart_item_id && checkedItem.isDiy === true
      )}
    />

                <Link to={'/diyItem'}>
                  {' '}
                  <div className="cart_left">
                    <img
                      src={item.details?.p_main_img}
                      alt="p_main_img"
                    />
                  </div>
                </Link>
                <div className="cart_right">
                  <div className="cart_up">
                    <div className="cart_up_txt">
                      <Link
                          to={'/diyItem'} 
                        style={{textDecoration:"none", color:"black"}}
                       > 
                        <p>
                          상품이름 : {item.details?.p_name}
                        </p>
                      </Link>
                     
                      <p style={{color: "#a59b9b", fontSize:"13px" }}>{item.selected_options.join(', ')}</p>
                      <p>
                     {new Intl.NumberFormat().format(
                        parseInt(item.details?.p_price.replace(/,/g, '')) * parseInt(item.quantity)
                    )  }원
                      </p>
                      <p>배송 : [무료] / 기본배송</p>
                    </div>
                    <div style={{ width: '100px' }}>
                      <MdClose
                        style={{ cursor: 'pointer', height: '30px', width: '30px', color: '#d3d0d0' }}
                        onClick={() => {
                          noItem(userId, item.product_id, null, item.cart_item_id);
                        }}
                      />
                    </div>
                  </div>
                  <div className="cart_down">
                    <div>
                      <button
                        className="quantity_btn"
                        onClick={() =>
                          quantityChange(userId, null, null, item.quantity - 1, item.cart_item_id)
                        }
                      >
                        -
                      </button>
                      <div>{item.quantity}</div>
                      <button
                        className="quantity_btn"
                        onClick={() =>
                          quantityChange(userId, null, null, item.quantity + 1, item.cart_item_id)
                        }
                      >
                        +
                      </button>
                    </div>
                    <div className="cart_down_btn">
                      {/* <button>관심상품</button> */}
                      <button
                        onClick={() => {
                          navigate('/purchase');
                          handleDiyPurchase(item)
                        }}
                      >
                        주문하기
                      </button>
                    </div>
                  </div>
                  
                </div>
              
              </div>
             
                      )
})}
          </div>
          <div className="cart_purchase">
            <div className="cart_purchase_top">
              <p>주문상품</p>
              <div>
                <p>
                  <span>총 상품금액 </span>
                  <span>{totalPrice}원</span>{' '}
                </p>
                <p>
                  <span>총 배송비 </span>
                  <span>0원</span>{' '}
                </p>
              </div>
              <p>
                <span>결제예정금액 : </span>
                <span> {totalPrice}원</span>
              </p>
            </div>
            <div className="cart_purchase_bottom">
              <button onClick={handleOrderAll}>전체상품주문</button>
              <button
                onClick={() => {
                  navigate('/purchase');
                  selectedPurchase();
                }}
              >
                선택상품주문
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
