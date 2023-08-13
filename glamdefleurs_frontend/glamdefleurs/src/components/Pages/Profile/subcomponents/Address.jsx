import React from 'react'
import { useState, useEffect } from 'react';
import "../Profile.css"
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import CustomerService from '../../../../services/CustomerService';
import { RegionDropdown } from 'react-country-region-selector';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Address() {
  const navigate = useNavigate();

  const [ addressId, setAddressId] = useState("");
  const [ address1, setAddress1 ] = useState();
  const [ address2, setAddress2 ] = useState();
  const [ city, setCity ] = useState();
  const [ province, setProvince ] = useState();
  const [ postcode, setPostcode] = useState();

  const triggerSuccessToast = (success) => toast.success(success,{
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    })

  const triggerErrorToast = (error) => toast.error(error, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    })

  const queryClient = useQueryClient();
  const { mutate, data, isLoading } = useMutation({mutationFn: () => CustomerService.patchCustomerData({
    address: {
      id: addressId,
      address1: address1,
      address2: address2,
      city: city,
      province: province,
      postcode: postcode
    }
  },
  ),
  onSuccess: () => triggerSuccessToast("Change address successful!"),
  onError: (err) => triggerErrorToast(err.message)})



  const handleSubmit = (e) =>{
    e.preventDefault();
    mutate();
    queryClient.invalidateQueries({queryKey: ["customer"]})
    navigate(0);
  }



  useEffect(() => {
      const getUserData = async () => {
          const data = await queryClient.fetchQuery({
              queryKey: ['customer'],
              queryFn: CustomerService.getCustomerData,
              staleTime: Infinity,

          })
          setAddressId(data.address?.id);
          setAddress1(data.address?.address1);
          setAddress2(data.address?.address2);
          setProvince(data.address?.province);
          setCity(data.address?.city);
          setPostcode(data.address?.postcode);

      }

      getUserData();

  }, [])

  return (
    <div className='profile-details'>
        <h1 className='profile-title'>address</h1>
        <form className='address-form' onSubmit={handleSubmit}>
          <table>
            <tr>
              <td colSpan={2}>
                  <div className='address-form-item'>
                      <label>address line 1</label>
                      <input className='address-form-text' type='text' name='address1' value={address1} onChange={e => setAddress1(e.target.value)} required />
                  </div>
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                  <div className='address-form-item'>
                      <label>address line 2</label>
                      <input className='address-form-text' type='text' name='address2' value={address2} onChange={e => setAddress2(e.target.value)} required />
                  </div>
              </td>
            </tr>
            <tr>
                <td>
                    <div className='address-form-item'>
                        <label>city</label>
                        <input className='address-form-text' type='text' name='city' value={city} onChange={e => setCity(e.target.value)} required />
                    </div>
                </td>
                <td>
                    <div className='address-form-item'>
                        <label>province</label>
                        <RegionDropdown className='address-form-text' required valueType="short" country="Canada" value={province} onChange={val => setProvince(val)} />
                    </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className='address-form-item'>
                      <label>postcode</label>
                      <input className='address-form-text' type='text' name='postcode' value={postcode} onChange={e => setPostcode(e.target.value)} required />
                  </div>
                </td>
              </tr>
            </table>
          <input className='profile-info-submit' type='submit' value='submit' />
        </form>
    </div>
  )
}

export default Address