import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import KakaoLogin from './kakao/KakaoLogin';
import './Login.css';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { FaHome } from 'react-icons/fa';

const Login = () => {
  const [values, setValues] = useState({
    userId: '',
    password: '',
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  axios.defaults.withCredentials = false;
  //withCredentials 옵션은 단어 그대로, 다른 도메인(Cross Origin)에 요청을 보낼 때 요청에 인증(credential) 정보를 담아서 보낼 지를 결정하는 항목이다. 즉, 쿠키나 인증 헤더 정보를 포함시켜 요청하고 싶다면, 클라이언트에서 API 요청 메소드를 보낼때 withCredentials 옵션을 true로 설정해야한다.

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.userId || !values.password) {
      alert('입력값을 확인해주세요');
      return;
    }

    console.log(values);

    axios
      .post('https://whipped.purple-coding.site/login', values)
      .then((res) => {
        if (res.status === 201) {
          console.log(res);
          const decoded = jwtDecode(res.data.token);
          console.log(decoded);
          console.log(decoded.name);
          dispatch(login({ authData: decoded }));
          navigate('/');
        } else {
          alert('로그인에 실패했습니다.');
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        alert(error.response ? error.response.data.message : '서버와의 통신에 실패했습니다.');
      });
  };

  //뒤로가기 코드
  const handleBack = () => {
    navigate(-1); //뒤로가기 +1은 앞으로 가기
  };

  return (
    <div className="Login-container">
      <div className="Login-contents">
        <div className="header">
          <span onClick={handleBack}>
            <IoMdArrowRoundBack style={{ width: '2em', height: '2em' }} />
          </span>
          <span
            onClick={() => {
              navigate('/');
            }}
            cursor="pointer"
          >
            <FaHome style={{ width: '2em', height: '1.5em' }} />
          </span>
        </div>
        <div className="contents">
          <div className="한글안내">
            <div className>
              <h2>로그인</h2>
            </div>
            <div className="kakaoExplain">
              <p>아이디와 비밀번호 입력하기 귀찮으시죠?</p>
              <p>1초 회원가입으로 입력없이 간편하게 로그인 하세요.</p>
            </div>
          </div>
          <div className="간편회원가입">
            <button className="kakaobutton">
              <KakaoLogin />
            </button>
          </div>
          <div className="일반로그인">
            <form onSubmit={handleSubmit}>
              <div className="로그인입력창">
                <input
                  type="userId"
                  placeholder="아이디"
                  name="userId"
                  className="form-control"
                  onChange={(e) => setValues({ ...values, userId: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="비밀번호"
                  name="password"
                  className="form-control"
                  onChange={(e) => setValues({ ...values, password: e.target.value })}
                />
              </div>
              <button type="submit" className="submitButton">
                로그인
              </button>

              <div className="userFind">
                <Link to="/findid">아이디 찾기 | </Link>
                {/* <Link to="/findpw">비밀번호 찾기 |</Link> */}
                <Link to="/register">회원가입</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
