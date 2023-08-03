import React, { useContext, useEffect, useRef, useState } from 'react';
import Header from '../../global/Header';
import Footer from '../../global/Footer';

import './Flowers.css';
import { useLocation, Outlet, Link, useParams } from 'react-router-dom';
import FlowerService from '../../../services/FlowerService';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import CategoryService from '../../../services/CategoryService';


function FlowerItem(props) {

  return (
    <Link className='flowers-item link' to={"/flowers/" + props.id}>
      <img className='flowers-item-img' src={props.src}/>
      <div className='flowers-item-name-wrapper'>
        <h3 className='flowers-item-name'>{props.name}</h3>
        <h3 className='flowers-item-price'>${props.price}</h3>
      </div>
    </Link>
  )
}

function FlowerCatalog(props) {
  const flowers = props.flowers;

  // TODO: add a better no flowers screen
  if(flowers.length === 0) return (<h1> no flowers yet! check back later.</h1>)

  return (
  <div className='flowers-content'>
    {flowers.map((i) => <FlowerItem id={i.id} src={i.photo} name={i.name} price={i.price}/> )}
  </div>)
}

function Flowers() {
  const params = useParams()
  const queryClient = useQueryClient()

  // query for flower list
  const { 
    isLoading: flowersIsLoading,
    isError: flowersIsError, 
    data: flowers, 
    error: flowersError} = useQuery(['flowers', params.id ? {type: params.type, id: params.id} : {type: params.type}], () => {
      if(params.type === 'h'){
        return FlowerService.getFlowersFromHead(params.id);
      }
      else if (params.type === 's'){
        return FlowerService.getFlowersFromSub(params.id);
      }else{
        return FlowerService.getAll();
      }
    })

  // query for category 
  const { 
    isLoading: categoryIsLoading,
    isError: categoryIsError, 
    data: category, 
    error: categoryError,
    status: categoryStatus
   } = useQuery(params.id ? ['categories', {id: params.id} ] : ['categories'], () => {
    if(params.type === 'h'){
      return CategoryService.getHeadCategory(params.id)
    }else if(params.type === 's'){
      return CategoryService.getSubCategory(params.id)
    }else{
      return null;
    }
  }, { enabled: !!params.id, staleTime: Infinity })

  if ((params.id && categoryIsLoading) || flowersIsLoading) return (<h1>loading...</h1>)

  if (flowers.isError) return <h1>Error loading flowers: {flowersError.request.data}</h1>

  return (
    <>
      <div className='flowers'>
        <div className='flowers-header'>{ category && category.name ? category.name : "all flowers" }</div>
        <Outlet />
        <FlowerCatalog flowers={flowers} />
      </div>
      <Footer />
    </>
  )
}

export default Flowers