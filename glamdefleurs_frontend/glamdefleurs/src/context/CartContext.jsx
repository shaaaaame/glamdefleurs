import React, { createContext, useEffect, useState } from 'react';
import FlowerService from '../services/FlowerService';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const CartContext = createContext(null);

const getDefaultCart = (flowers) => {
    let cartItems = {}
            
    flowers.forEach(f => {
        cartItems[f.id] = 0;
    })

    return cartItems;
}


export function CartContextProvider(props) {
    // cart items stores items in the form of productId : quantity
    // if quantity == 0, item not in cart
    const [ cartItems, setCartItems ] = useState();
    const queryClient = useQueryClient();
    const {isError, isLoading, data: flowers, error, isFetched }= useQuery(['flowers'], FlowerService.getAll)



    useEffect(() => {

        if(!cartItems && isFetched){
            setCartItems(getDefaultCart(flowers))
        }
    }, [])


    const addToCart = (id, quantity) => {
        setCartItems((prev => ({
            ...prev,
            [id]: prev[id] + quantity
        })))
    }

    const removeFromCart = (id, quantity) => {
        setCartItems((prev => ({
            ...prev,
            [id]: Math.max(prev[id] - quantity, 0)
        })))
    }

    const isCartEmpty = () => {
        for(const k in cartItems){
            if (cartItems[k] > 0){
                return false;
            }
        }
        return true;
    }

    const getItemsInCart = () => {
        let items = []

        for(const id in cartItems){
            if(cartItems[id] !== 0){
                items.push(flowers[id])
            }
        }

        return items
    }

    const getSubtotal = () => {
        let subtotal = 0;
        
        for(const k in cartItems){
            subtotal += cartItems[k] * flowers[k].price;
        }


        return subtotal;
    }

    const contextValue = { cartItems, addToCart, removeFromCart, getSubtotal, isCartEmpty, getItemsInCart };

    return (
        <CartContext.Provider value={contextValue}>{props.children}</CartContext.Provider>
    )
}
