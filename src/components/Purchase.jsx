import React, { useEffect, useState } from 'react';
import './Purchase.css';
import Navbar from './Navbar';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
const Purchase = () => {
  const ProductImage = ({ imagePath }) => {
    const baseURL = 'https://whippedb4.hyee34.site'; // 서버의 기본 URL
    const imageUrl = `${baseURL}${imagePath}`; // 이미지 URL 조합

    return <img src={imageUrl} alt="Product" />;
  };
  const location = useLocation();
  const navigate = useNavigate();
  // const { selectedItems } = location.state || {}; // 장바구니페이지에서 선택상품만 받기
  const { selectedItems, productId, productName, productSize, quantity, price, img, selected_options } = location.state || {}; // 기본값 설정
  // const selectedProducts = location.state.selectedProducts;
  useEffect(() => {
    console.log('Selected items:', selectedItems); // 데이터가 제대로 전달되었는지 확인
  }, [selectedItems]);
  const setPrice = price ? price.replace(/,/g, '') : '0';

  const [product, setProduct] = useState(null); // State for the selected product

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(''); // 선택한 결제 수단을 저장하는 상태
  // 결제 수단 선택 시 호출되는 함수
  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value); // 결제 수단 상태 업데이트
  };

  // States for form fields
  const [values, setValues] = useState({
    name: '',
    email: '',
    email2: '',
    phone2_1: '',
    phone2_2: '',
    zonecode: '', // 우편번호 추가
    address: '', // 나머지 추가
    fullAddress: '', // 전체 주소 추가
    message: '',
  });
  useEffect(() => {
    if (!location.state) {
      navigate('/cart');
    }
  }, [location.state, navigate]);
  // console.log(location.state);
  const postcodeScriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
  const open = useDaumPostcodePopup(postcodeScriptUrl);

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';
    let localAddress = data.sido + ' ' + data.sigungu;

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress = fullAddress.replace(localAddress, '');
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    setValues({
      ...values,
      zonecode: data.zonecode,
      fullAddress: fullAddress,
    });
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.name) {
      alert('이름을 입력해주세요');
      return;
    }
    if (!values.zonecode || !values.fullAddress || !values.address) {
      alert('주소를 입력해주세요');
      return;
    }
    if (!values.phone2_1 || !values.phone2_2) {
      alert('휴대전화 번호를 입력해주세요');
      return;
    }
    if (!values.email) {
      alert('이메일을 입력해주세요');
      return;
    } else {
      navigate('/purchase_complete'); // 구매 완료 페이지로 이동
    }
  };

  const handleEmailChange = (e) => {
    const emailPart = e.target.value;
    const domain = emailIdentify === '직접입력' ? '' : emailIdentify;
    setValues({
      ...values,
      email: emailPart,
      fullEmail: `${emailPart}@${domain}`,
    });
  };

  const handleDomainChange = (e) => {
    const selectedDomain = e.target.value;
    setEmailIdentify(selectedDomain);

    setValues({
      ...values,
      fullEmail: `${values.email}@${selectedDomain === '직접입력' ? '' : selectedDomain}`,
    });
  };

  const handleDomainInputChange = (e) => {
    const customDomain = e.target.value;
    setEmailIdentify(customDomain);

    setValues({
      ...values,
      fullEmail: `${values.email}@${customDomain}`,
    });
  };

  const [cellphoneIdentify, setCellPhoneIdentify] = useState('010');
  const cellphoneList = ['010', '011', '016', '017', '018', '019'];

  const [emailIdentify, setEmailIdentify] = useState('naver.com');
  const emailList = ['naver.com', 'daum.net', 'gmail.com', '직접입력'];

  const [messageIdentify, setMessageIdentify] = useState('-- 메시지 선택 (선택사항)');
  const messagelList = [
    '-- 메시지 선택 (선택사항)',
    '배송 전 연락해주세요.',
    '부재 시 경비실에 맡겨주세요',
    '부재 시 문 앞에 놓아주세요',
    '직접입력',
  ];

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/[^0-9]/g, '');
    setValues({ ...values, [name]: sanitizedValue });
  };

  const authData = useSelector((state) => state.auth.authData);
  const userId = authData ? authData.id : null;
  const [each, setEach] = useState([]);
  useEffect(() => {
    const fetchEach = async () => {
      try {
        const response = await axios.get(`https://whippedb4.hyee34.site/each_purchase/${userId}`);
        const eachItems = response.data;
        // console.log(eachItems);
        setEach(eachItems);
      } catch (error) {
        console.log('Error fetching eachitems:', error);
      }
    };
    fetchEach();
  }, [userId]);
  console.log(selectedItems);
  // console.log(parseInt(selectedItems[2].price.replace(/,/g, '')).toLocaleString('ko-KR'));
  return (
    <div style={{ background: '#f6f4f4' }}>
      <Navbar />

      <div className="container" style={{ height: '100%' }}>
        <div className="purchaseForm">
          <form onSubmit={handleSubmit}>
            <div className="formSection">
              <div className="title">
                <h2>주문/결제</h2>
              </div>
              <div className="subTitle">
                <h3>배송지</h3>
              </div>
              <div className="receiver">
                <div className="receiverTitle">
                  <p>받는 사람 *:</p>
                </div>
                <div className="receiverInput">
                  <input
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={(e) => setValues({ ...values, name: e.target.value })}
                  />
                </div>
              </div>
              <div className="addressForm">
                <div className="zonecode">
                  <div className="zonecodeTitle">
                    <p>주소 *: </p>
                  </div>
                  <div className="zonecodeInput">
                    <input
                      type="text"
                      name="zonecode"
                      className="form-control"
                      placeholder="우편번호"
                      value={values.zonecode}
                      readOnly
                    />
                  </div>
                  <div className="zonecodeButton">
                    <button type="button" onClick={handleClick}>
                      주소검색
                    </button>
                  </div>
                </div>
                <div className="andAddress1">
                  <div className="andAddress1_1"></div>
                  <div className="andAddress1_2">
                    <input
                      type="text"
                      name="fullAddress"
                      className="form-control"
                      placeholder="기본주소"
                      value={values.fullAddress}
                      onChange={(e) => setValues({ ...values, fullAddress: e.target.value })}
                    />
                  </div>
                </div>
                <div className="andAddress2">
                  <div className="andAddress2_1"></div>
                  <div className="andAddress2_2">
                    <input
                      type="text"
                      name="address"
                      className="form-control"
                      placeholder="나머지 주소"
                      value={values.address}
                      onChange={(e) => setValues({ ...values, address: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="phone">
                <div className="phoneTitle">
                  <p>휴대전화*</p>
                </div>

                <div className="phoneInput">
                  <select
                    value={cellphoneIdentify}
                    onChange={(e) => setCellPhoneIdentify(e.target.value)}
                    className="form-control"
                    style={{ width: '100px' }}
                  >
                    {cellphoneList.map((phone2, index) => (
                      <option key={index} value={phone2}>
                        {phone2}
                      </option>
                    ))}
                  </select>

                  <input
                    type="tel"
                    name="phone2_1"
                    className="form-control"
                    value={values.phone2_1}
                    onChange={handlePhoneChange}
                    style={{ width: '100px' }}
                    maxLength={4}
                  />

                  <input
                    type="tel"
                    name="phone2_2"
                    className="form-control"
                    value={values.phone2_2}
                    onChange={handlePhoneChange}
                    style={{ width: '100px' }}
                    maxLength={4}
                  />
                </div>
              </div>
              <br />
              <div className="email">
                <div className="emailTitle">
                  <p>이메일* : </p>
                </div>
                <div className="emailInput">
                  <input
                    type="text"
                    name="email"
                    className="form-control"
                    value={values.email}
                    onChange={handleEmailChange}
                  />
                  {' @'}
                  <input
                    type="text"
                    className="form-control"
                    value={emailIdentify}
                    onChange={handleDomainInputChange}
                    style={{ width: '150px', marginLeft: '10px' }}
                  />
                  <select
                    value={emailIdentify}
                    onChange={handleDomainChange}
                    className="form-control"
                    style={{ width: '100px' }}
                  >
                    {emailList.map((email2, index) => (
                      <option key={index} value={email2}>
                        {email2}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <br />
              <div className="message">
                <div className="messageTitle">
                  <select
                    value={messageIdentify}
                    onChange={(e) => setMessageIdentify(e.target.value)}
                    className="form-control"
                    style={{ width: '100%' }}
                  >
                    {messagelList.map((message, index) => (
                      <option key={index} value={message}>
                        {message}
                      </option>
                    ))}
                  </select>
                  {messageIdentify === '직접입력' && (
                    <input
                      type="text"
                      name="customMessage"
                      className="form-control"
                      placeholder="메시지 직접 입력"
                      onChange={(e) => setValues({ ...values, message: e.target.value })}
                      style={{ width: '100%' }}
                    />
                  )}
                </div>
              </div>
              <div className="product">
                <div className="productTitle">
                  <h2>주문 상품</h2>
                </div>

                {productId ? (
                  <div className="productInfo">
                    <div className="infoImage">
                      <img src={img} alt="Product" style={{ width: '130px', height: '150px' }} />
                    </div>
                    <div className="infoSub">
                      <p>{productSize ? productName : productName}</p>
                      <p>수량: {quantity}</p>
                      <p style={{color : 'rgb(153, 150, 150)'}}>{productSize ? '' :  selected_options.join(', ') }</p>
                      <div className="total-price">
                        금액: {(parseInt(setPrice) * quantity).toLocaleString('ko-KR')}원
                      </div>
                    </div>
                  </div>
                ) : (
                  ''
                )}
                {selectedItems
                  ? selectedItems.map((item, idx) => (
                      <div className="productInfo">
                        <div className="infoImage">
                          <img src=
                          // {item.img} 
                          {item.productSize === "130g" ? item.details?.p_main_img_1 : item.details?.p_main_img}
                          alt="Product" style={{ width: '130px', height: '150px' }} />
                        </div>
                        <div className="infoSub">
                          <p>{item.productSize ? item.productName : item.details?.p_name}</p>
                          <p>수량: {item.quantity}</p>
                            <p style={{color : 'rgb(153, 150, 150)'}}>{item.selected_options ? item.selected_options.join(', ') : '' }</p>
                          <div className="total-price">
                        금액: {item.productSize ? (parseInt(item.price.replace(/,/g, '')) * item.quantity).toLocaleString('ko-KR'): (parseInt(item.details?.p_price.replace(/,/g, '')) * item.quantity).toLocaleString('ko-KR')}원
                          </div>
                        </div>
                      </div>
                    ))
                  : ''}
            
              </div>
              <div className="payment">
                <div className="paymentTitle">
                  <h3>결제 수단</h3>
                </div>
                <div className="paymentSub">
                  <p>결제 수단을 선택해주세요.</p>
                </div>
                <div className="paymentMethods">
                  <div className="bankTransfer" onClick={() => setSelectedPaymentMethod('bankTransfer')}>
                    무통장입금
                  </div>
                  <div className="creditCard" onClick={() => setSelectedPaymentMethod('creditCard')}>
                    신용카드
                  </div>
                  <div className="escrow" onClick={() => setSelectedPaymentMethod('escrow')}>
                    에스크로(계좌이체)
                  </div>
                  <div className="kakaoPay" onClick={() => setSelectedPaymentMethod('kakaoPay')}>
                    카카오페이
                  </div>
                </div>
                {selectedPaymentMethod === 'bankTransfer' && (
                  <div className="paymentForm">
                    <div className="paymentFormBank1">
                      <div className="bankTitle">
                        <p>입금은행:</p>
                      </div>
                      <div className="bankName">
                        <select>
                          <option value="">선택해 주세요</option>
                          <option value="SH">신한은행 110-405-681111</option>
                          <option value="KB">국민은행 110-405-681111</option>
                          <option value="WB">우리은행 110-405-681111</option>
                        </select>
                      </div>
                    </div>
                    <div className="paymentFormBank2">
                      <div className="peopleName">
                        <p>입금자명:</p>
                      </div>
                      <div className="peolpleInput">
                        <input type="text" />
                      </div>
                    </div>
                  </div>
                )}
                {selectedPaymentMethod === 'creditCard' && (
                  <div className="paymentForm">
                    {/* 신용카드 폼 필드 추가 */}
                    <div>소액 결제의 경우 PG사 정책에 따라 결제 금액 제한이 있을 수 있습니다.</div>
                  </div>
                )}
                {selectedPaymentMethod === 'escrow' && (
                  <div className="paymentForm">
                    {/* 에스크로 관련 폼 필드 추가 */}
                    <div className="escrowForm">
                      <div className="escrowName">
                        <p>계좌번호:</p>
                      </div>
                      <div className="escrowInput">
                        <input type="text" />
                      </div>
                    </div>
                  </div>
                )}
                {selectedPaymentMethod === 'kakaoPay' && (
                  <div className="payment-form">
                    {/* 카카오페이 관련 폼 필드 추가 */}
                    <div>
                      <p>카카오톡 앱을 설치한 후, 최초 1회 카드정보를 등록하셔야 사용 가능합니다.</p>
                      <p>인터넷 익스플로러는 8 이상에서만 결제 가능합니다.</p>
                      <p>카카오머니로 결제 시, 현금영수증 발급은 ㈜카카오페이에서 발급가능합니다.</p>
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" className="submitButton">
                결제하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Purchase;
