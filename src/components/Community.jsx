import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import './Community.css';
import axios from 'axios';

const Community = () => {
  // const [currentPage, setCurrentPage] = useState(1);
  // const handlePageChange = (pageNumber) => {
  //   setCurrentPage(pageNumber);
  // };
  // const totalPages = Math.ceil(contents.length / itemsPerPage);
  // const [contents, setcontents] = useState([]);
  const [write, setWrite] = useState([])

  // useEffect(()=>{
  //   axios.get(`https://whippedb4.hyee34.site/community_announcement`).then((response) => {
  //     const texts =response.data;
  //     setWrite(texts)
  //     console.log(write);
  //   })
  // }, [])


  return (
    <div style={{backgroundColor:'rgb(246, 246, 242)', height:"100vh"}}>
      <Navbar />
      <div className='community-container' style={{ height: '100%', paddingTop: '110px', paddingLeft:'3rem', paddingRight:'3rem'}}>
        {/* <div className='community-index'>
          <p>공지사항</p>
          <p>리뷰</p>
        </div> */}
        <div className='community-contents'>
          <div className='contents-header'>
             <h2>공지사항</h2>
          </div>
          <div className='contents-body'>
            <div className='contents-container'>
              <div>
                <div className='contents-basis'>
                  <p className='number'>숫자</p>
                  <p className='basis-title'>제목</p>
                  <p className='author'>이름</p>
                  <p className='date'>날짜</p>
                  <p className='views'>조회</p>
                </div>
                <div className='contents-upload'>내용이 없습니다.</div>
              </div>
              {/* {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))} */}
              <div className='contents-empty'>
                <p>검색결과가 없습니다.</p>
              </div>
            </div>
            <div className='contents-footer'>
              <select className='footer-dropdown'>
                <option value="title">제목</option>
                <option value="author">이름</option>
              </select>

              <input 
                type="text" 
                placeholder="" 
                className='search-input' 
              />
               <button className='search-btn'>찾기 </button>
            </div>
          </div>            
        </div> 
      </div>
    </div>
  )
}

export default Community