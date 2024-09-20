import axios from 'axios';
import React, { useState } from 'react';

const FindId = () => {
    const [values, setValues] = useState({
        name: "",
        email: "",
    });
    const [foundId, setFoundId] = useState(null); // 아이디를 저장할 상태
    const [errorMessage, setErrorMessage] = useState(null); // 에러 메시지 상태

    const handleSubmit = (e) => {
        e.preventDefault();

        if (values.name === "" || values.email === "") {
            return alert('이름과 이메일을 모두 입력해주세요.');
        }

        axios.post('https://whippedb4.hyee34.site/findUser', {
            name: values.name,
            email: values.email,
        })
        .then((res) => {
            if (res.status === 200) {
                setFoundId(res.data.userId); // 서버에서 받은 아이디를 저장
            } else {
                setErrorMessage('아이디 찾기에 실패하였습니다.');
            }
        })
        .catch((error) => {
            console.error("Find ID error:", error);
            setErrorMessage(error.response ? error.response.data.message : "서버와의 통신에 실패했습니다.");
        });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h3>아이디 찾기</h3>
                <input
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={(e) => setValues({ ...values, name: e.target.value })}
                    placeholder="이름"
                />
                <input
                    type="text"
                    name="email"
                    value={values.email}
                    onChange={(e) => setValues({ ...values, email: e.target.value })}
                    placeholder="이메일"
                />
                <button type="submit">아이디 찾기</button>
            </form>
            {foundId && <div>찾으신 아이디: {foundId}</div>}
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        </div>
    );
};

export default FindId;
