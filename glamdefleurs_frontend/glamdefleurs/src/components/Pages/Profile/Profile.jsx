import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import Header from '../../global/Header'
import Footer from '../../global/Footer'
import Account from './subcomponents/Account'
import Purchases from './subcomponents/Purchases'
import Address from './subcomponents/Address'

import './Profile.css'
import { MapPin, ShoppingBag, User } from 'react-feather'
import { Outlet } from 'react-router-dom'

function Profile() {

    // replace when backend implemented


    const SIDE_OPTIONS = [
        { icon: <User />, name: "account" },
        { icon: <MapPin />, name: "address" },
        { icon: <ShoppingBag />, name: "purchases" },
    ]

    function SideBar(props) {
        const location = useLocation();

        function SideOption(props){
            return(
                <Link className={'side-option link ' + props.className} to={`${props.name}/`} >
                    <div className='side-option-icon'>{props.icon}</div>
                    {props.name}
                </Link>
            )
        }

        return (
            <div className='profile-side'>
                {SIDE_OPTIONS.map((so) => <SideOption icon={so.icon} name={so.name} className={location.pathname.includes(so.name) ? "side-option-selected" : "" }/>)}
            </div>
        )
    }

    return (
        <>
            <div className='profile-page'>
                <SideBar />
                <Outlet />
            </div>
            <Footer />
        </>
    )
}

export default Profile