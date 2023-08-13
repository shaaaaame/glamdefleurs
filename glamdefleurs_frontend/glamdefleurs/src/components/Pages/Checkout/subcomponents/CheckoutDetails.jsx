import React, { useContext } from 'react'
import { CartContext } from '../../../../context/CartContext'
import { Navigate, useOutletContext, Link} from 'react-router-dom';

function CheckoutDetails() {

    // cart info
    const { cartItems, getItemsInCart, getSubtotal } = useContext(CartContext);

    // shipping info
    const { user, shipping, setTotal } = useOutletContext();

    let total = Number(getSubtotal()) + Number(shipping);
    total = total.toFixed(2);
    setTotal(total);

    const items = getItemsInCart();

    if (Object.keys(cartItems).length < 1 || getSubtotal() === 0){
        return <Navigate to="/cart" />
    }

    if (!user || !shipping){
        return <Navigate to="/checkout/delivery" />
    }

    return (
        <div className='checkout-details'>
            <h2><b>details</b></h2>
            <div className='checkout-details-table'>
                {items.map((i) => {
                    return(
                        <div className='checkout-details-row'>
                            <div className='checkout-details-item'>
                                <h3><b >{cartItems[i.id]}</b>x {i.name}</h3>
                            </div>
                            <div className='checkout-details-item-price'>
                                <h3>${i.price}</h3>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className='checkout-details-summary'>
                <div className='checkout-details-summary-item'>
                    <p>subtotal: </p>
                    <p>${getSubtotal()}</p>
                </div>
                <div className='checkout-details-summary-item'>
                    <p>shipping to {user.address.address1} <Link to="/checkout/delivery"><small>[change]</small></Link>: </p> {/* TODO: click to change address */}
                    <p>${shipping}</p>
                </div>
                <div className='checkout-details-summary-item checkout-total'>
                    <h3>total: </h3>
                    <h3>${total}</h3>
                </div>
            </div>
            <div className="checkout-btn-container">
                <Link className='checkout-back-btn link' to='/checkout/delivery'>back</Link>
                <Link className='checkout-continue-btn link' to='/checkout/payment'>continue</Link>
            </div>

        </div>
    )
}

export default CheckoutDetails