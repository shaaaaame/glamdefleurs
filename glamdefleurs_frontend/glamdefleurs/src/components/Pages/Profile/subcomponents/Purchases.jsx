import React, { useEffect, useState } from 'react'
import { useLoaderData } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import FlowerService from '../../../../services/FlowerService';
import CustomerService from '../../../../services/CustomerService';
import ShopService from '../../../../services/ShopService';


function Purchases() {

  const [ orders, setOrders ] = useState([]);
  const queryClient = useQueryClient();

  function PurchaseItem(props){
    const ids = props.items.map(o => o.item);

    const { data: flowers, isLoading } = useQuery(['flowers', { ids: ids }], () => FlowerService.getFlowers(ids), { staleTime: Infinity})

    if(isLoading) return (<div className='purchase-item'>loading...</div>)

    return (
      <div className='purchase-item'>
        <p>order id: {props.order.id}</p>
        <p>purchase date: {props.order.date_created}</p>
        <div className='purchase-units'>
          {flowers.map((f) =>
            <div className='purchase-unit'>
              <img className='purchase-unit-img' src={f.media[0].image}/>
              <h3 className='purchase-unit-title'>{f.name}</h3>
              <h3>x{props.items.find(o => o.item == f.id).quantity}</h3>
            </div>
          )}
        </div>
        <p>total: ${props.order.total}</p>
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

  useEffect(() => {
    const getOrders = async () => {
        const data = await queryClient.fetchQuery({
            queryKey: ['customer'],
            queryFn: CustomerService.getCustomerData,
            staleTime: Infinity
        })

        const order_data = await queryClient.fetchQuery({
            queryKey: ['orders'],
            queryFn: () => ShopService.getOrders(data.id),
            staleTime: Infinity
        })

        setOrders(order_data.data)
    }

    getOrders()

  }, [])

  return (
    <div className='profile-details'>
        <h1 className='profile-title'>purchases</h1>
        {orders.length > 0 ? orders.map((order) => {
          return <PurchaseItem items={order.items} order={order}/>
        }) : <NoPurchases />}
    </div>
  )
}

export default Purchases