import React, { useState, useContext } from 'react';
import { Minus, Plus, X } from 'react-feather';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';

import { CartContext } from '../../../context/CartContext';
import Header from '../../global/Header'
import './FlowerPage.css';
import FlowerService from '../../../services/FlowerService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import Flowers from './Flowers';

function Variants(props){

    function VariantItem(props){
        const { data: flower, isLoading, error, status } = useQuery({
            queryKey: ['flower', {id: Number(props.id)}], 
            queryFn: () => FlowerService.getFlower(props.id),
            staleTime: Infinity
        });

        if (isLoading){ return(
            <div className='flower-variants-item'>
                -
                -
            </div>
        )}       
        
        return (
            <Link className='flower-variants-item link' to={`/flowers/${flower.id}`}>
                <p className='flower-variants-item-name'>{flower.variant_name}</p>
                ${flower.price}
            </Link>
        )
    }


    return(
        <div className='flower-variants'>
            <h2 className='flower-variants-title'>variants</h2>
            <div className='flower-variants-container'>
                { props.variants.map((id) => {
                    return <VariantItem id={id}/>
                })}
            </div>
        </div>
    )
}

function FlowerPage() {
    const navigate = useNavigate();
    const params = useParams();
    const [ amt, setAmt ] = useState(1);
    const { addToCart } = useContext(CartContext);

    const queryClient = useQueryClient();
    const { data: flower, isLoading, error, status } = useQuery({
        queryKey: ['flower', {id: Number(params.id)}],
        queryFn: () => FlowerService.getFlower(params.id),
        staleTime: Infinity
    });
    const triggerSuccessToast = (success) => toast.success(success,{
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        })


    const handleSubmit = (id, q) => {
        addToCart(id, q);
        triggerSuccessToast("Added item to cart!")
        navigate("/categories/");
    }

    if (isLoading) return (<h1>loading...</h1>)

    return (
        <>
            <div className='flower-detail'>
                <button className='flower-page-backBtn' onClick={() => navigate(`/categories/`)}><X size={30} /></button>  
                <div className='flower-page-img-container'>
                    <img className='flower-page-img' src={flower.media.image} alt={flower.name}/>
                </div>
                <div className='flower-page-wrapper'>
                    <h1 className='flower-page-title'>{flower.name} {flower.variant_name.length != "" && `(${flower.variant_name})`}</h1>
                    <div className='flower-page-horizontal-container'>
                        <h2 className='flower-page-price'>{flower.require_contact ? <div><h2>{flower.price_text}</h2><br /><h3>contact <a href='mailto:glamdefleurs@gmail.com'>glamdefleurs@gmail.com</a> for more information</h3></div>: "$" + flower.price}</h2>
                        {flower.variants.length > 0 && <Variants variants={flower.variants}/>}
                    </div>
                    <p className='flower-page-desc'>{flower.description}</p>

                    {flower.require_contact ?
                    "":
                    <div className='flower-page-amt'>
                        <div className='flower-page-quantity'>
                            <Plus size={30} onClick={() => setAmt(amt + 1)} className='flower-page-quantity-btn'/>
                            {amt}
                            <Minus size={30} onClick={() => setAmt(Math.max(1, amt - 1))} className='flower-page-quantity-btn'/>
                        </div>
                        
                        <button className='flower-page-submit' onClick={() => handleSubmit(flower.id, amt)}>add to cart</button>
                    </div>
                    }

                </div>
            </div>
        </>
        
        
    )
}

export default FlowerPage