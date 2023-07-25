import React, { useState, useEffect, useRef, useContext } from 'react';
import { User, ShoppingCart, ChevronDown, Menu, X } from 'react-feather';
import './Global.css';
import { Link, ScrollRestoration } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import CategoryService from '../../services/CategoryService';

function FullMenu(props){
    const { data: categories, isLoading }= useQuery({
        queryKey: ['categories'], 
        queryFn: CategoryService.getCategories,
        staleTime: Infinity
    })

    if (isLoading) return <></>

    return (<div className='header-full_menu'>
    <ul className='header-options'>
        <li className='header-option'><p><Link className='link' to='/'>home</Link></p></li>

        {categories.map((category) => 
        <li className='header-option header-dd'>
            <p>
                <Link className='link' to={`/categories/h/${category.id}`}>{category.name} <ChevronDown size='10px'/></Link>
                <div className='header-dd-menu-wrapper'>
                    <ul className='header-dd-menu'>

                        {category.subcategories.map((sub) => 
                            <li className='header-dd-menu-item'><Link to={`/categories/s/${sub.id}`}>{sub.name}</Link></li>
                        )}

                    </ul>
                </div>
            </p>
            
        </li>)}

        <li className='header-option'><p><Link className='link' to='/about'>about</Link></p></li>
        <li className='header-option'><p><Link className='link' to='/contact'>contact</Link></p></li>
    </ul>
    <ul className='header-icons'>
        <li className='header-icon header-account'><Link className='link' to={localStorage.getItem("auth_token") ? '/profile/account' : '/login'} ><User size='20'/></Link></li>
        <li className='header-icon header-cart'><Link className='link' to='/cart'><ShoppingCart size='20'/></Link></li>
    </ul>
</div>)}

function SideMenu(props){
    const nodeRef = useRef(null);
    const showSideMenu = props.showSideMenu;
    const setShowSideMenu = props.setShowSideMenu;
    const { data: categories, isLoading }= useQuery({
        queryKey: ['categories'], 
        queryFn: CategoryService.getCategories,
        staleTime: Infinity
    })

    if (isLoading) return <></>
    

    return (<CSSTransition nodeRef={nodeRef} in={showSideMenu} timeout={200} unmountOnExit classNames="header-side">
        <div className='header-side_menu' ref={nodeRef}>
            <X className='header-side-close' size={25} onClick={() => setShowSideMenu(false)}/>
            <div className='header-side-icons'>
                <div className='header-side-icon header-account'><Link className='link' to={localStorage.getItem("auth_token") ? '/profile/account' : '/login'}><User size={25}/></Link></div>
                <div className='header-side-icon header-cart'><Link className='link' to='/cart'><ShoppingCart size={25}/></Link></div>
            </div>
            <ul className='header-side-options'>
                
                <SideMenuOption to='/' title='home' onClick={() => setShowSideMenu(false)}/>
                {categories.map((head) =>                             
                    <SideMenuOption to={`/categories/h/${head.id}`} onClick={() => setShowSideMenu(false)} title={head.name}/>
                )}
                <SideMenuOption to='/about' title='about' onClick={() => setShowSideMenu(false)}/>
                <SideMenuOption to='/contact' title='contact' onClick={() => setShowSideMenu(false)}/>
            </ul>
        </div>
    </CSSTransition>)
}

function SideMenuOption(props) {
    const nodeRef = useRef(null);
    const [ isHovering, setIsHovering ] = useState(false);

    return (
        <li onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)} onClick={props.onClick}>
            <CSSTransition nodeRef={nodeRef} in={isHovering} timeout={0} classNames='header-side-option'>
                <Link ref={nodeRef} className='link header-side-option' to={props.to}>{props.title}</Link>
            </CSSTransition>
        </li>
    )
}

function Header() {
    const [ isMenuFull, setIsMenuFull ] = useState(window.innerWidth >= 768);
    const [ showSideMenu, setShowSideMenu ] = useState(false);

    // handle when to change to mobile menu
    useEffect(() => {
        function handleResize(){
            if(window.innerWidth < 768){
                setIsMenuFull(false);
                
            }else{
                setIsMenuFull(true);
                setShowSideMenu(false);
            }
        }

        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    })

    return (
        <div className='header'>
            <div className='header-wrap'>
                <h3 className='header-logo'><Link className='link' to='/'>GLAM DE FLEURS</Link></h3>
                {isMenuFull ? <FullMenu />: <Menu size={25} className='header-menu_btn' onClick={() => setShowSideMenu(true)} />}
                <SideMenu showSideMenu={showSideMenu} setShowSideMenu={setShowSideMenu}/>
            </div>
            <ScrollRestoration />
        </div>
    )
}

export default Header