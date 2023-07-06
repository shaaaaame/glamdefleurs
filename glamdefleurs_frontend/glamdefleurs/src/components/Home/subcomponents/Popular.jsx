import React from 'react'
import Placeholder from '../../../assets/img/Placeholder.jpg';
import { POPULAR_PRODUCTS, PRODUCTS } from '../../../external/products';
import { Link } from 'react-router-dom';

function PopularItem(props){
  const i = props.item;

  return (
    <Link className='link popular-item' to={'flowers/flowerPage/' + i.productId}>
      <img className='popular-item-img' src={i.productImg}/>
      <div className='popular-item-name-wrapper'>
        <h3 className='popular-item-name'>{i.productName}</h3>
        <h3 className='popular-item-name'>${i.productPrice}</h3>
      </div>
    </Link>
   
  )
}

function Popular() {
  let items = []

  POPULAR_PRODUCTS.forEach((k) => items.push(PRODUCTS[k]));

  return (
    <div className='popular'>
      <div className='popular-title-container'>
        <div className='popular-title-bgImg'></div>
        <div className='popular-title-wrapper'>
          <h1 className='popular-title'>POPULAR</h1>
        </div>
      </div>
      <div className='popular-content'>
        {items.map((i) => <PopularItem item={i} />)}
      </div>
    </div>
  )
}

export default Popular