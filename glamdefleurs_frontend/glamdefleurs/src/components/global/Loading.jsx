import React from 'react';
import { useIsFetching, useQuery } from '@tanstack/react-query';

import rose from '../../assets/img/rose.svg'
import './Global.css'
import { useState } from 'react';
import { usePayPalScriptReducer } from '@paypal/react-paypal-js';

function Loading() {
    const isFetching = useIsFetching();
    const [{ isPending }] = usePayPalScriptReducer();
    return (
        isFetching || isPending ? 
        <div className='loading'>
            <img src={rose} alt='rose' className='loading-rose'/>
        </div> : 
        null
    )
}

export default Loading