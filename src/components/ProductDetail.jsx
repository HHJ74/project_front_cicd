import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductDetail.css';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import CartModal from './CartModal';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../redux/slices/cartSlice';

const ProductDetail = () => {
  const authData = useSelector((state) => state.auth.authData);
  const [open, setOpen] = useState(false);
  const { productId } = useParams(); // 현재 URL의 productId를 가져옵니다.
  const [pData, setPdata] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedProductName, setSelectedProductName] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  axios.defaults.withCredentials = false;

  const putCart = async () => {
    const userId = authData ? authData.id : null;

    if (!authData) {
      alert('로그인 후 장바구니에 추가할 수 있습니다.');
      navigate('/login');
      return;
    }

    const selectedProduct = pData.find(
      (product) => product.p_name === selectedProductName || product.p_name_1 === selectedProductName
    );

    if (!selectedProduct) {
      alert('선택한 제품을 찾을 수 없습니다.');
      return;
    }

    // 숫자 부분만 추출한 후 'g'를 붙여 product_size 설정
    const productSizeMatch = selectedProductName.match(/\d+/);
    const productSize = productSizeMatch ? `${productSizeMatch[0]}g` : '';

    const cartItem = {
      product_id: selectedProduct.product_id,
      product_name: selectedProductName,
      price: selectedProductName === selectedProduct.p_name ? selectedProduct.p_price : selectedProduct.p_price_1,
      quantity: quantity,
      added_at: new Date().toISOString(),
      product_size: productSize,
    };

    try {
      await axios.post(`https://whipped-back.purple-coding.site/add_item_detail/${userId}`, cartItem, {
        headers: { 'Content-Type': 'application/json' },
      });

      alert('장바구니에 추가되었습니다!');
      dispatch(addItem(cartItem));

      // 장바구니 상품 추가 후 모달창 열림
      modalOpen();
    } catch (error) {
      console.error('Error adding item to cart:', error);
      alert('장바구니에 추가하는 데 실패했습니다.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (productId === '6') {
          // 모든 제품 데이터를 가져오기 위한 API 호출
          response = await axios.get('https://whipped-back.purple-coding.site/get_product');
        } else {
          // 특정 제품 데이터를 가져오기 위한 API 호출
          response = await axios.get(`https://whipped-back.purple-coding.site/get_detail_products/${productId}`);
        }

        setPdata(response.data);

        if (response.data.length > 0) {
          setSelectedProductName(response.data[0].p_name);
          const finalPrice = Number(response.data[0].p_price.replace(/,/g, ''));
          setTotalPrice(finalPrice.toLocaleString('ko-KR'));
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchData();
  }, [productId]);

  const handleIncrement = () => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + 1;
      updateTotalPrice(newQuantity);
      return newQuantity;
    });
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => {
        const newQuantity = prevQuantity - 1;
        updateTotalPrice(newQuantity);
        return newQuantity;
      });
    }
  };

  const handleProductChange = (event) => {
    const selectedName = event.target.value;
    setSelectedProductName(selectedName);
    updateTotalPrice(quantity, selectedName);
  };

  const updateTotalPrice = (quantity, productName = selectedProductName) => {
    const selectedProduct = pData.find((product) => product.p_name === productName || product.p_name_1 === productName);

    if (selectedProduct) {
      const selectedPrice =
        productName === selectedProduct.p_name ? selectedProduct.p_price : selectedProduct.p_price_1;

      const toNumberPrice = selectedPrice.replace(/,/g, '');
      const finalPrice = quantity * parseInt(toNumberPrice);

      setTotalPrice(finalPrice.toLocaleString('ko-KR'));
    }
  };

  const modalOpen = () => {
    const selectedProduct = pData.find(
      (product) => product.p_name === selectedProductName || product.p_name_1 === selectedProductName
    );

    if (selectedProduct) {
      setOpen(true);
      setSelectedProduct(selectedProduct);
    }
  };

  const purchaseOpen = (product) => {
    if (!authData) {
      alert('로그인 후 장바구니에 추가할 수 있습니다.');
      navigate('/login');
      return;
    }
    const productSize = '80g';
    setSelectedProduct(product);
    const selectedProduct = pData.find(
      (product) => product.p_name === selectedProductName || product.p_name_1 === selectedProductName
    );

    if (!selectedProduct) {
      alert('선택한 제품을 찾을 수 없습니다.');
      return;
    }

    const productToPurchase = {
      productId: selectedProduct.product_id,
      productName: selectedProductName,
      price: selectedProductName === selectedProduct.p_name ? selectedProduct.p_price : selectedProduct.p_price_1,
      quantity: quantity,
      img: selectedProduct.p_main_img,
      productSize: selectedProductName.match(/\d+/) ? `${selectedProductName.match(/\d+/)[0]}g` : '', // Extracting product size if available
    };

    navigate('/purchase', { state: productToPurchase });
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const modalClose = (e) => {
    if (e.target.className === 'modal-backdrop') {
      setOpen(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div id="container">
        {pData.map((product, key) => (
          <div className="detailArea" key={key}>
            <div className="detailLeft">
              <div className="productWrap">
                <div className="leftDetailWrap">
                  <div className="productImg">
                    <img src={product.p_main_img} alt="Product image"></img>
                  </div>
                  <div className="productDescription">상품 설명</div>
                  <div className="productDetailimg">
                    <div>
                      {[...Array(20).keys()].map(
                        (i) =>
                          product[`p_img${i + 1}`] && (
                            <img key={i} src={product[`p_img${i + 1}`]} alt={`Image ${i + 1}`} />
                          )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="detailRight">
              <div className="detailInfo">
                <h2 className="productName">{selectedProductName}</h2>
                <div className="productDescription">
                  <div className="desDetail">
                    <div className="subTitle">
                      <p>{product.p_info1}</p>
                    </div>
                    <div className="subTitle1">
                      <p>{product.p_info2}</p>
                      <p>{product.p_info3}</p>
                    </div>
                    <div className="subTitle2">
                      <p>{product.p_info4}</p>
                      <p>{product.p_info5}</p>
                      <p>{product.p_info6}</p>
                      <p>{product.p_info7}</p>
                      <p>{product.p_info8}</p>
                      <p>{product.p_info9}</p>
                      <p>{product.p_info10}</p>
                    </div>
                    <div className="subTitle3">
                      <p>{product.p_info11}</p>
                    </div>
                    <div className="subTitle4">
                      <p>{product.p_info12}</p>
                    </div>
                    <div className="subTitle5">
                      <p>{product.p_info13}</p>
                      <p>{product.p_info14}</p>
                      <p>{product.p_info15}</p>
                      <p>{product.p_info16}</p>
                      <p>{product.p_info17}</p>
                      <p>{product.p_info18}</p>
                    </div>
                  </div>
                </div>

                {/* <div className="price">
                  {selectedProductName === product.p_name ? product.p_price : product.p_price_1}원
                </div> */}
                <br />

                <div className="productSelect">
                  <div className="selectProduct">
                    <select value={selectedProductName} onChange={handleProductChange}>
                      {pData.map((product) => (
                        <React.Fragment key={product.product_id}>
                          {product.p_name && <option value={product.p_name}>{product.p_name}</option>}
                          {product.p_name_1 && (
                            <option value={product.p_name_1}>{product.p_name_1 + ' +5000원'}</option>
                          )}
                        </React.Fragment>
                      ))}
                    </select>
                    <div className="productQuantity">
                      <button onClick={handleDecrement}> - </button>
                      <span>{quantity}</span>
                      <button onClick={handleIncrement}> + </button>
                    </div>
                  </div>
                </div>
                <div className="total">
                  <div className="totalName">
                    <p>총 금액 : </p>
                  </div>
                  <div className="totalPrice">
                    <p>{totalPrice}원</p>
                  </div>
                </div>
                <div className="paymentButton">
                  <button onClick={purchaseOpen} className="purchaseButton">
                    구매하기
                  </button>

                  <button
                    onClick={() => {
                      putCart();
                    }}
                    className="cartButton"
                  >
                    장바구니
                  </button>
                </div>

                <div className="modal">
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
                      <CartModal
                        product={selectedProduct}
                        quantity={quantity}
                        total={totalPrice}
                        close={handleCloseModal}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetail;
