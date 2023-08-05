import { useEffect, useState } from "react";
import PhoneInput from "react-phone-number-input";
import '../Profile.css'
import { useLoaderData, useNavigate, Form } from "react-router-dom";
import useToken from "../../../auth/useToken";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CustomerService from "../../../../services/CustomerService";
import http from "../../../../http-common";

export default function Account(){

    const navigate = useNavigate();
    const { token, removeToken } = useToken();
    const queryClient = useQueryClient();

    const [ username, setUsername ] = useState();
    const [ firstName, setFirstName ] = useState();
    const [ lastName, setLastName ] = useState();
    const [ phoneNumber, setPhoneNumber ] = useState();
    const [ email, setEmail ] = useState();
    const [ dob, setDob ] = useState();

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

    useEffect(() => {
        const getUserData = async () => {
            const data = await queryClient.fetchQuery({
                queryKey: ['customer'],
                queryFn: CustomerService.getCustomerData,
                staleTime: Infinity
            })

            setUsername(data.username);
            setFirstName(data.first_name);
            setLastName(data.last_name);
            setPhoneNumber(data.phone_number)
            setEmail(data.email);
            setDob(data.dob);
        }

        getUserData();
    }, [])

    return (
        <div className='profile-details'>
            <h1 className='profile-title'>account</h1>
            <Form method="update" className='profile-form' onSubmit={handleSubmit}>
                <div className="profile-info">
                    <div className='profile-info-item'>
                        <label>username:</label>
                        <b className="profile-info-username">{username}</b>
                    </div>
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
            </Form>
        </div>
    )
}