import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import '../Profile.css'
import { useLoaderData, useNavigate } from "react-router-dom";
import useToken from "../../../auth/useToken";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CustomerService from "../../../../services/CustomerService";
import http from "../../../../http-common";

export default function Account(){

    const navigate = useNavigate();
    const { removeToken } = useToken();
    const queryClient = useQueryClient();
    const user = useLoaderData();

    const [ firstName, setFirstName ] = useState(user.first_name);
    const [ lastName, setLastName ] = useState(user.last_name);
    const [ phoneNumber, setPhoneNumber ] = useState(user.phone_number);
    const [ email, setEmail ] = useState(user.email);
    const [ dob, setDob ] = useState(user.dob);

    const { mutate, data, isLoading } = useMutation({mutationFn: () => CustomerService.patchCustomerData({
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        email: email,
        dob: dob,
    })})

    const handleSubmit = (e) =>{
        e.preventDefault();
        console.log(dob);
        mutate();

    }

    const handleSignOut = (e) => {
        delete http.defaults.headers.Authorization;
        removeToken();
        queryClient.removeQueries(['customer'])
        navigate('/');
    }

    return (
        <div className='profile-details'>
            <h1 className='profile-title'>account</h1>
            <form className='profile-form' onSubmit={handleSubmit}>
                <div className="profile-info">
                    <div className='profile-info-item'>
                        <label>first name:</label>
                        <input required className='profile-info-input' type='text' name='first_name' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className='profile-info-item'>
                        <label>last name:</label>
                        <input required className='profile-info-input' type='text' name='last_name' value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                    </div>
                    <div className='profile-info-item'>
                        <label>email:</label>
                        <input required className='profile-info-input' type='text' name='email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className='profile-info-item'>
                        <label>phone number:</label>
                        <PhoneInput
                            name='phone'
                            required
                            international
                            defaultCountry='CA'
                            placeholder='Enter phone number' 
                            className='profile-info-input'
                            value={phoneNumber}
                            onChange={setPhoneNumber}
                        />
                    </div>
                    <div className='profile-info-item'>
                        <label>date of birth:</label>
                        <input required className='profile-info-input' type='date' name='dob' value={dob} onChange={(e) => setDob(e.target.value)}/>
                    </div>
                </div>
                <div className="profile-info-submit-buttons">
                    <input className='profile-info-submit' type='submit' value='submit' />
                    <button className="profile-info-sign_out" onClick={handleSignOut}>sign out</button>
                </div>
            </form>
        </div>
    )
}