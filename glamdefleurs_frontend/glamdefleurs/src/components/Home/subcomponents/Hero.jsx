import React from 'react'
import './HomeSubcomponents.css';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <div className='hero'>
        <div className='hero-bgImg-wrapper'>
            <div className='hero-bgImg'></div>
        </div>
        <ul className='hero-wrapper'>
            <li className='hero-title'>GLAM DE FLEURS</li>
            <li className='hero-subtitle'>- feel the blossom -</li>
            <li className='hero-btn'>
                <Link className='hero-btn-txt link' to='/flowers'>shop all</Link>
            </li>
        </ul>
    </div>
  )
}

export default Hero