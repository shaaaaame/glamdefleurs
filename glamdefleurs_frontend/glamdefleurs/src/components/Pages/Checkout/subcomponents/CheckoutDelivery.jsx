import React, { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import GeolocationService from "../../../../services/GeolocationService";
import CustomerService from "../../../../services/CustomerService";
import { RegionDropdown } from "react-country-region-selector";

import '../Checkout.css';
import { useNavigate, useOutletContext } from "react-router-dom";
import useToken from "../../../auth/useToken";
import PhoneInput from "react-phone-number-input";
import { toast } from "react-toastify";
import { REACT_APP_RAPIDAPI_KEY } from "../../../../Config/Config";
import ReactDatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";


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
    const { user, setUser, setShipping, setDeliveryMethod, setDeliveryTime, setSpecialInstructions } = useOutletContext();

    // delivery form data
    // snake case because django uses snake case TT
    const [startDate, setStartDate] = useState(new Date());
    const [ currentDeliveryMethod, setCurrentDeliveryMethod ] = useState("delivery")
    const [ instructions, setInstructions ] = useState("")
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

    // pickup agree state
    const [ agree, setAgree ] = useState(false);

    const handleDeliverySubmit = async (e) => {
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
            queryFn: () => GeolocationService.getDistanceFromOrigin(fullAddress, REACT_APP_RAPIDAPI_KEY)
        })

        setShipping(Number(Math.ceil(distance / 1000)).toFixed(2));
        setUser(user);
        setSpecialInstructions(instructions);
        setDeliveryMethod("delivery");
        setDeliveryTime(startDate);

        if (distance > 70000){
            triggerErrorToast("Sorry, we don't deliver to your area.")
        }else{
            navigate('/checkout/details')
        }

    }

    const handlePickupSubmit = async (e) => {
        e.preventDefault();

        const user = {
            id: id,
            email: email,
            phone_number: phoneNumber,
            first_name: firstName,
            last_name: lastName,
        }

        setUser(user);
        setShipping(0);
        setSpecialInstructions(instructions);
        setDeliveryMethod("pickup");
        setDeliveryTime(startDate);


        navigate('/checkout/details');
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
            <div className="checkout-delivery-selection">
                <button className="checkout-delivery-selection-btn" style={ currentDeliveryMethod == "delivery" ? {backgroundColor: "var(--clr-hl1)"} : {}} onClick={() => setCurrentDeliveryMethod("delivery")}>Delivery</button>
                or
                <button className="checkout-delivery-selection-btn" style={ currentDeliveryMethod == "pickup" ? {backgroundColor: "var(--clr-hl1)"} : {}} onClick={() => setCurrentDeliveryMethod("pickup")}>Pickup</button>
            </div>
            <div  className="checkout-delivery-date">
                <label>
                    Delivery/pickup date
                    <p>
                        {currentDeliveryMethod == "delivery" && "(Delivery will be made as soon as possible on the date. For any additional information, please leave a message at the bottom.)"}
                    </p>
                    <ReactDatePicker
                        className="checkout-delivery-input"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)} />
                </label>
            </div>
            {
                currentDeliveryMethod == "delivery" ?
                <form className="checkout-delivery-form" onSubmit={handleDeliverySubmit}>
                    <table className="checkout-delivery-table">
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
                        <tr>
                            <td colSpan={2} rowSpan={3}>
                                <textarea rows={4} placeholder="special instructions (card text if applicable)" className="checkout-delivery-input checkout-delivery-textarea" value={instructions} onChange={(e) => setInstructions(e.target.value)} />
                            </td>
                        </tr>
                    </table>
                    <div className="checkout-continue-container">
                        <input type="submit" value="continue >" className="checkout-continue-btn"/>
                    </div>
                </form> :
                <div className="checkout-pickup">
                <form classname="checkout-delivery-form" onSubmit={handlePickupSubmit}>
                    <table className="checkout-delivery-table">
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
                            <td colSpan={2} rowSpan={3}>
                                <textarea rows={4} placeholder="special instructions (card text if applicable)" className="checkout-delivery-input checkout-delivery-textarea" value={instructions} onChange={(e) => setInstructions(e.target.value)} />
                            </td>
                        </tr>
                        </table>
                        <p>Pick up address is: <b>2-2385 Fifth Line W, Mississauga ON</b>. </p>
                        <p>Is this acceptable to you?</p>
                        <br />
                        <div className="checkout-pickup-accept">
                            <label>
                                <input
                                type="checkbox"
                                checked={agree}
                                onChange={() => setAgree(!agree)}
                                />
                                Yes
                            </label>
                        </div>
                        <div className="checkout-continue-container">
                            <button type="submit" disabled={!agree} className="checkout-continue-btn">continue {">"}</button>
                        </div>

                    </form>
                </div>
            }
        </div>
    )
}

export default CheckoutDelivery