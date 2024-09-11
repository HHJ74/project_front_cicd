import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Navbar from './Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../redux/slices/cartSlice';
import CartModal from './CartModal';
const DiyItem = () => {
    const [diy, setDiy] = useState([]);
    const [open, setOpen] = useState(false);
    const [totalPrice, setTotalPrice] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    // const [pData, setPdata] = useState([])
    const [selectedProductName, setSelectedProductName] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authData = useSelector((state) => state.auth.authData);
  useEffect(() => {
    axios.get(`https://whipped.purple-coding.site/get_product`).then((response) => {
      const items = response.data;
      setDiy(items)

    });
  }, []);

  const modalOpen = () => {
   setOpen(true)
  };
  const handleCloseModal = () => {
    setOpen(false);
  };

  const modalClose = (e) => {
    if (e.target.className === 'modal-backdrop') {
      setOpen(false);
    }
  };

  const putCart = async () =>{
    const userId = authData ? authData.id : null;
    if (!authData) {
      alert('로그인 후 장바구니에 추가할 수 있습니다.');
      navigate('/login');
      return;
    }
    const item = diy.find(item => item.product_id === 6);
    if (!item) {
        alert('제품을 찾을 수 없습니다.');
        return;
    }
     if(selectedOptions.length === 0){
      alert('옵션을 선택해주세요.')
      return;
    }
   
    
    const extractedOptions = selectedOptions.map(option => {
      const parts = option.split(' '); // 공백으로 분할
      return parts[1]; // 두 번째 단어를 추출
    });
    
    console.log(extractedOptions);

    const cartItem = {
      product_id : item.product_id,
      price : item.p_price,
      quantity : quantity,
      add_at : new Date().toISOString(),
      product_size: null,
      is_bundle : true,
      selected_options: extractedOptions,
    }
    try {
      await axios.post(`https://whipped.purple-coding.site/add_Diyitem/${userId}`,cartItem, { 
        headers : {'Content-Type' : 'application/json'},
    });
    alert('장바구니에 추가되었습니다!')
    dispatch(addItem(cartItem))
    modalOpen()
    console.log('Cart Item:', cartItem);
   } catch (error) {
    console.error('Error adding item to cart:', error)
      
    }
  }
 
  
  const diyItem = diy.filter((item) => item.product_id === 6);
  const nonDiyItem = diy.filter((item) => item.product_id !== 6);
 

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSelectOptions = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedOptions([...selectedOptions, value]);
    } else {
      setSelectedOptions(selectedOptions.filter(option => option !== value));
    }
  };
  console.log(selectedOptions);
  const putDiyItem = () =>{

  }
  // setSelectedProductName(diy.details?.p_name)
  const purchaseOpen = (product) => {
    if (!authData) {
      alert('로그인 후 장바구니에 추가할 수 있습니다.');
      navigate('/login');
      return;
    }
    // setSelectedProduct(product);
    // console.log(product);
    const selectedProduct = diyItem
    // console.log(object);
    // console.log(diyItem);
    // if (!selectedProduct) {
    //   alert('선택한 제품을 찾을 수 없습니다.');
    //   return;
    // }
    if(selectedOptions.length === 0){
      alert('옵션을 선택해주세요.')
      return;
    }
  
    const extractedOptions = selectedOptions.map(option => {
      const parts = option.split(' '); // 공백으로 분할
      return parts[1]; // 두 번째 단어를 추출
    });

    const productToPurchase = {
      productId: selectedProduct[0].product_id,
      productName: diyItem[0].p_name,
      price: selectedProduct[0].p_price,
      quantity: quantity,
      img: selectedProduct[0].p_main_img,
      productSize: null,
      selected_options: extractedOptions,
    };
    console.log(productToPurchase);
    navigate('/purchase', { state: productToPurchase });
  };
// console.log(diyItem);
  return (
    <div>
      <Navbar />
      <div id="container">

          <div className="detailArea">
            <div className="detailLeft">
              <div className="productWrap">
                <div className="productImg">
                  <img src={diyItem[0]?.p_main_img} alt="Product image"></img>
                </div>
                <div className="productDescription">상품 설명</div>
                <div className="productDetailimg">
                  <div>
                  {[...Array(13).keys()].map(i =>
                        diyItem[0]?.[`p_img${i + 1}`] && (
                          <img key={i} src={diyItem[0]?.[`p_img${i + 1}`]} alt={`Image ${i + 1}`} />
                        )
                      )}
                
                  </div>
                </div>
              </div>
            </div>

            <div className="detailRight">
              <div className="detailInfo">
                <h2 className="productName">
                  
                  {diyItem[0] ? diyItem[0].p_name : ''}
                
                </h2>
                <div className="productDescription">
                  <div className="desSubtitle">
                    <h3>{diyItem[0] ? diyItem[0].p_name : ''}</h3>
                  </div>

                  <div className="desDetail">
                  {[...Array(14).keys()].map((i) => (
                      <p key={i}>{diyItem[0]?.[`p_info${i + 2}`]}</p>
                    ))}
                  </div>
                </div>

                <div className="price">
            
                </div>
                <br />

                <div className="productSelect" style={{display: 'flex', justifyItems: 'center'}}>
                  <div className="selectProduct_diy"  style={{align: 'start', width: 'fit-content'}}>
                  {nonDiyItem.map((product, index) => (
        <div key={index}>
          <input
            type="checkbox"
            value={product.p_name}
            onChange={handleSelectOptions}
            style={{marginRight : "5px"}}
          />
          {product.p_name.split(' ')[1] }

        </div>
      ))}
                    
              
              
          <div>
  
        
      </div>
                    {/* <div className="productQuantity">
                      <button > - </button>
                      <span>수량</span>
                      <button > + </button>
                    </div> */}
                  </div>
                </div>
                <div className="total">
                  <div className="totalName">
                    <p>가격 :</p>
                  </div>
                  <div className="totalPrice">
                  <p>{ diyItem[0] ? diyItem[0].p_price : ''}원
                   </p>
                  </div>
                </div>
                <div className="paymentButton">
                  <button className="purchaseButton" onClick={purchaseOpen}>
                    구매하기
                  </button>

                  <button
                    className="cartButton"
                    onClick={putCart}
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

      </div>
    </div>
  )
}

export default DiyItem