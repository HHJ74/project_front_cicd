import React from 'react'
import 사진1 from './middle2_01.jpg'
import 사진2 from './middle2_03.jpg'
import 사진3 from './middle2_04.jpg'
const Middle2 = () => {
  return (
    <div className='middle2_wrapper'>
        <div className='middle2_content'>
            <div className='middle2_content_div1'><img src={사진1} alt="" /></div>
            <div className='middle2_content_div2'> 
                <h3>DIY product</h3>
                 <p>Making your own vegan cosmetics at home is an easy way to embrace cruelty-free beauty while ensuring your products are natural and personalized to your needs.</p>
                
            </div>
        </div>
        <div className='middle2_content'>
            <div className='middle2_content_div1'><img src={사진2} alt="" /></div>
            <div className='middle2_content_div2'>
                <h3>Personal Beauty</h3>
                <p>Personal beauty is about embracing what makes you unique, choosing products and routines that reflect your values and enhance your natural features.</p>

                </div>
        </div>
        <div className='middle2_content'>
            <div className='middle2_content_div1'>
                    <img src={사진3} alt="" />
            </div>
            <div className='middle2_content_div2'>
                <h3>Vegan Beauty</h3>
                <p>Vegan beauty is all about choosing products that are cruelty-free and plant-based, reflecting a commitment to ethical and sustainable skincare.</p>

                </div>
        </div>

    </div>
  )
}

export default Middle2