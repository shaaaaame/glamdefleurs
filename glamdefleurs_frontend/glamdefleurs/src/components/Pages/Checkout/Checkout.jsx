import { PayPalButtons } from "@paypal/react-paypal-js";
import { CartContext } from "../../../context/CartContext";
import React, { useState, useEffect, useContext } from "react" ;
import { useNavigate } from "react-router-dom";
import { CLIENT_ID } from "../../../Config/Config";

function Checkout(){

    const navigate = useNavigate();
    const { cartItems, getSubtotal, getItemsInCart } = useContext(CartContext);

    // async function that returns order id
    const createOrder = (data, actions) => {
        const subtotal = getSubtotal();
        const flower_items = getItemsInCart();

        const items = flower_items.map((i) => {
            return {
                name: i.name,
                quantity: cartItems[i.id],
                unit_amount: {
                    currency_code: "CAD",
                    value: i.price,
                }
            }
        })

        return actions.order.create({
            purchase_units: [
                {
                    items: items,
                    amount: {
                        currency_code: "CAD",
                        value: subtotal,
                        breakdown: {
                            item_total:{
                                currency_code: "CAD",
                                value: subtotal,
                            }
                        }
                    }
                }
            ]
        })
        .then((orderId) => {
            return orderId;
        })

    }

    const onApprove = (data, actions) => {
        return actions.order.capture().then((details) => {
            const name = details.payer.name.given_name; 
            navigate('/payment_success');
        })
    }

    const onError = (err) => {
        console.log(err);
    }
    
    return (

            <div className='checkout'>
                <PayPalButtons  
                    forceReRender={[cartItems]}
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                />
            </div>

    );
}

export default Checkout