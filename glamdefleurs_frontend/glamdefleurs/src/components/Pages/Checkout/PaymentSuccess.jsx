import React from 'react'
import { useContext } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { CartContext } from '../../../context/CartContext';
import pinkRose from '../../../assets/img/pink-rose.png';
import yellowRose from '../../../assets/img/yellow-rose.png';

import './PaymentSuccess.css';

function PaymentSuccess() {
  let location = useLocation();
  const { clearCart } = useContext(CartContext);
  const [ isOnPaymentSuccess, setIsOnPaymentSuccess ] = useState(location.pathname.includes("payment_success"))
  const navigate = useNavigate();

  useEffect(() => {
    setIsOnPaymentSuccess(location.pathname.includes("payment_success"))
  }, [location])

  useEffect(() => {
    setTimeout(() => navigate('/'), 3000);
    clearCart();
  }, [isOnPaymentSuccess])

  return (
    <div className='payment_success'>
      <div className='payment_success-container'>
        <img className='payment_success-pinkRose' src={pinkRose} alt="rose" />
        <h1 className='payment_success-text'>thank you for your purchase!</h1>
        <img className='payment_success-yellowRose' src={yellowRose} alt="rose" />
      </div>
      <h3>redirecting you...</h3>
    </div>
  )
}

export default PaymentSuccess