import React from 'react'
import { useLoaderData } from 'react-router-dom';
import FlowerService from '../../../../services/FlowerService';
import { useQuery } from '@tanstack/react-query';

function Purchases() {
  const user = useLoaderData();

  function PurchaseItem(props){
    const { data: flowers, isLoading } = useQuery(['flowers', { ids: props.items }], () => FlowerService.getFlowers(props.items))

    if(isLoading) return (<div className='purchase-item'>loading...</div>)

    return (
      <div className='purchase-item'>
        <div className='purchase-status'>status: {props.status}</div>
        <div className='purchase-units'>
          {flowers.map((f) => {
            <div className='purchase-unit'>
              <img className='purchase-unit-img' />
              <h3 className='purchase-unit-title'>{f.name}</h3>
            </div>
          })}
        </div>
      </div>
    )
  }

  return (
    <div className='profile-details'>
        <h1 className='profile-title'>address</h1>
        {user.orders.map((order) => {

        })}
    </div>
  )
}

export default Purchases