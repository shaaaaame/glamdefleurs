import React, { useState, useContext } from 'react';
import { Minus, Plus, X } from 'react-feather';
import { useNavigate, useParams } from 'react-router-dom';

import { CartContext } from '../../context/CartContext';
import Header from '../global/Header'
import './FlowerPage.css';
import FlowerService from '../../services/FlowerService';
import { useQuery, useQueryClient } from '@tanstack/react-query';

function FlowerPage() {
    const navigate = useNavigate();
    const params = useParams();
    const [ amt, setAmt ] = useState(1);
    const { addToCart } = useContext(CartContext);

    const queryClient = useQueryClient();
    const { data: flower, isLoading, error } = useQuery(['flower', {id: params.id}], () => FlowerService.getFlower(params.id));

    const handleSubmit = (id, q) => {
        addToCart(id, q);
        navigate(-1);
    }

    if (isLoading) return (<h1>loading...</h1>)

    return (
        <>
            <Header />
            <div className='flower-detail'>
                <div className='flower-page'>
                    <button className='flower-page-backBtn' onClick={() => navigate(-1)}><X size={30} /></button>  
                    <img className='flower-page-img' src={flower.photo} alt={flower.name}/>
                    <div className='flower-page-wrapper'>
                        <h1 className='flower-page-title'>{flower.name}</h1>
                        <h2 className='flower-page-price'>${flower.price}</h2>
                        <p className='flower-page-desc'>{flower.description}</p>
                        <div className='flower-page-amt'>
                            <div className='flower-page-quantity'>
                                <Plus size={30} onClick={() => setAmt(amt + 1)} className='flower-page-quantity-btn'/>
                                {amt}
                                <Minus size={30} onClick={() => setAmt(Math.max(1, amt - 1))} className='flower-page-quantity-btn'/>
                            </div>
                            
                            <button className='flower-page-submit' onClick={() => handleSubmit(flower.id, amt)}>add to cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
        
        
    )
}

export default FlowerPage