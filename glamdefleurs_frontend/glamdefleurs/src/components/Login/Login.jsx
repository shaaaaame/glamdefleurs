import React, { useState, useRef } from 'react';
import { ChevronRight } from 'react-feather';
import { CSSTransition } from 'react-transition-group';
import Header from '../global/Header';
import Footer from '../global/Footer';

import './Login.css';

function Login() {
    const [isLoggingIn, setIsLoggingIn] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    const toggleIsLoggingIn = () => setIsLoggingIn(!isLoggingIn);
    const toggleIsCreating = () => setIsCreating(!isCreating);


    const loginRef = useRef(null);
    const createRef = useRef(null);
    

    return (
        <>
            <Header />
            <div className='login'>
                <div className='login-wrapper'>
                    <CSSTransition 
                        nodeRef={loginRef} 
                        in={isLoggingIn} 
                        classNames='login-anim' 
                        timeout={300} appear={true} 
                        unmountOnExit
                        onExited={toggleIsCreating}
                    >
                        <div ref={loginRef} className={'login-content'}>
                            <h1 className='login-title'>login</h1>
                            <form className='login-form'>
                                <div className='login-form-item'>
                                    <label>email</label>
                                    <input className='login-form-text' type='text' name='email' required />
                                </div>
                                <div className='login-form-item'>
                                    <label>password</label>
                                    <input className='login-form-text' type='text' name='password' required />
                                </div>
                                <input className='login-form-button' type='submit' value='login' />
                            </form>
                            <p className='login-create' onClick={toggleIsLoggingIn}>create account<ChevronRight /></p>
                        </div>
                    </CSSTransition>
                    <CSSTransition 
                        nodeRef={createRef} 
                        in={isCreating} 
                        classNames='login-anim' 
                        timeout={300} 
                        appear={true} 
                        unmountOnExit
                        onExited={toggleIsLoggingIn}
                    >
                        <div ref={createRef} className={'login-content'}>
                            <h1 className='login-title'>create account</h1>
                            <form className='login-form'>
                                <div className='login-form-item'>
                                    <label>email</label>
                                    <input className='login-form-text' type='text' name='email' required />
                                </div>
                                <div className='login-form-item'>
                                    <label>password</label>
                                    <input className='login-form-text' type='text' name='password' required />
                                </div>
                                <div className='login-form-item'>
                                    <label>confirm password</label>
                                    <input className='login-form-text' type='text' name='cfm-password' required />
                                </div>
                                <input className='login-form-button' type='submit' value='create account' />
                            </form>
                            <p className='login-create' onClick={toggleIsCreating}>login<ChevronRight /></p>
                        </div>
                    </CSSTransition>
                </div>
            </div>
            <Footer />
        </>
        
    )
}

export default Login