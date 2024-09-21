import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import KakaoLogin from './kakao/KakaoLogin';
import { useDaumPostcodePopup } from 'react-daum-postcode';

import './Register.css';

const Register = () => {
  const [values, setValues] = useState({
    // 회원구분: "",
    userId: '',
    name: '',
    password: '',
    r_password: '',
    zonecode: '',
    fullAddress: '',
    address: '',
    phoneIdentify: '',
    phone1_1: '',
    phone1_2: '',
    cellphoneIdentify: '',
    phone2_1: '',
    phone2_2: '',
    email: '',
    sex: '',
    birth: '',
  });

  // Daum 주소 검색 API
  const postcodeScriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
  const open = useDaumPostcodePopup(postcodeScriptUrl);

  // 주소 선택 후 처리하는 함수
  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';
    let localAddress = data.sido + ' ' + data.sigungu;

    // 도로명 주소인 경우 추가 주소 정보 처리
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
      zonecode: data.zonecode, // 우편번호 저장
      fullAddress: fullAddress, // 전체 주소 저장
    });
  };

  // 우편번호 검색 팝업을 여는 함수
  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // 아이디 유효성 검사 (영문 소문자,숫자의 조합으로 이루어진 6~16자)
    const idRegex = /^(?=.*[a-z])(?=.*\d)[A-Za-z\d]{6,16}$/;

    // 비밀번호 유효성 검사 (영문 대소문자/숫자/특수문자 중 3가지 이상 조합, 8자~16자)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])|(?=.*[a-z])(?=.*[A-Z])(?=.*[!?@#$%^&*~])|(?=.*[a-z])(?=.*[0-9])(?=.*[!?@#$%^&*~])|(?=.*[A-Z])(?=.*[0-9])(?=.*[!?@#$%^&*~])[A-Za-z\d!?@#$%^&*~]{8,16}$/;

    if (!idRegex.test(values.userId)) {
      alert('아이디를 입력해주세요.');
      return;
    }
    if (!passwordRegex.test(values.password)) {
      alert('비밀번호를 입력해주세요.');
      return;
    }
    if (values.password !== values.r_password) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!values.name) {
      alert('이름을 입력해주세요');
      return;
    }
    if (!cellphoneIdentify || !values.phone2_1 || !values.phone2_2) {
      alert('전화번호를 입력해주세요');
      return;
    }
    if (!values.email || !emailIdentify) {
      alert('이메일을 입력해주세요');
      return;
    }
    if (!values.sex) {
      alert('성별을 입력해주세요');
      return;
    }
    if (!values.birth) {
      alert('생년월일을 입력해주세요');
      return;
    } else {
      alert('회원가입을 환영합니다');
    }

    axios
      .post('https://whipped-back.purple-coding.site/register', values)
      .then((res) => {
        if (res.status === 201) {
          navigate('/login');
          // console.log()
        } else {
          alert('회원가입에 실패했습니다.');
        }
        console.error();
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          alert('이미 존재하는 이메일입니다. 다른 이메일을 사용하세요.');
        } else {
          alert('회원가입에 실패했습니다.');
        }
      });
  };

  // 이메일 종류 선택
  const [emailIdentify, setEmailIdentify] = useState('직접입력');
  const emailList = ['naver.com', 'daum.net', 'gmail.com', '직접입력'];

  // 이메일 변경 시 호출되는 함수
  const handleEmailChange = (e) => {
    const emailPart = e.target.value;
    const domain = emailIdentify === '직접입력' ? '' : emailIdentify;
    setValues({
      ...values,
      email: emailPart,
      fullEmail: `${emailPart}@${domain}`,
    });
  };

  // 도메인 선택 시 호출되는 함수
  const handleDomainChange = (e) => {
    const selectedDomain = e.target.value;
    setEmailIdentify(selectedDomain);

    setValues({
      ...values,
      fullEmail: `${values.email}@${selectedDomain === '직접입력' ? '' : selectedDomain}`,
    });
  };

  // 직접입력 도메인 변경 시 호출되는 함수
  const handleDomainInputChange = (e) => {
    const customDomain = e.target.value;
    setEmailIdentify(customDomain);

    setValues({
      ...values,
      fullEmail: `${values.email}@${customDomain}`,
    });
  };

  // 전화번호 관련 상태
  const [phoneIdentify, setPhoneIdentify] = useState('02');
  const phoneList = [
    '02',
    '031',
    '032',
    '033',
    '041',
    '042',
    '043',
    '044',
    '051',
    '052',
    '053',
    '054',
    '055',
    '061',
    '062',
    '063',
    '064',
  ];

  // phoneIdentify 값이 변경될 때 values 객체에 추가
  const handlePhoneIdentifyChange = (e) => {
    const selectedValue = e.target.value;
    setPhoneIdentify(selectedValue);
    setValues({ ...values, phoneIdentify: selectedValue });
  };

  const [cellphoneIdentify, setCellPhoneIdentify] = useState('010');
  const cellphoneList = ['010', '011', '016', '017', '018', '019'];

  // cellphoneIdentify 값이 변경될 때 values 객체에 추가
  const handleCellPhoneIdentifyChange = (e) => {
    const selectedValue = e.target.value;
    setCellPhoneIdentify(selectedValue);
    setValues({ ...values, cellphoneIdentify: selectedValue });
  };

  // 문자가 아닌 숫자만 들어가게 조정
  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/[^0-9]/g, ''); // 숫자 이외의 문자는 제거
    setValues({ ...values, [name]: sanitizedValue });
  };

  return (
    <div className="regi_container">
      <div className="SNS 로그인">
        <button className="kakaobutton">
          <KakaoLogin />
        </button>
      </div>

      <div className="title" style={{ marginBottom: '20px' }}>
        <h2>회원가입</h2>
      </div>
      <div className="입력창">
        <div className="회원구분">
          <label>
            <strong>회원구분*</strong>
          </label>
          <div className="userInfo">
            <label>
              <input
                type="radio"
                name="회원구분"
                value="개인회원"
                checked={values.회원구분 === '개인회원'}
                onChange={(e) => setValues({ ...values, 회원구분: e.target.value })}
              />{' '}
              개인회원
            </label>
            <label>
              <input
                type="radio"
                name="회원구분"
                value="사업자회원"
                checked={values.회원구분 === '사업자회원'}
                onChange={(e) => setValues({ ...values, 회원구분: e.target.value })}
              />{' '}
              사업자회원
            </label>
            <label>
              <input
                type="radio"
                name="회원구분"
                value="외국인회원"
                checked={values.회원구분 === '외국인회원'}
                onChange={(e) => setValues({ ...values, 회원구분: e.target.value })}
              />{' '}
              외국인회원(foreigner)
            </label>
          </div>
        </div>
        <div className="직접입력사항">
          <form onSubmit={handleSubmit}>
            {/* 아이디 */}
            <div className="아이디" style={{ margin: '20px 0' }}>
              <label htmlFor="userId">아이디*</label>
              <div className="input" style={{ margin: '10px 0 0 0' }}>
                <input
                  type="text"
                  name="userId"
                  className="form-control"
                  value={values.userId}
                  onChange={(e) => setValues({ ...values, userId: e.target.value })}
                />
              </div>
              <p>(영문소문자/숫자, 4~16자)</p>
            </div>

            {/* 비밀번호 */}
            <div className="비밀번호" style={{ margin: '20px 0' }}>
              <label htmlFor="password">비밀번호*</label>
              <div className="input" style={{ margin: '10px 0 0 0' }}>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={values.password}
                  onChange={(e) => setValues({ ...values, password: e.target.value })}
                />
              </div>
              <p>(영문 대소문자/숫자/특수문자 중 3가지 이상 조합, 8자~16자)</p>
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label htmlFor="r_password">비밀번호 확인*</label>
              <div className="input" style={{ margin: '10px 0' }}>
                <input
                  type="password"
                  name="r_password"
                  className="form-control"
                  value={values.r_password}
                  onChange={(e) => setValues({ ...values, r_password: e.target.value })}
                />
              </div>
            </div>

            {/* 이름 */}
            <div>
              <label htmlFor="name">이름*</label>
              <div className="input" style={{ margin: '10px 0 0 0' }}>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={values.name}
                  onChange={(e) => setValues({ ...values, name: e.target.value })}
                />
              </div>
            </div>

            {/* 주소 */}
            <div className="주소" style={{ margin: '10px 0 0 0' }}>
              <label>
                <strong>주소 </strong>
              </label>
              <div className="input" style={{ margin: '10px 0 0 0' }}>
                <input
                  type="text"
                  name="zonecode"
                  className="zonecode"
                  placeholder="우편번호"
                  value={values.zonecode}
                  readOnly
                />
                <button className="addressbutton" type="button" onClick={handleClick}>
                  주소검색
                </button>

                <input
                  type="text"
                  name="fullAddress"
                  className="form-control"
                  placeholder="기본주소"
                  value={values.fullAddress}
                  onChange={(e) => setValues({ ...values, fullAddress: e.target.value })}
                />
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

            {/* 전화번호 */}
            <div className="phoneInput" style={{ margin: '10px 0 0 0' }}>
              <label htmlFor="phone1_1">일반전화</label>
              <div className="input">
                <select value={phoneIdentify} onChange={handlePhoneIdentifyChange} className="form-control">
                  {phoneList.map((phone, index) => (
                    <option key={index} value={phone}>
                      {phone}
                    </option>
                  ))}
                </select>
                -
                <input
                  type="tel"
                  name="phone1_1"
                  className="form-control"
                  value={values.phone1_1}
                  onChange={handlePhoneChange}
                  maxLength={4}
                />
                -
                <input
                  type="tel"
                  name="phone1_2"
                  className="form-control"
                  value={values.phone1_2}
                  onChange={handlePhoneChange}
                  maxLength={4}
                />
              </div>
            </div>

            {/* 휴대전화 */}
            <div className="phoneInput">
              <label htmlFor="phone2_1" style={{ margin: '10px 0 0 0' }}>
                휴대전화*
              </label>
              <div className="input">
                <select value={cellphoneIdentify} onChange={handleCellPhoneIdentifyChange} className="form-control">
                  {cellphoneList.map((phone2, index) => (
                    <option key={index} value={phone2}>
                      {phone2}
                    </option>
                  ))}
                </select>
                -
                <input
                  type="tel"
                  name="phone2_1"
                  className="form-control"
                  value={values.phone2_1}
                  onChange={handlePhoneChange}
                  maxLength={4}
                />
                -
                <input
                  type="tel"
                  name="phone2_2"
                  className="form-control"
                  value={values.phone2_2}
                  onChange={handlePhoneChange}
                  maxLength={4}
                />
              </div>
            </div>

            {/* 이메일 */}
            <div className="emailInput" style={{ margin: '10px 0 0 0' }}>
              <label htmlFor="email">이메일*</label>
              <div className="input">
                <input
                  type="text"
                  name="email"
                  className="form-control"
                  value={values.email}
                  onChange={handleEmailChange}
                />
                {' @ '}
                <input type="text" className="form-control" value={emailIdentify} onChange={handleDomainInputChange} />
                <select value={emailIdentify} onChange={handleDomainChange} className="form-control">
                  {emailList.map((email2, index) => (
                    <option key={index} value={email2}>
                      {email2}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 성별 */}
            <div className="sex" style={{ margin: '10px 0 0 0' }}>
              <label>성별*</label>
              <div className="input" style={{ margin: '20px 0 0 0' }}>
                <label>
                  <input
                    type="radio"
                    name="sex"
                    value="남자"
                    checked={values.sex === '남자'}
                    onChange={(e) => setValues({ ...values, sex: e.target.value })}
                  />
                  {''} 남자
                </label>
                <label>
                  <input
                    type="radio"
                    name="sex"
                    value="여자"
                    checked={values.sex === '여자'}
                    onChange={(e) => setValues({ ...values, sex: e.target.value })}
                  />
                  {''} 여자
                </label>
              </div>
            </div>

            {/* 생년월일 */}
            <div style={{ margin: '20px 0 0 0' }}>
              <label htmlFor="birth">생년월일*</label>
              <div className="input" style={{ margin: '10px 0 0 0' }}>
                <input
                  type="date"
                  name="birth"
                  className="form-control"
                  value={values.birth}
                  onChange={(e) => setValues({ ...values, birth: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="submitButton">
              회원가입하기
            </button>
            <p>Agree to our Terms and Policies</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
