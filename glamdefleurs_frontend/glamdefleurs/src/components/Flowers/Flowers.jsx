import React, { useContext, useEffect, useRef, useState } from 'react';
import Header from '../global/Header';
import Footer from '../global/Footer';

import './Flowers.css';
import { useLocation, Outlet, Link, useParams } from 'react-router-dom';
import FlowerService from '../../services/FlowerService';
import { CategoryContext } from '../../context/CategoryContext';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import CategoryService from '../../services/CategoryService';


function FlowerItem(props) {

  return (
    <Link className='flowers-item link' to={"/flowers/flowerPage/" + props.id}>
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
  if(!flowers) return (<h1> No flowers yet! Check back later.</h1>)

  return (
  <div className='flowers-content'>
    {flowers.map((i) => <FlowerItem id={i.id} src={i.photo} name={i.name} price={i.price}/> )}
  </div>)
}

function Flowers() {
  const params = useParams()
  const queryClient = useQueryClient()

  const { 
    isLoading: flowersIsLoading,
    isError: flowersIsError, 
    data: flowers, 
    error: flowersError} = useQuery(['flowers', {type: params.type, id: params.id}], () => {
      if(params.type === 'h'){
        return FlowerService.getFlowersFromHead(params.id);
      }
      else{
        return FlowerService.getFlowersFromSub(params.id);
      }
    })

  const { 
    isLoading: categoryIsLoading,
    isError: categoryIsError, 
    data: category, 
    error: categoryError } = useQuery(['categories', {id: params.id}], () => {
    if(params.type === 'h'){
      return CategoryService.getHeadCategory(params.id)
    }else{
      return CategoryService.getSubCategory(params.id)
    }
  })

  if (categoryIsLoading || flowersIsLoading) return (<h1>loading...</h1>)

  return (
    <>
      <Header />
      <div className='flowers'>
        <div className='flowers-header'>{ category.name }</div>
        <Outlet />
        <FlowerCatalog flowers={flowers} />
      </div>
      <Footer />
    </>
  )
}

export default Flowers