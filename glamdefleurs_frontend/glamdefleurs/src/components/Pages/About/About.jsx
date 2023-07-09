import React from 'react';
import Header from '../../global/Header';
import Footer from '../../global/Footer';

import rose from '../../../assets/img/about-rose.png';
import oksana from '../../../assets/img/Oksana.jpg';
import './About.css';

function About() {
  const classesTaken = [
    "Nicolae Agop (Moldova)",
    "Elena Butko (Kyiv)",
    "Sigitas Kaminskas (Lithuania)",
    "Pim van den Akker (Netherlands)",
    "Olga Sharova (Moscow)",
    "Marina Bulatova (Moscow)"
  ]

  return (
    <>
    <Header />
    <div className='about'>

      <div className='about-main'>
        <h3 className='about-title'>ABOUT</h3>
        <div className='about-wrapper'>
          <div className='about-quote'>A family owned flower shop run by a florist with years of experience and a unique set of skills.</div>
          <img className='about-quote-img' src={rose} alt='rose'/>
          <h3 className='about-sign'>Oksana Shostka</h3>
        </div>
      </div>

      <div className='about-quals'>
        <img src={oksana} alt='oksana' className='about-quals-img'/>
        <div className='about-quals-separator-wrapper'>
          <div className='about-quals-separator'/>
        </div>
        <div className='about-quals-content'>
          <div className='about-quals-wrapper'>
            <h1 className='about-quals-title'>Diploma</h1>
            <div className='about-quals-line'/>
            <ul className='about-quals-list'>
              <li className='about-quals-list-item'>{'Floristu skola A - Ž (Latvia)'}</li>
            </ul>
          </div>
          <div className='about-quals-wrapper'>
            <h1 className='about-quals-title'>Classes</h1>
            <div className='about-quals-line'/>
            <ul className='about-quals-list'>
              {classesTaken.map((c) => <li className='about-quals-list-item'>{c}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default About