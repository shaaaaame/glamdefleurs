import React, { createContext, useEffect, useState } from 'react';
import FlowerService from '../services/FlowerService';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const CartContext = createContext(null);

export function CartContextProvider(props) {
    // cart items stores items in the form of productId : quantity
    // if quantity == 0, item not in cart
    const [ cartItems, setCartItems ] = useState({});
    const [ items, setItems ] = useState([])
    const [ subtotal, setSubtotal ] = useState(0);
    const queryClient = useQueryClient();

    useEffect(() => {
        
        if(!isCartEmpty()){
            const ids = Object.keys(cartItems);

            FlowerService.getFlowers(ids)
            .then(res => {
                setItems(res);
            })
            .catch(err => console.log(err))
        }

    }, [cartItems])

    const getSubtotal = () => {
        let total = 0;

        for(const item of items){
            total += Number(item.price) * cartItems[item.id];
        }

        return total.toFixed(2);
    }

    const addToCart = (id, quantity) => {
        if (cartItems[id]){
            setCartItems((prev => ({
            ...prev,
            [id]: prev[id] + quantity
            })))
        }else{
            setCartItems((prev) => ({
                ...prev,
                [id] : quantity
            }))
        }
    }

    const removeFromCart = (id, quantity) => {
        setCartItems((prev => ({
            ...prev,
            [id]: Math.max(prev[id] - quantity)
        })))

        if(cartItems[id] <= 0) {
            delete cartItems[id];
        }
    }

    const isCartEmpty = () => {
        return Object.keys(cartItems).length <= 0;
    }

    const getIdsInCart = () => {
        return Object.keys(cartItems)
    }

    const getItemsInCart = () => items;

    const contextValue = { cartItems, addToCart, removeFromCart, isCartEmpty, getSubtotal, getItemsInCart};

    return (
        <CartContext.Provider value={contextValue}>{props.children}</CartContext.Provider>
    )
}
