import React from 'react'

const Footer = () => {
  return (
    <div className='footer_wrapper' style={{display: 'flex', height:'600px',justifyContent:'space-around',   backgroundColor: 'rgb(246, 246, 242)', padding:'0px'}}>
      <div className='footer_wrapper_div'>
          <ul className="footer1">
              <p>Whipped</p>
              <br/>
              <p>Pure Beauty, Pure Vegan</p>
           
          </ul>
      </div>
      <div>
          <ul className="footer2">
              <li><a href="#"></a>Resources</li>
              <li><a href="#"></a>Pricing</li>
              <li><a href="#"></a>Desktop App</li>
          </ul>
      </div>
      <div>
          <ul className="footer2">
              <li><a href="#"></a>Company</li>
              <li><a href="#"></a>Private Policy</li>
              <li><a href="#"></a>Terms of Service</li>
          </ul>
      </div>
      <div> 
          <ul className="footer2">
              <li><a href="#"></a>Social</li>
              <li><a href="#"></a>X/Twitter</li>
              <li><a href="#"></a>Discord</li>
          </ul>
        </div>
    </div>
  )
}

export default Footer