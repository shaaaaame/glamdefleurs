import React from 'react'
import { useState } from 'react';
import "../Profile.css"
import { useLoaderData } from 'react-router-dom'

function Address() {
  const user = useLoaderData();

  const [ address, setAddress ] = useState(user.address);

  const handleSubmit = (e) =>{
    e.preventDefault();

    // TODO: send PUT request to update user information
  }

  return (
    <div className='profile-details'>
        <h1 className='profile-title'>address</h1>
        <form className='address-form'>
          <label className='address-form-label'>address: </label>
          <textarea className='address-form-text' value={address} onChange={(e) => setAddress(e.target.value)}/>
          <input className='profile-info-submit' type='submit' value='submit' />
        </form>
    </div>
  )
}

export default Address