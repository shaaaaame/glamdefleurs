import React, { useState, useContext, useEffect } from 'react';
import { Minus, Plus, X } from 'react-feather';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';

import { CartContext } from '../../../context/CartContext';
import Header from '../../global/Header'
import './FlowerPage.css';
import FlowerService from '../../../services/FlowerService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import Flowers from './Flowers';

function AddOns(){
    const { data: addons, isLoading} = useQuery(['flowers', {type: 's', id: 'add_ons'}], () => {
        return FlowerService.getFlowersFromSub('add_ons');
    }, {staleTime: Infinity})

    function AddOnItem(props){
        // pass in Flower item
        const flower = props.flower;

        return (
            <Link className='flower-addon-item link' to={`/flowers/${flower.id}`}>
                <img className='flower-addon-img' src={flower.media[0].image} alt={flower.name}/>
                <h3>{flower.name}</h3>
                <h3 className='flower-addon-price'>${flower.require_contact ? flower.price_text : flower.default_variant.price}</h3>
            </Link>
        )
    }

    if (isLoading) return <div></div>

    return (
        <div className='flower-addons'>
            <h1 className='flower-addons-title'>Add a finishing touch.</h1>
            <div className='flower-addons-grid'>
                {addons.map(a => <AddOnItem flower={a}/>)}
            </div>
        </div>
    )
}

function Variants(props){

    function VariantItem(props){
        return (
            <div className={`${props.selected ? 'flower-variants-selected' : "flower-variants-item"}`} onClick={props.handleClick}>
                <p className='flower-variants-item-name'>{props.variant.name}</p>
                ${props.variant.price}
            </div>
        )
    }

    return(
        <div className='flower-variants'>
            <h2 className='flower-variants-title'>variants</h2>
            <div className='flower-variants-container'>
                { props.variants.map((i) => {
                    return <VariantItem variant={i} selected={props.selectedVariant.id === i.id} handleClick={() => props.setSelectedVariant(i)}/>
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
    const [ selectedVariant, setSelectedVariant ] = useState(
        {
            price: "-",
            name: '-',
            id: '-'
        }
    )
    const [ image, setImage ] = useState()

    const { data: flower, isLoading: flowerIsLoading, isSuccess } = useQuery({
        queryKey: ['flower', {id: Number(params.id)}],
        queryFn: () => FlowerService.getFlower(params.id),
        staleTime: Infinity,
        onSuccess: (data) => {
            setSelectedVariant(data.default_variant)

            if (data.default_variant.is_using_flower_image){
                setImage(data.media[0].image)
            }else{
                setImage(data.default_variant.media.image)
            }
        }
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
        navigate(-1);
    }

    useEffect(() => {
        if (!flowerIsLoading){
            setSelectedVariant(flower.default_variant)

            if (flower.default_variant.is_using_flower_image){
                setImage(flower.media[0].image)
            }else{
                setImage(flower.default_variant.media.image)
            }
        }
    }, [])

    useEffect(() => {
        if (selectedVariant.price !== "-"){
            if (selectedVariant.is_using_flower_image){
                setImage(flower.media[0].image)
            }else{
                setImage(selectedVariant.media.image)
            }
        }

    }, [selectedVariant])

    if (flowerIsLoading) return (<h1>loading...</h1>)

    return (
        <div className='flower-page'>
            <div className='flower-detail'>
                <div className='flower-page-img-container'>
                    <img className='flower-page-img' src={image} alt={flower.name}/>
                </div>
                <div className='flower-page-wrapper'>
                    <h1 className='flower-page-title'>{flower.name}</h1>
                    <div className='flower-page-horizontal-container'>
                        <h2 className='flower-page-price'>{flower.require_contact ? <div><h2>{flower.price_text}</h2><br /><h3>contact <a href='mailto:glamdefleurs@gmail.com'>glamdefleurs@gmail.com</a> for more information</h3></div>: `$${selectedVariant.price}` }</h2>
                        {flower.has_variants && <Variants variants={flower.variants} selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant}/>}
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
                        
                        <button className='flower-page-submit' onClick={() => handleSubmit(selectedVariant.id, amt)}>add to cart</button>
                    </div>
                    }
                    <Link className='flower-page-backBtn link' onClick={() => navigate(-1)}><u>{'< back'}</u></Link>
                </div>
            </div>
            {flower.categories.includes("add_ons") ? <></> : <AddOns />}
        </div>


    )
}

export default FlowerPage