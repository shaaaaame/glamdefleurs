import React from 'react'
import { useState, useEffect } from 'react';
import "../Profile.css"
import { useQueryClient } from '@tanstack/react-query';
import CustomerService from '../../../../services/CustomerService';
import { useLoaderData } from 'react-router-dom';

function Address() {

  const [ address, setAddress ] = useState();
  const queryClient = useQueryClient();

  const handleSubmit = (e) =>{
    e.preventDefault();
    // TODO: send PUT request to update user information
  }

  useEffect(() => {
      const getUserData = async () => {
          const data = await queryClient.fetchQuery({
              queryKey: ['customer'],
              queryFn: CustomerService.getCustomerData,
              staleTime: Infinity
          })

          setAddress(data.address);
      }

      getUserData();
  }, [])

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