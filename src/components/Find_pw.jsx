// import axios from 'axios';
// import React, { useState } from 'react';

// const FindPw = () => {
//     const [values, setValues] = useState({
//         name: "",
//         email: "",
//         userId: "",
//         cellphoneIdentify : "",
//         phone2_1:"",
//         phone2_2:"",
//         birth:""
//     });

//     const [foundPw, setFoundPw] = useState(null); // 아이디를 저장할 상태
//     const [errorMessage, setErrorMessage] = useState(null); // 에러 메시지 상태


//     const handleSubmit = (e) => {
//         e.preventDefault();

//         if (!values.name) {
//             alert("이름을 입력해주세요.");
//             return;
//         }
//         if (!values.email) {
//             alert("이메일을 입력해주세요.");
//             return;
//         }
//         if (!values.userId) {
//             alert('아이디를 입력해주세요');
//             return;
//         }
//         if (!cellphoneIdentify ||!values.phone2_1 ||!values.phone2_2){
//             alert('전화번호를 입력해주세요');
//             return;
//         }
//         if (!values.birth){
//             alert('생년월일을 입력해주세요');
//             return;
//         }

//         axios.post('https://whipped.purple-coding.site/findUser', values)
//         .then((res) => {
//             if (res.status === 200) {
//                 setFoundPw(res.data.userPw); // 서버에서 받은 비밀번호를 저장
//             } else {
//                 setErrorMessage('비밀번호 찾기에 실패하였습니다.');
//             }
//         })
//         .catch((error) => {
//             console.error("Find Pw error:", error);
//             setErrorMessage(error.response ? error.response.data.message : "서버와의 통신에 실패했습니다.");
//         });
//     };

    
//     const [cellphoneIdentify, setCellPhoneIdentify] = useState('010');
//     const cellphoneList = ['010', '011', '016', '017', '018', '019'];

//     // cellphoneIdentify 값이 변경될 때 values 객체에 추가
//     const handleCellPhoneIdentifyChange = (e) => {
//         const selectedValue = e.target.value;
//         setCellPhoneIdentify(selectedValue);
//         setValues({ ...values, cellphoneIdentify: selectedValue });
//     };

//     // 문자가 아닌 숫자만 들어가게 조정
//     const handlePhoneChange = (e) => {
//         const { name, value } = e.target;
//         const sanitizedValue = value.replace(/[^0-9]/g, "");  // 숫자 이외의 문자는 제거
//         setValues({ ...values, [name]: sanitizedValue });
//     };


       

//     return (
//         <div>
//             <form onSubmit={handleSubmit}>
//                 <h3>비밀번호 찾기</h3>
//                 <div>
//                     <input
//                         type="text"
//                         name="name"
//                         value={values.name}
//                         onChange={(e) => setValues({ ...values, name: e.target.value })}
//                         placeholder="이름"
//                     />
//                 </div>
//                 <div>
//                     <input
//                         type="text"
//                         name="email"
//                         value={values.email}
//                         onChange={(e) => setValues({ ...values, email: e.target.value })}
//                         placeholder="이메일"
//                     />
//                 </div>
//                 <div>
//                     <input
//                         type="text"
//                         name="userId"
//                         value={values.userId}
//                         onChange={(e) => setValues({ ...values, userId: e.target.value })}
//                         placeholder="아이디"
//                     />
//                 </div>
//                 <div>
//                         <label htmlFor="휴대전화">
//                             <strong>휴대전화*</strong>
//                         </label>
//                         <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
//                             <select
//                                 value={cellphoneIdentify}
//                                 onChange={handleCellPhoneIdentifyChange}  
//                                 className="form-control"
//                                 style={{ width: '100px' }}
//                             >
//                                 {cellphoneList.map((phone2, index) => (
//                                     <option key={index} value={phone2}>
//                                         {phone2}
//                                     </option>
//                                 ))}
//                             </select>
//                             -
//                             <input
//                                 type="tel"
//                                 name="phone2_1"
//                                 className="form-control"
//                                 value={values.phone2_1}
//                                 onChange={handlePhoneChange}
//                                 style={{ width: '100px' }}
//                                 maxLength={4}
//                             />
//                             -
//                             <input
//                                 type="tel"
//                                 name="phone2_2"
//                                 className="form-control"
//                                 value={values.phone2_2}
//                                 onChange={handlePhoneChange}
//                                 style={{ width: '100px' }}
//                                 maxLength={4}
//                             />
//                         </div>
//                         <div>
//                         <label htmlFor="birth">
//                             <strong>생년월일*</strong>
//                         </label>
//                         <input
//                             type="date"
//                             name="birth"
//                             className="form-control"
//                             value={values.birth}
//                             onChange={(e) => setValues({ ...values, birth: e.target.value })}
//                         />
//                     </div>

//                     </div>
//                 <button type="submit">비밀번호 찾기</button>
//             </form>
//             {foundPw && <div>찾으신 비밀번호: {foundPw}</div>}
//             {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
//         </div>
//     );
// };

// export default FindPw;
