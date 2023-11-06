import React, { createContext, useEffect, useState } from 'react';
import FlowerService from '../services/FlowerService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';


export const CartContext = createContext(null);

export function CartContextProvider(props) {
    // cart items stores items in the form of variant id : quantity
    // if quantity == 0, item not in cart
    const [ cartItems, setCartItems ] = useState({});

    // each item is object with 2 properties: flower and flower variant
    const [ items, setItems ] = useState([])

    const queryClient = useQueryClient();

    useEffect(() => {
        const fetchItems = async () => {
            let arr = []

            for(const id in cartItems){
                const variant = await queryClient.fetchQuery({
                    queryKey: ['flower_variant', {id : Number(id)}],
                    queryFn: () => FlowerService.getFlowerVariant(id),
                    staleTime: Infinity
                })

                const flower = await queryClient.fetchQuery({
                    queryKey: ['flower', {id: variant.flower}],
                    queryFn: () => FlowerService.getFlower(variant.flower),
                    staleTime: Infinity
                })

                arr.push({
                    flower: flower,
                    variant: variant
                });
            }

            setItems(arr);
        }

        fetchItems();

    }, [cartItems])

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
            queryClient.prefetchQuery({
                queryKey: ['flower_variant', {id : id}],
                queryFn: () => FlowerService.getFlowerVariant(id)
            })
        }
    }

    const removeFromCart = (id, quantity) => {
        if(cartItems[id] <= quantity) {
            let temp = {...cartItems};
            delete temp[id];
            setCartItems(temp); 
        }else{
            setCartItems((prev => ({
                ...prev,
                [id]: Math.max(prev[id] - quantity, 0)
            })))
        }
    }

    const deleteFromCart = (id) => {
        let temp = {...cartItems};
        delete temp[id];
        setCartItems(temp);
    }

    const isCartEmpty = () => {
        return Object.keys(cartItems).length <= 0;
    }

    const clearCart = () =>{
        for(const id in cartItems){
            deleteFromCart(id);
        }
    }

    const getSubtotal = () => {

        let total = 0;

        // for(const id in cartItems){
        //     total += Number(queryClient.getQueryData(['flower', {id : id}]).price) * cartItems[id]
        // }

        for(const item of items){
            total += Number(item.variant.price) * cartItems[item.variant.id]
        }

        return total.toFixed(2);
    }

    const getItemsInCart = () => {
        // let items = []

        // for(const id in cartItems){
        //     items.push(queryClient.getQueryData(['flower', {id : id}]))
        // }

        return items
    };

    const contextValue = { cartItems, addToCart, removeFromCart, isCartEmpty, getSubtotal, getItemsInCart, deleteFromCart, clearCart };

    return (
        <CartContext.Provider value={contextValue}>{props.children}</CartContext.Provider>
    )
}
