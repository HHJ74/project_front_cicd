import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Navbar from './Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, updateDiyQuantity } from '../redux/slices/cartSlice';
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
    axios.get(`https://whippedb4.hyee34.site/get_product`).then((response) => {
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

  


const checkDiyInCart = async (userId, productId, selectedOptions) => {
  try {
    // 장바구니에서 모든 아이템을 가져오기
    const response = await axios.get(`https://whippedb4.hyee34.site/get_cart/${userId}`);
    const { diyItems } = response.data;

    // selectedOptions를 문자열로 변환
    // selectedOptions를 공백으로 분할한 후 두 번째 단어를 추출하고 정렬
    const selectedOptionsStr = `${selectedOptions
      .map(option => {
        const parts = option.split(' '); // 공백으로 분할
        return `${parts[1]}`; // 두 번째 단어를 추출하고 ''로 감싸기
      })
      .sort((a, b) => a.localeCompare(b)) // 문자열 정렬
      .join(',')}`; // 배열을 문자열로 변환하고 대괄호로 감쌈


  
    console.log('Transformed selectedOptionsStr:', selectedOptionsStr);
    console.log(typeof(selectedOptionsStr));
    // DIY 아이템을 찾는 경우
    
    diyItems.forEach(item => {
      console.log('Item selected_options:', item.selected_options);
  
    });


    return diyItems.find(item => {
      const bbb =  item.selected_options.toString() // selected_options를 문자열로 변환
 
      // console.log(item.selected_options);
      // console.log(typeof(item.selected_options));
      console.log(bbb);
           console.log(typeof(bbb));
      console.log(typeof(selectedOptionsStr))
      console.log(selectedOptionsStr);;
      return item.product_id === productId && bbb === selectedOptionsStr; // 문자열 비교
    });
  } catch (error) {
    console.error('Error fetching cart items from cart:', error);
    return null;
  }
};


  const putCart = async () => {
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
    if (selectedOptions.length === 0) {
        alert('옵션을 선택해주세요.');
        return;
    }
    
    const existingItem = await checkDiyInCart(userId, item.product_id, selectedOptions);
    if (existingItem) {
        const shouldUpdate = window.confirm('상품이 이미 존재합니다. 추가하시겠습니까?');
        if (shouldUpdate) {
            try {
                const newQuantity = existingItem.quantity + 1;
                // const postgresArrayFormat = `{${selectedOptions.map(option => `"${option}"`).join(',')}}`
                // console.log(typeof(postgresArrayFormat));
                const extractSecondWords = (options) => {
                  return options.map(option => {
                    const words = option.split(' ');
                    return words[1]; // 두 번째 단어
                  });
                };
                
                const result = extractSecondWords(selectedOptions);
                await axios.post(
                    `https://whippedb4.hyee34.site/update_diy_quantity/${userId}`,
                    {
                        quantity: newQuantity,  
                        selected_options: result, 
                    },
                    {
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
                console.log(newQuantity);
                dispatch(
                    updateDiyQuantity({
                        selectedOptions: item.selected_options,
                        quantity: newQuantity
                    })
                );
                modalOpen({
                    ...item,
                    quantity: newQuantity
                });
                alert('수량이 추가되었습니다!');
                console.log(selectedOptions);
            } catch (error) {
                console.error('Error updating item quantity:', error);
                alert('수량 추가에 실패했습니다.');
            }
        }
    } else {
        // If the item does not exist, add it to the cart
        const extractedOptions = selectedOptions.map(option => {
            const parts = option.split(' '); // 공백으로 분할
            return parts[1]; // 두 번째 단어를 추출
        });

        const sortedOptions = extractedOptions.sort((a, b) => a > b ? 1 : -1);
        console.log(sortedOptions);

        const cartItem = {
            product_id: item.product_id,
            price: item.p_price,
            quantity: 1, // Default quantity for new items
            add_at: new Date().toISOString(),
            product_size: null,
            is_bundle: true,
            selected_options: sortedOptions
        };

        try {
            await axios.post(`https://whippedb4.hyee34.site/add_Diyitem/${userId}`, cartItem, { 
                headers: { 'Content-Type': 'application/json' }
            });
            alert('장바구니에 추가되었습니다!');
            dispatch(addItem(cartItem));
            modalOpen();
            console.log('Cart Item:', cartItem);
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    }
};

 
  
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
  // console.log(selectedOptions);
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

    const sortedOptions = extractedOptions.sort((a,b)=> a > b ? 1 : -1)
    console.log(sortedOptions);


    const productToPurchase = {
      productId: selectedProduct[0].product_id,
      productName: diyItem[0].p_name,
      price: selectedProduct[0].p_price,
      quantity: quantity,
      img: selectedProduct[0].p_main_img,
      productSize: null,
      selected_options: sortedOptions,
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
        <div key={index} className='option_div'>
          <input
            type="checkbox"
            value={product.p_name}
            onChange={handleSelectOptions}
            style={{marginRight : "5px"}}
            className='option_select'
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