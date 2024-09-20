import React from 'react'
import Navbar from '../Navbar'
import Sub from '../Sub'
import '../../App.css'
import CartModal from '../CartModal'
const index = () => {
  return (
    <div className="subpg_wrapper" 
    style={{height:"100%"}}
    >
      <Navbar/>
      <Sub/>
    </div>
  )
}

export default index