import React from 'react';
import Header from '../global/Header';
import Footer from '../global/Footer';

import './Contact.css';

function Contact() {
    return (
        <>
            <Header />
            <div className='contact'>
                <div className='contact-header'>
                    <h1 className='contact-title'>CONTACT</h1>
                    <h3 className='contact-quote'>we'd love to hear from you!</h3>
                </div>
                <div className='contact-line'/>
                <form className='contact-form'>
                    <div className='contact-form-wrapper'>
                        <div className='contact-form-item'>
                            <label>name: </label>
                            <input className='contact-form-box' type='text' name='name' required />
                        </div>
                        <div className='contact-form-item'>
                            <label>email address: </label>
                            <input className='contact-form-box' type='text' name='email_address' required />
                        </div>
                        <div className='contact-form-item'>
                            <label>phone number: </label>
                            <input className='contact-form-box' type='text' name='phone_number' required />
                        </div>
                    </div>
                    <div className='contact-form-msgItem'>
                        <label>message: </label>
                        <textarea className='contact-form-msgBox' name='message' rows={5} required />
                    </div>
                    <div className='contact-form-method'>
                        <label>preferred contact method: </label>
                        <select className='contact-form-dd'>
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