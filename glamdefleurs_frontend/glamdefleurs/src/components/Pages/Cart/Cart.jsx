import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../../../context/CartContext';


import './Cart.css';
import Header from '../../global/Header';
import Footer from '../../global/Footer';
import { ChevronRight, Minus, Plus } from 'react-feather';
import { useNavigate } from 'react-router-dom';

// requires id, name, img, price and quantity
function CartItem({item, quantity}){
    const flower = item.flower;
    const variant = item.variant;
    const { addToCart, removeFromCart, deleteFromCart } = useContext(CartContext);


    return (
        <tr className='cart-item'>
            <td className='cart-item-img-row'><img className='cart-item-img' src={flower.media[0].image} alt={flower.name} /></td>
            <td>
                <div className='cart-item-title'>
                    <h3>{flower.name} {flower.has_variants ? `(${variant.name})` : ""}</h3>
                    <button className='cart-item-btn' onClick={() => deleteFromCart(variant.id)}>remove <ChevronRight /></button>
                </div>
            </td>
            <td>
                <div className='cart-item-quantity'>
                    <button className='cart-item-quantity-btn' onClick={() => addToCart(variant.id, 1)}><Plus /></button>
                    <h3>{quantity}</h3>
                    <button className='cart-item-quantity-btn' onClick={() => removeFromCart(variant.id, 1)}><Minus /></button>
                </div>
            </td>
            <td>
                <div className='cart-item-total'>
                    <h3>${variant.price * quantity}</h3>
                </div>
            </td>
        </tr>
    )
}

function CartItemMobile({item, quantity}){
    const flower = item.flower;
    const variant = item.variant;

    const {addToCart, removeFromCart, deleteFromCart } = useContext(CartContext);

    return (<tr className='cart-item-mobile'>
            <td className='cart-item-img-row'><img className='cart-item-img' src={flower.media[0].image} alt={flower.name} /></td>
            <td>
                <div className='cart-item-mobile-title'>
                    <h3>{flower.name} {flower.has_variant ? `(${variant.name})` : ""}</h3>
                    <h3>${Number(variant.price * quantity).toFixed(2)}</h3>
                </div>
                <button className='cart-item-btn' onClick={() => deleteFromCart(variant.id)}>remove <ChevronRight /></button>
                <div className='cart-item-mobile-quantity'>
                    <button className='cart-item-quantity-btn' onClick={() => removeFromCart(variant.id, 1)}><Minus size={20} /></button>
                    <div className='cart-item-quantity-num'>
                        <h3>{quantity}</h3>
                    </div>
                    <button className='cart-item-quantity-btn' onClick={() => {addToCart(variant.id, 1)}}><Plus size={20}/></button>

                </div>
            </td>
        </tr>
    )
}

function Cart() {

    const { cartItems, isCartEmpty, getItemsInCart, getSubtotal } = useContext(CartContext);
    const [ showMobileCart, setShowMobileCart ] = useState(window.innerWidth < 780);
    const navigate = useNavigate();

    // handle transition to mobile cart on small devices
    useEffect(() => {

        function handleResize(){
            if(window.innerWidth < 780){
                setShowMobileCart(true)
            }else{
                setShowMobileCart(false);
            }
        }
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    })

    function DisplayCartItems(){
        let cartItemDisplay = [];
        const items = getItemsInCart()
        
        for(const item of items){
            cartItemDisplay.push(<CartItem
                item={item}
                quantity={cartItems[item.variant.id]}
            />)
        }

        return (
            <table className='cart-content'>
                <tr className='cart-content-header-wrapper'>
                    <th className='cart-content-header'><span /></th>
                    <th className='cart-content-header'><span /></th>
                    <th className='cart-content-header'><h3>quantity</h3></th>
                    <th className='cart-content-header'><h3>total</h3></th>
                </tr>
                {cartItemDisplay}
            </table> 
        )
    }

    function DisplayMobileCartItems(){
        let cartItemDisplay = [];
        const items = getItemsInCart()
        
        for(const item of items){
            cartItemDisplay.push(<CartItemMobile
                item={item}
                quantity={cartItems[item.variant.id]}
            />)
        }

        return (
            <table className='cart-content'>
                {cartItemDisplay}
            </table> 
        )
    }

    // handle if cart empty
    function DisplayEmptyCart(){

        return (
        <div className='cart-empty'>
            <h1>your cart is empty!</h1>
            <h3>click on a product and select add to cart to see it here :{')'}</h3>
        </div>) 
    } 

    const handleSubmit = () => {
        navigate("/checkout/delivery")
    }

    return (
        <>
            <div className='cart'>
                <div className='cart-header'>
                    <h3 className='cart-title'>YOUR CART</h3>
                </div>
                {isCartEmpty() ?
                <DisplayEmptyCart />:
                <>
                    {showMobileCart ? <DisplayMobileCartItems /> : <DisplayCartItems />}
                    <div className='cart-footer'>
                        <h3 className='cart-footer-subtotal'>subtotal: ${getSubtotal()}</h3>
                        <button className='cart-order-btn' onClick={handleSubmit}>checkout</button>
                    </div>
                </> }
                
            </div>
            <Footer />
        </>
    )
}

export default Cart