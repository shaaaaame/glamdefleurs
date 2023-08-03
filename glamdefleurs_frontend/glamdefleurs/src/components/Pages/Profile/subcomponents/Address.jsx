import React from 'react'
import { useState } from 'react';
import "../Profile.css"
import { useQuery } from '@tanstack/react-query';
import CustomerService from '../../../../services/CustomerService';

function Address() {

  const { data: user, isLoading } = useQuery(['customer'], CustomerService.getCustomerData, {staleTime: Infinity})

  const [ address, setAddress ] = useState(user.address);

  const handleSubmit = (e) =>{
    e.preventDefault();

    // TODO: send PUT request to update user information
  }
  if(isLoading) return <p>loading...</p>

  return (
    <div className='profile-details'>
        <h1 className='profile-title'>address</h1>
        <form className='address-form'>
          <textarea className='address-form-text' value={address} onChange={(e) => setAddress(e.target.value)}/>
          <input className='profile-info-submit' type='submit' value='submit' />
        </form>
    </div>
  )
}

export default Address