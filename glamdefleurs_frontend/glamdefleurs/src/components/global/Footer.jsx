import React from 'react'
import { Facebook, Instagram, Mail, Phone  } from 'react-feather'
import logo from '../../assets/img/glamdefleurs-logo.png' 

import './Global.css';


function Footer() {
  return (
    <div className='footer'>
         <div className='footer-wrapper'>
            <div className='footer-contact'>
                <p><b>contact:</b></p>

                <div className='footer-contact-item'>
                    <Phone size={30} className='footer-contact-icon'/>
                    <p>+13231231232</p>
                </div>
                <div className='footer-contact-item'>
                    <Mail size={30} className='footer-contact-icon'/>
                    <p>glamdefleurs@gmail.com</p>
                </div>
            </div>
            <div className='footer-socials'>
                <p><b>socials:</b></p>
                <div className='footer-socials-icons'>
                    <Facebook size={30} />
                    <Instagram size={30} />
                </div>
            </div>
            <div className='footer-logo'>
                <img src={logo} alt='logo' className='footer-logo-img'/>
            </div>
         </div>
    </div>
  )
}

export default Footer