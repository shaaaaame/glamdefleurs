import React, { useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CartContext } from '../../context/CartContext';


import './Cart.css';
import Header from '../global/Header';
import Footer from '../global/Footer';
import { ChevronRight, Minus, Plus } from 'react-feather';
import FlowerService from '../../services/FlowerService';

// requires id, name, img, price and quantity
function CartItem({id, name, price, img, quantity}){

    const { addToCart, removeFromCart } = useContext(CartContext);
    

    return (
        <tr className='cart-item'>
            <td className='cart-item-img-row'><img className='cart-item-img' src={img} alt={name} /></td>
            <td>
                <div className='cart-item-title'>
                    <h3>{name}</h3>
                    <button className='cart-item-btn' onClick={() => removeFromCart(id, quantity)}>remove <ChevronRight /></button>
                </div>
            </td>
            <td>
                <div className='cart-item-quantity'>
                    <button className='cart-item-quantity-btn' onClick={() => addToCart(id, 1)}><Plus /></button>
                    <h3>{quantity}</h3>
                    <button className='cart-item-quantity-btn' onClick={() => removeFromCart(id, 1)}><Minus /></button>
                </div>
            </td>
            <td>
                <div className='cart-item-total'>
                    <h3>${price * quantity}</h3>
                </div>
            </td>
        </tr>
    )
}

function CartItemMobile({id, name, price, img, quantity}){

    const {addToCart, removeFromCart } = useContext(CartContext);

    return (<tr className='cart-item-mobile'>  
            <td className='cart-item-img-row'><img className='cart-item-img' src={img} alt={name} /></td>
            <td>
                <div className='cart-item-mobile-title'>
                    <p>{name}</p>
                    <p>${price}</p>
                </div>
                <button className='cart-item-btn' onClick={() => removeFromCart(id, quantity)}>remove <ChevronRight /></button>
                <div className='cart-item-mobile-quantity'>
                    <button className='cart-item-quantity-btn' onClick={() => addToCart(id, 1)}><Plus size={20}/></button>
                    <h3>{quantity}</h3>
                    <button className='cart-item-quantity-btn' onClick={() => removeFromCart(id, 1)}><Minus size={20} /></button>
                </div>
            </td>
        </tr>
    )
}

function Cart() {

    const { cartItems, getSubtotal, isCartEmpty, getItemsInCart } = useContext(CartContext);
    const [ showMobileCart, setShowMobileCart ] = useState(false);


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

    const displayEmptyCart = () =>{

        return (
        <div className='cart-empty'>
            <h1>your cart is empty!</h1>
            <h3>click on a product and select add to cart to see it here :{')'}</h3>
        </div>) 
    } 
    

    const displayCartItems = (cartItems) => {
        let cartItemDisplay = []
        let items = getItemsInCart()

        for(const item of items){
            cartItemDisplay.push(<CartItem
                id={item.id}
                name={item.name}
                price={item.price}
                img={item.photo}
                quantity={cartItems[item.id]}
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

    const displayMobileCartItems = (cartItems) => {
        let cartItemDisplay = []
        const items = getItemsInCart()

        for(const item of items){
            cartItemDisplay.push(<CartItemMobile
                id={item.id}
                name={item.name}
                price={item.price}
                img={item.photo}
                quantity={cartItems[item.id]}
            />)
        }

        return (
            <table className='cart-content'>
                {cartItemDisplay}
            </table> 
        )
    }


    return (
        <>
            <Header />
            <div className='cart'>
                <div className='cart-header'>
                    <h3 className='cart-title'>YOUR CART</h3>
                </div>
                {isCartEmpty() ?
                displayEmptyCart() :
                <>
                    {showMobileCart ? displayMobileCartItems(cartItems) : displayCartItems(cartItems)}
                    <div className='cart-footer'>
                        <h3 className='cart-footer-subtotal'>subtotal: ${getSubtotal()}</h3>
                        <button className='cart-order-btn'>order</button>
                    </div>
                </> }
                
            </div>
            <Footer />
        </>
    )
}

export default Cart