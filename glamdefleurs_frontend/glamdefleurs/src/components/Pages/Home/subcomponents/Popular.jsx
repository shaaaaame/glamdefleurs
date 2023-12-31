import React from 'react'
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import FlowerService from '../../../../services/FlowerService';

function PopularItem(props){
  const i = props.item;

  return (
    <Link className='link popular-item' to={'flowers/' + i.id}>
      <img className='popular-item-img' src={i.media[0].image} loading='lazy'/>
      <h3 className='popular-item-name'>{i.name}</h3>
      <h3 className='popular-item-price'>{i.require_contact ? i.price_text : "$" + i.default_variant.price}</h3>
    </Link>
   
  )
}

function Popular() {
  const queryClient = useQueryClient();
  const {data: items, isLoading, isError, error} = useQuery(['flowers', {popular : true}], FlowerService.getPopularFlowers, {staleTime: Infinity})

  if(isLoading || isError) return <></>

  return (
    <div className='popular'>
      <div className='popular-title-container'>
        <div className='popular-title-bgImg'></div>
        <div className='popular-title-wrapper'>
          <h1 className='popular-title'>POPULAR</h1>
        </div>
      </div>
      <div className='popular-content'>
        {items.map((i) => <PopularItem key={i.id} item={i} />)}
      </div>
    </div>
  )
}

export default Popular