import React, { useState, useRef } from 'react';
import { ChevronRight } from 'react-feather';
import { CSSTransition } from 'react-transition-group';
import { ToastContainer, toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Header from '../../global/Header';
import Footer from '../../global/Footer';
import './Login.css';
import AuthService from '../../../services/AuthService';
import http from '../../../http-common';
import { Navigate, redirect, useNavigate } from 'react-router-dom';
import useToken from '../../auth/useToken';
import CustomerService from '../../../services/CustomerService';

function Login() {
    const [isLoggingIn, setIsLoggingIn] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate();

    const toggleIsLoggingIn = () => setIsLoggingIn(!isLoggingIn);
    const toggleIsCreating = () => setIsCreating(!isCreating);
    const loginRef = useRef(null);
    const createRef = useRef(null);

    // logic variables (login / signup)
    const [ username, setUsername ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ cfmPassword, setCfmPassword] = useState("");
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
    const { token, setToken } = useToken();

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (data) => {
            return AuthService.postLogin(data)
        },
        onSuccess: (res) => {
            setToken(res.data.token);
            http.defaults.headers['Authorization'] = "Token " + res.data.token;
            triggerSuccessToast("Login successful!");
            navigate('/profile/account/');
        },
        onError: (error) => {
            triggerErrorToast(error.response.data.non_field_errors[0]);
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            username: username,
            password: password
        }
        mutation.mutate(data);
    }

    if(token) return <Navigate to='/profile/account' />

    return (
        <>
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
                            <form className='login-form' onSubmit={handleSubmit}> 
                                <div className='login-form-item'>
                                    <label>username or email</label>
                                    <input 
                                        className='login-form-text' 
                                        type='text' 
                                        name='username' 
                                        value={username} 
                                        onChange={(e) => setUsername(e.target.value)}
                                        required 
                                        />
                                </div>
                                <div className='login-form-item'>
                                    <label>password</label>
                                    <input 
                                        className='login-form-text' 
                                        type='password' 
                                        name='password' 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required />
                                </div>
                                <input className='login-form-button' type='submit' value='login'/>
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
                                    <label>username</label>
                                    <input className='login-form-text' type='text' name='username' value={username} onChange={e => setUsername(e.target.value)} required />
                                </div>
                                <div className='login-form-item'>
                                    <label>email</label>
                                    <input className='login-form-text' type='text' name='email' value={email} onChange={e => setEmail(e.target.value)} required />
                                </div>
                                <div className='login-form-item'>
                                    <label>password</label>
                                    <input className='login-form-text' type='text' name='password' value={password} onChange={e => setPassword(e.target.value)} required />
                                </div>
                                <div className='login-form-item'>
                                    <label>confirm password</label>
                                    <input className='login-form-text' type='text' name='cfm-password' value={cfmPassword} onChange={e => setCfmPassword(e.target.value)}required />
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