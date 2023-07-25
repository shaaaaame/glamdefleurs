import React from 'react'
import { useContext } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { CartContext } from '../../../../context/CartContext';

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
    <div>Payment Success! Redirecting you...</div>
  )
}

export default PaymentSuccess