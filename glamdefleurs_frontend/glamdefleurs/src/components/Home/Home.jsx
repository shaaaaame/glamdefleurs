import React from 'react';
import Header from '../global/Header';
import Hero from './subcomponents/Hero';
import Categories from './subcomponents/Categories';
import Popular from './subcomponents/Popular';
import Footer from '../global/Footer';


import './Home.css';

function Home() {
  return (
    <>
      <Header />
      <div className='home'>
          <Hero/>
          <Categories/>
          <Popular/>
      </div>
      <Footer />
    </>
    
  )
}

export default Home