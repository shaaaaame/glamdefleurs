import React, { useState } from 'react';
import Placeholder from '../../../assets/img/Placeholder.jpg';
import categories from '../../../external/categories.json';
import { ArrowRightCircle } from 'react-feather';
import { Link } from 'react-router-dom';

function Categories() {

  return (
    <div className='categories'>
      <h1 className='categories-title'>categories</h1>
      <div className='categories-wrapper'>
        <ul className='categories-list'>
          {categories.map((head) => {
            return(
              <li className='categories-item' key={head.id}>
                <img className='categories-item-img' src={Placeholder}/>
                <h3 className='categories-item-title'>{head.name}</h3>
                <div className='categories-item-text-wrapper'>
                  <div className='categories-item-text'>{head.description}</div>
                </div>
                <Link className='link categories-item-btn' to={`/categories/h/${head.id}`}><ArrowRightCircle size={30} /></Link>
              </li>)})}
        </ul>
      </div>
    </div>
  )
}

export default Categories