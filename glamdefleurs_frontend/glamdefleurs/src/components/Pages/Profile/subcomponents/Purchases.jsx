import React from 'react'
import { useLoaderData } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import FlowerService from '../../../../services/FlowerService';
import CustomerService from '../../../../services/CustomerService';

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

  function NoPurchases(){
    return (
      <div className='purchases-none'>
        <h2>no purchases yet!</h2>
      </div>
    )
  }

  return (
    <div className='profile-details'>
        <h1 className='profile-title'>purchases</h1>
        {user.length > 0 ? user.orders.map((order) => {

        }) : <NoPurchases />}
    </div>
  )
}

export default Purchases