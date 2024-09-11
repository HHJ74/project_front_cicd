import React from 'react'
import Cart from '../Cart'
import Navbar from '../Navbar'

const index = () => {
  return (
    <div className="cartpage" style={{height:"100vh"}}>
        <Navbar/>
        <Cart/>
    </div>
  )
}

export default index