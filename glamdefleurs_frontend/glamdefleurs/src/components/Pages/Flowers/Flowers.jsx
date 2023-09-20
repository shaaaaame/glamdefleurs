import React, { useContext, useEffect, useRef, useState } from 'react';
import Header from '../../global/Header';
import Footer from '../../global/Footer';

import './Flowers.css';
import { Link, useParams } from 'react-router-dom';
import FlowerService from '../../../services/FlowerService';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import CategoryService from '../../../services/CategoryService';
import { Filter } from 'react-feather';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';


function FlowerItem(props) {

  return (
    <Link className='flowers-item link' to={"/flowers/" + props.flower.id}>
      <div className='flower-item-img-container'>
        <LazyLoadImage className='flowers-item-img' width={'100%'} height={'20em'} style={{border: '1px solid var(--clr-dark)'}}src={props.flower.media[0].image} alt='flower-img' effect='blur' />
      </div>
      <div className='flowers-item-name-wrapper'>
        <h3 className='flowers-item-name'>{props.flower.name}</h3>
        <h3 className='flowers-item-price'>{props.flower.require_contact ? props.flower.price_text : "$" + props.flower.default_variant.price}</h3>
      </div>
    </Link>
  )
}

function FlowerCatalog(props) {
  const flowers = props.flowers;

  if(flowers.length === 0) return (<h2> no flowers yet! check back later.</h2>)

  return (
  <div className='flowers-content'>
    {flowers.map((i) => <FlowerItem flower={i}/> )}
  </div>)
}

function Flowers() {
  const params = useParams()
  const queryClient = useQueryClient();

  // stores id of dropdown
  const [ head, setHead] = useState();
  const [ sub, setSub ] = useState();

  const [ search, setSearch ] = useState("");
  const [ searchResults, setSearchResults ] = useState([])

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  }

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
    }, {staleTime: Infinity})

  // query for category specifics
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

  // query for all categories
  const { data : fullCategories, isLoading: isFullLoading } = useQuery(['categories'], CategoryService.getCategories, { onSuccess: (data) => {
    setHead(data[0].id);
    setSub(data[0].subcategories[0].id)
  }})

  if ((params.id && categoryIsLoading) || flowersIsLoading || isFullLoading) return (<h1>loading...</h1>)
  if (flowers.isError) return <h1>Error loading flowers: {flowersError.request.data}</h1>

  const handleHeadChange = (e) => {
    setHead(e.target.value);

    const headcategory = fullCategories.find(element => element.id === e.target.value)
    setSub(headcategory.subcategories[0].id);
  }




  return (
    <>
      <div className='flowers'>
        <div className='flowers-header'><h1>{ category && category.name ? category.name : "all flowers" }</h1></div>
        <h3>search by category:</h3>
        <div className='flowers-subheader'>
          <div className='flowers-category-selectors-container'>
            <select className='flowers-head-category-selector' onChange={handleHeadChange} value={head}>
              {fullCategories.map(fc => <option value={fc.id}>{fc.name}</option>)}
            </select>
            <select className='flowers-sub-category-selector' onChange={(e) => setSub(e.target.value)} value={sub}>
              {fullCategories.map(fc => {
                if(fc.id === head){
                  const subOptions = fc.subcategories.map(sc => <option value={sc.id}>{sc.name}</option>)
                  return subOptions
                }
                else{
                  return
                }
              })}
            </select>
            <Link className='link flowers-category-selector-btn' to={`/categories/s/${sub}`}><Filter /></Link>
          </div>
          <input className='flowers-search' type='text' placeholder='search' onChange={handleSearch} value={search}/>

        </div>


        <FlowerCatalog flowers={flowers.filter((f) => {
      return f.name.toLowerCase().includes(search.toLowerCase())
    })} />
      </div>
      <Footer />
    </>
  )
}

export default Flowers