import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight } from 'react-feather';
import { CSSTransition } from 'react-transition-group';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PhoneInput from 'react-phone-number-input';

import Footer from '../../global/Footer';
import './Login.css';
import AuthService from '../../../services/AuthService';
import http from '../../../http-common';
import { Navigate, redirect, useNavigate } from 'react-router-dom';
import useToken from '../../auth/useToken';
import { RegionDropdown } from 'react-country-region-selector';
import { useContext } from 'react';
import { AdminContext } from '../../../context/AdminContext';

function Login() {
    const [isLoggingIn, setIsLoggingIn] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768)
    const { isStaff, setIsStaff } = useContext(AdminContext)

    const toggleIsLoggingIn = () => setIsLoggingIn(!isLoggingIn);
    const toggleIsCreating = () => setIsCreating(!isCreating);
    const loginRef = useRef(null);
    const createRef = useRef(null);

    // logic variables (login / signup)
    const [ username, setUsername ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ cfmPassword, setCfmPassword] = useState("");
    const [ dob, setDob ] = useState();
    const [ phoneNumber, setPhoneNumber] = useState();
    const [ firstName, setFirstName ] = useState();
    const [ lastName, setLastName ] = useState();

    const [ address1, setAddress1 ] = useState();
    const [ address2, setAddress2 ] = useState();
    const [ city, setCity ] = useState();
    const [ province, setProvince ] = useState();
    const [ postcode, setPostcode] = useState();


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

    // login mutation and submit
    const loginMutation = useMutation({
        mutationFn: (data) => {
            return AuthService.postLogin(data)
        },
        onSuccess: (res) => {
            setToken(res.data.token);
            http.defaults.headers['Authorization'] = "Token " + res.data.token;
            triggerSuccessToast("Login successful!");

            if (res.data.is_superuser || res.data.is_staff){
                setIsStaff(true);
                // TODO: change url
                window.open("http://localhost:8000/admin")
            }
        },
        onError: (error) => {
            triggerErrorToast(error.response.data.error_message);
        }
    })
    const handleLoginSubmit = (e) => {
        e.preventDefault();
        const data = {
            username: username,
            password: password
        }
        loginMutation.mutate(data);
    }

    // signup mutation and submit
    const signupMutation = useMutation({
        mutationFn: (data) => {
            return AuthService.postSignUp(data)
        },
        onSuccess: (res) => {
            triggerSuccessToast("Create account successful!");
            toggleIsCreating();
        },
        onError: (error) => {
            triggerErrorToast(error.response.data.error_message);
        }
    })
    const handleSignupSubmit = (e) => {
        e.preventDefault();

        // form validation rules
        const isValid = (
            password === cfmPassword
        )
        if (!isValid){
            triggerErrorToast("Passwords aren't matching!")
            return
        }

        const data = {
            username: username,
            email: email,
            password: password,
            first_name: firstName,
            last_name: lastName,
            address: {
                address1: address1,
                address2: address2,
                city: city,
                province: province,
                postcode: postcode
            },
            phone_number: phoneNumber,
            dob: dob,
        }
        signupMutation.mutate(data);
    }

    const signupForm = (
            <form className='signup-form' onSubmit={handleSignupSubmit}>
                <table className='signup-table'>
                    <tr>
                        <td className='signup-form-cell'>
                            <div className='signup-form-item'>
                                <label>username</label>
                                <input className='signup-form-text' type='text' name='username' value={username} onChange={e => setUsername(e.target.value)} required />
                            </div>

                        </td>
                        <td className='signup-form-cell'>
                            <div className='signup-form-item'>
                                <label>email</label>
                                <input className='signup-form-text' type='email' name='email' value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                        </td>
                        <td className='signup-form-cell'>
                            <div className='signup-form-item'>
                                <label>password</label>
                                <input className='signup-form-text' type='password' name='password' value={password} onChange={e => setPassword(e.target.value)} required />
                            </div>
                        </td>
                        <td className='signup-form-cell'>
                            <div className='signup-form-item'>
                                <label>confirm password</label>
                                <input className='signup-form-text' type='password' name='cfm-password' value={cfmPassword} onChange={e => setCfmPassword(e.target.value)} required />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className='signup-form-cell'>
                            <div className='signup-form-item'>
                                <label>first name</label>
                                <input className='signup-form-text' type='text' name='firstName' value={firstName} onChange={e => setFirstName(e.target.value)} required />
                            </div>
                        </td>
                        <td className='signup-form-cell'>
                            <div className='signup-form-item'>
                                <label>last name</label>
                                <input className='signup-form-text' type='text' name='lastName' value={lastName} onChange={e => setLastName(e.target.value)} required />
                            </div>
                        </td>
                        <td className='signup-form-cell' colSpan={2}>
                            <div className='signup-form-item'>
                                <label>phone number</label>
                                <PhoneInput
                                    name='phone'
                                    required
                                    international
                                    defaultCountry='CA'
                                    placeholder='Enter phone number'
                                    className='signup-form-text'
                                    value={phoneNumber}
                                    onChange={setPhoneNumber}
                                />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <div className='signup-form-item'>
                                <label>address line 1</label>
                                <input className='signup-form-text' type='text' name='address1' value={address1} onChange={e => setAddress1(e.target.value)} required />
                            </div>
                        </td>
                        <td colSpan={2}>
                            <div className='signup-form-item'>
                                <label>address line 2</label>
                                <input className='signup-form-text' type='text' name='address2' value={address2} onChange={e => setAddress2(e.target.value)} required />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div className='signup-form-item'>
                                <label>city</label>
                                <input className='signup-form-text' type='text' name='city' value={city} onChange={e => setCity(e.target.value)} required />
                            </div>
                        </td>
                        <td>
                            <div className='signup-form-item'>
                                <label>province</label>
                                <RegionDropdown className='signup-form-text' required valueType="short" country="Canada" value={province} onChange={val => setProvince(val)} />
                            </div>
                        </td>
                        <td>
                            <div className='signup-form-item'>
                                <label>postcode</label>
                                <input className='signup-form-text' type='text' name='postcode' value={postcode} onChange={e => setPostcode(e.target.value)} required />
                            </div>
                        </td>
                        <td className='signup-form-cell'>
                            <div className='signup-form-item'>
                                <label>date of birth</label>
                                <input className='signup-form-text' type='date' name='dob' value={dob} onChange={e => setDob(e.target.value)} required />
                            </div>
                        </td>
                    </tr>
                </table>
                <input className='login-form-button' type='submit' value='create account' />
            </form>
        )


    const signupFormMobile = (
            <form className='signup-form' onSubmit={handleSignupSubmit}>
                <table className='signup-table'>
                    <tr className='signup-form-row'>
                        <td className='signup-form-cell'>
                            <div className='signup-form-item'>
                                <label>username</label>
                                <input className='signup-form-text' type='text' name='username' value={username} onChange={e => setUsername(e.target.value)} required />
                            </div>

                        </td>
                        <td className='signup-form-cell'>
                            <div className='signup-form-item'>
                                <label>email</label>
                                <input className='signup-form-text' type='text' name='email' value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                        </td>

                    </tr>
                    <tr>
                        <td className='signup-form-cell'>
                            <div className='signup-form-item'>
                                <label>password</label>
                                <input className='signup-form-text' type='password' name='password' value={password} onChange={e => setPassword(e.target.value)} required />
                            </div>
                        </td>
                        <td className='signup-form-cell'>
                            <div className='signup-form-item'>
                                <label>confirm password</label>
                                <input className='signup-form-text' type='password' name='cfm-password' value={cfmPassword} onChange={e => setCfmPassword(e.target.value)} required />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className='signup-form-cell'>
                            <div className='signup-form-item'>
                                <label>first name</label>
                                <input className='signup-form-text' type='text' name='firstName' value={firstName} onChange={e => setFirstName(e.target.value)} required />
                            </div>
                        </td>
                        <td className='signup-form-cell'>
                            <div className='signup-form-item'>
                                <label>last name</label>
                                <input className='signup-form-text' type='text' name='lastName' value={lastName} onChange={e => setLastName(e.target.value)} required />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className='signup-form-cell' colSpan={2}>
                            <div className='signup-form-item'>
                                <label>phone number</label>
                                <PhoneInput
                                    name='phone'
                                    required
                                    international
                                    defaultCountry='CA'
                                    placeholder='Enter phone number'
                                    className='signup-form-text'
                                    value={phoneNumber}
                                    onChange={setPhoneNumber}
                                />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <div className='signup-form-item'>
                                <label>address line 1</label>
                                <input className='signup-form-text' type='text' name='address1' value={address1} onChange={e => setAddress1(e.target.value)} required />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <div className='signup-form-item'>
                                <label>address line 2</label>
                                <input className='signup-form-text' type='text' name='address2' value={address2} onChange={e => setAddress2(e.target.value)} required />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div className='signup-form-item'>
                                <label>city</label>
                                <input className='signup-form-text' type='text' name='city' value={city} onChange={e => setCity(e.target.value)} required />
                            </div>
                        </td>
                        <td>
                            <div className='signup-form-item'>
                                <label>province</label>
                                <RegionDropdown className='signup-form-text' required valueType="short" country="Canada" value={province} onChange={val => setProvince(val)} />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div className='signup-form-item'>
                                <label>postcode</label>
                                <input className='signup-form-text' type='text' name='postcode' value={postcode} onChange={e => setPostcode(e.target.value)} required />
                            </div>
                        </td>
                        <td className='signup-form-cell'>
                            <div className='signup-form-item'>
                                <label>date of birth</label>
                                <input className='signup-form-text' type='date' name='dob' value={dob} onChange={e => setDob(e.target.value)} required />
                            </div>
                        </td>
                    </tr>
                </table>
                <input className='login-form-button' type='submit' value='create account' />
            </form>
        )

    useEffect(() => {
        function handleResize(){
            if(window.innerWidth < 768){
                setIsMobileView(true);

            }else{
                setIsMobileView(false);
            }
        }

        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    })

    if(token) return <Navigate to='/profile/account' />

    return (
        <>
            <div className='login'>
                <div className='login-wrapper'>
                    {/* login form */}
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
                            <form className='login-form' onSubmit={handleLoginSubmit}>
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

                    {/* signup form */}
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
                                {isMobileView ? signupFormMobile : signupForm}
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