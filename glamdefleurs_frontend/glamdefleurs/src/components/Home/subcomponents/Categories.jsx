import React, { useState } from 'react';
import Placeholder from '../../../assets/img/Placeholder.jpg';
import { categories } from '../../../external/data';
import { ArrowRightCircle } from 'react-feather';
import { Link } from 'react-router-dom';

function Categories() {

  return (
    <div className='categories'>
      <h1 className='categories-title'>categories</h1>
      <div className='categories-wrapper'>
        <ul className='categories-list'>
          {categories.map((main) => {
            return(
              <li className='categories-item'>
                <img className='categories-item-img' src={Placeholder}/>
                <h3 className='categories-item-title'>{main.title}</h3>
                <div className='categories-item-text-wrapper'>
                  <div className='categories-item-text'>{main.desc}</div>
                </div>
                <Link className='link categories-item-btn' to='/flowers/' state={{ category: main }}><ArrowRightCircle size={30} /></Link>
              </li>)})}
        </ul>
      </div>
    </div>
  )
}

export default Categories