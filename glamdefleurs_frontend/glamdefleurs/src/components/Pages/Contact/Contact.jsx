import React, { useState } from 'react';
import Header from '../../global/Header';
import Footer from '../../global/Footer';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'

import './Contact.css';
import { useMutation } from '@tanstack/react-query';
import ContactService from '../../../services/ContactService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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

function Contact() {
    const [ name, setName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ phone, setPhone ] = useState("");
    const [ subject, setSubject ] = useState("");
    const [ message, setMessage ] = useState("");
    const [ preferredContact, setPreferredContact ] = useState("email")

    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (form) => {
            return ContactService.postForm(form)
        }
    })

    
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = {
            name: name,
            email: email,
            phone_number: phone,
            subject: subject,
            message: message,
            preferred_contact_method: preferredContact
        }

        mutation.mutate(form);
        triggerSuccessToast("Contact form successfully submitted!")
        navigate("/")
        
    }

    return (
        <>
            <div className='contact'>
                <div className='contact-header'>
                    <h1 className='contact-title'>CONTACT</h1>
                    <h3 className='contact-quote'>we'd love to hear from you!</h3>
                </div>
                <div className='contact-line'/>
                <form className='contact-form' onSubmit={handleSubmit}>
                    <div className='contact-form-wrapper'>
                        <div className='contact-form-item'>
                            <label>name: </label>
                            <input 
                            className='contact-form-box' 
                            type='text' name='name' 
                            required 
                            value={name}
                            onChange={(e) => setName(e.target.value)}/>
                        </div>
                        <div className='contact-form-item'>
                            <label>email address: </label>
                            <input 
                            className='contact-form-box' 
                            type='email'
                            name='email' 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className='contact-form-item'>
                            <label>phone number: </label>
                            <PhoneInput
                                name='phone'
                                international
                                defaultCountry='CA'
                                placeholder='Enter phone number' 
                                className='contact-form-box'
                                value={phone}
                                onChange={setPhone}
                            />
                        </div>
                    </div>
                    <div className='contact-form-msgItem'>
                        <label>subject: </label>
                        <input className='contact-form-box' type='text' name='subject' required value={subject} onChange={(e) => setSubject(e.target.value)}/>
                        <label>message: </label>
                        <textarea className='contact-form-msgBox' name='message' rows={5} required value={message} onChange={(e) => setMessage(e.target.value)}/>
                    </div>
                    <div className='contact-form-method'>
                        <label>preferred contact method: </label>
                        <select className='contact-form-dd' name='preferredContact' value={preferredContact} onChange={(e) => setPreferredContact(e.target.value)}>
                            <option value='email'>email</option>
                            <option value='phone'>phone</option>
                        </select>
                    </div>
                    <input className='contact-form-submit' type='submit' value='submit' />
                </form>
            </div>
            <Footer />
        </>
    )
}

export default Contact