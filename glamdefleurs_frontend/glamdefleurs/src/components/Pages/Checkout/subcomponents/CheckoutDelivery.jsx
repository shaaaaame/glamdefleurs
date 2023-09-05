import React, { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import GeolocationService from "../../../../services/GeolocationService";
import CustomerService from "../../../../services/CustomerService";
import { RegionDropdown } from "react-country-region-selector";

import '../Checkout.css';
import { useNavigate, useOutletContext } from "react-router-dom";
import useToken from "../../../auth/useToken";
import PhoneInput from "react-phone-number-input";
import { toast } from "react-toastify";

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
function CheckoutDelivery(){
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { token } = useToken();

    // setUser: sending data back to parent
    // user: get data if back button pressed
    const { user, setUser, setShipping } = useOutletContext();

    // delivery form data
    // snake case because django uses snake case TT
    const [ id, setId ] = useState(user?.id)
    const [ email, setEmail ] = useState(user?.email);
    const [ phoneNumber, setPhoneNumber ] = useState(user?.phone_number);
    const [ firstName, setFirstName ] = useState(user?.first_name);
    const [ lastName, setLastName ] = useState(user?.last_name);

    const [ address1, setAddress1 ] = useState(user?.address.address1);
    const [ address2, setAddress2 ] = useState(user?.address.address2);
    const [ city, setCity ] = useState(user?.address.city);
    const [ province, setProvince ] = useState(user?.address.province);
    const [ postcode, setPostcode] = useState(user?.address.postcode);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = {
            id: id,
            email: email,
            phone_number: phoneNumber,
            first_name: firstName,
            last_name: lastName,
            address:{
                address1: address1,
                address2: address2,
                city: city,
                province: province,
                postcode: postcode
            }
        }
        const fullAddress = address1 + ", " + city + ", " + province;
        const distance = await queryClient.fetchQuery({
            queryKey: ['distance', {address: fullAddress}],
            queryFn: () => GeolocationService.getDistanceFromOrigin(fullAddress)
        })

        setShipping(Number(Math.ceil(distance / 1000)).toFixed(2));
        setUser(user);

        if (distance > 70000){
            triggerErrorToast("Sorry, we don't deliver to your area.")
        }else{
            navigate('/checkout/details')
        }

    }

    useEffect(() => {
        const getUserData = async () => {
            const data = await queryClient.fetchQuery({
                queryKey: ['customer'],
                queryFn: CustomerService.getCustomerData
            })

            setId(data.id);
            setEmail(data.email);
            setPhoneNumber(data.phone_number);
            setFirstName(data.first_name);
            setLastName(data.last_name);

            setAddress1(data.address.address1);
            setAddress2(data.address.address2);
            setCity(data.address.city);
            setProvince(data.address.province);
            setPostcode(data.address.postcode);
        }

        // get user data if they are logged in
        if(token){
            getUserData();
        }

    }, [])

    // if (isLoading) return <h1>loading...</h1>

    return(
        <div className="checkout-delivery">
            <h2 className="checkout-delivery-title"><b>delivery info</b></h2>
            <form className="checkout-delivery-form" onSubmit={handleSubmit}>
                <table>
                    <tr>
                        <td colSpan={2}>
                            <input required placeholder="email" className="checkout-delivery-input" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input required placeholder="first name" className="checkout-delivery-input" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </td>
                        <td>
                            <input required placeholder="last name" className="checkout-delivery-input" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <PhoneInput
                                    name='phone'
                                    required
                                    international
                                    defaultCountry='CA'
                                    placeholder='Enter phone number'
                                    className='checkout-delivery-input'
                                    value={phoneNumber}
                                    onChange={setPhoneNumber}
                                />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <input required placeholder="address line 1" className="checkout-delivery-input" type="text" value={address1} onChange={(e) => setAddress1(e.target.value)} />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <input placeholder="address line 2" className="checkout-delivery-input" type="text" value={address2} onChange={(e) => setAddress2(e.target.value)} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <RegionDropdown required classes="checkout-delivery-input" valueType="short" country="Canada" value={province} onChange={val => setProvince(val)} />
                        </td>
                        <td>
                            <input required placeholder="city" className="checkout-delivery-input" type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <input required placeholder="postcode" className="checkout-delivery-input" type="text" value={postcode} onChange={(e) => setPostcode(e.target.value)} />
                        </td>
                    </tr>
                </table>
                <div className="checkout-continue-container">
                    <input type="submit" value="continue >" className="checkout-continue-btn"/>
                </div>
            </form>
        </div>
    )
}

export default CheckoutDelivery