import { PayPalButtons } from "@paypal/react-paypal-js";
import { CartContext } from "../../../../context/CartContext";
import React, { useState, useEffect, useContext } from "react" ;
import { useNavigate, useOutletContext, Link } from "react-router-dom";
import useToken from "../../../auth/useToken";
import { useMutation } from "@tanstack/react-query";
import '../Checkout.css';

import ShopService from "../../../../services/ShopService";
import CustomerService from "../../../../services/CustomerService";

function CheckoutPayment(){

    const navigate = useNavigate();
    const { cartItems, getSubtotal, getItemsInCart} = useContext(CartContext);
    const { total, shipping, user } = useOutletContext();

    // send order to backend
    const orderMutation = useMutation({
        mutationFn: (data) => {
            return ShopService.createOrder(data)
        },
        // onSuccess: (res) => {
        //     triggerSuccessToast("Order successful!");
        // },
        // onError: (error) => {
        //     if(error.response.status == 500){
        //         triggerErrorToast("An error occured on our side. Please try again later!")
        //     }else{
        //         triggerErrorToast(error.response.data.non_field_errors[0]);
        //     }
        // }
    })

    // async function that returns order id
    const createOrder = (data, actions) => {
        const subtotal = getSubtotal();
        const flower_items = getItemsInCart();

        const items = flower_items.map((i) => {
            return {
                name: i.flower.name + `(${i.variant.name})`,
                quantity: cartItems[i.variant.id],
                unit_amount: {
                    currency_code: "CAD",
                    value: i.variant.price,
                }
            }
        })

        return actions.order.create({
            purchase_units: [
                {
                    items: items,
                    amount: {
                        currency_code: "CAD",
                        value: total,
                        breakdown: {
                            item_total:{
                                currency_code: "CAD",
                                value: subtotal,
                            },
                            shipping: {
                                currency_code: "CAD",
                                value: shipping
                            }
                        }
                    },
                    shipping: {
                        address:{
                            address_line_1: user.address.address1,
                            address_line_2: user.address.address2,
                            admin_area_2: user.address.city,
                            admin_area_1: user.address.province,
                            postal_code: user.address.postcode,
                            country_code: "CA",
                        }
                    }
                }
            ],
            intent: "CAPTURE",
            application_context:{
                shipping_preference: "SET_PROVIDED_ADDRESS"
            }
        })
        .then((orderId) => {
            return orderId;
        })

    }

    const onApprove = (data, actions) => {
        return actions.order.capture().then((details) => {
            const cart = getItemsInCart()

            let items = []

            cart.forEach(i => {
                items.push({
                    item: i.flower.id,
                    variant: i.variant.id,
                    quantity: cartItems[i.variant.id]
                })
            })


            const order_data = {
                payment_id: details.id,
                customer_id: user.id ? user.id : null,
                items: items,
                address: user.address,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone_number: user.phone_number,
                subtotal: getSubtotal(),
                shipping: shipping,
                total: total
            }

            orderMutation.mutate(order_data)
            navigate('/payment_success');
        })
    }

    const onError = (err) => {
        console.log(err);
    }

    return (

            <div className='checkout-payment'>
                <h2 className="checkout-payment-title"><b>payment</b></h2>
                <h3>total: ${total}</h3>
                <PayPalButtons
                    className="checkout-payment-paypal"
                    forceReRender={[cartItems]}
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                />
                <Link className='link checkout-back-btn' to='/checkout/details'>back</Link>
            </div>

    );
}

export default CheckoutPayment