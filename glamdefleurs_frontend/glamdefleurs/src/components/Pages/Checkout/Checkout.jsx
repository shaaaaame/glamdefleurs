import { PayPalButtons } from "@paypal/react-paypal-js";
import { CartContext } from "../../../context/CartContext";
import React, { useState, useEffect, useContext } from "react" ;
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import useToken from "../../auth/useToken"

import './Checkout.css';
import { useQueryClient } from "@tanstack/react-query";
import CustomerService from "../../../services/CustomerService";

function Checkout() {
    const [ user, setUser ] = useState();
    const [ shipping, setShipping ] = useState();
    const [ tax, setTax ] = useState();
    const [ total, setTotal ] = useState();
    const [ deliveryMethod, setDeliveryMethod ] = useState();
    const [ specialInstructions, setSpecialInstructions ] = useState();
    const [ deliveryTime, setDeliveryTime ] = useState();
    const { isCartEmpty } = useContext(CartContext);
    const queryClient = useQueryClient();
    const { token } = useToken();

    if (isCartEmpty()) {
        return <Navigate to='/cart' />
    }

    return (
        <div className="checkout">
            <div className="checkout-main">
                <Outlet context={{
                    specialInstructions: specialInstructions,
                    setSpecialInstructions: setSpecialInstructions,
                    deliveryTime: deliveryTime,
                    setDeliveryTime: setDeliveryTime,
                    setUser : setUser,
                    deliveryMethod: deliveryMethod,
                    setDeliveryMethod: setDeliveryMethod,
                    user: user,
                    shipping: shipping,
                    setShipping: setShipping,
                    total: total,
                    setTotal: setTotal,
                    tax: tax,
                    setTax: setTax,
                }}/>
            </div>
        </div>
    )
}

export default Checkout