import React, { useEffect, useLayoutEffect, useState } from 'react';
import '../App.css'; // CSS 파일을 import 합니다.
import 사진 from './whipped.jpeg';
import ReactPlayer from 'react-player';
import 메인 from './메인2.png';

const Media = () => {
  const [video, setVideo] = useState(true);
  const [photo, setPhoto] = useState(true);
  const [mainPhoto, setMainPhoto] = useState(false);
  const [fade, setFade] = useState('');

  useEffect(() => {
    // 7초 후에 비디오와 사진을 숨기고 메인 사진을 표시
    const timer = setTimeout(() => {
      setVideo(false);
      setPhoto(false);
      setMainPhoto(true);
      setFade('fade-in');
      //  애니메이션 시작
    }, 5000);

    return () => clearTimeout(timer);
  }, []);


  
  //   const updateSize = () => {
  //     const videoWrap = document.querySelector("#video-wrap");
  //     const video = document.querySelector("#video");
  //     if(
  //       !video.classList.contains("is-vertical") &&
  //       video.offsetHeight > videoWrap.offsetHeight
  //     ){
  //       video.classList.add("is-vertical");
  //     } else if (
  //       video.classList.contains("is-vertical") &&
  //       video.offsetWidth > videoWrap.offsetWidth
  //     ){
  //       video.classList.remove("is-vertical")
  //     }
  //   }
 

  // useLayoutEffect(()=>{
  //   window.addEventListener("resize", updateSize);
  //   return () => window.removeEventListener("resize", updateSize)
  // },[])

  return (
    <div className="media_wrapper">
      {mainPhoto && (
        <div className="main-photo-wrapper">
          <img src={메인} className={`second_img ${fade}`} alt="Main" />
        </div>
      )}
      {photo && (
        <div className="photo">
          <img src={사진} alt="Photo" style={{ width: '100%', height: '100%' }} />
        </div>
      )}
      {video && (
        <div className="video" >
          <div style={{ height: '50%', width: '100%',position:'relative', top:'6px' }} id="video-wrap">
            <ReactPlayer
              url="/mainvideo01.mp4"
              controls={false}
              playing={true}
              width="100%"
              height="100%"
              position="absolute"
              className="reactplayer_01"
              loop={true}
              muted={true}
              style={{ objectFit: 'fill', position:'absolute',marginTop:"54.5px" }}
              id="video"
            />
          </div>
          <div style={{ height: '50%', width: '100%', position:'relative' }} id="video-wrap">
            <ReactPlayer
              url="/mainvideo02.mp4"
              controls={false}
              playing={true}
              width="100%"
              height="100%"
              className="reactplayer_02"
             
              loop={true}
              muted={true}
              style={{ objectFit: 'cover', position:'absolute', bottom:'-20px' }}
              id="video"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Media;

