import React, { useState } from 'react';
import './MainNavigation.css';
import './MainHeader';
import MainHeader from './MainHeader';
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';
import { Link } from 'react-router-dom';
import Backdrop from '../UIElements/Backdrop';
const MainNavigation = () => {
   const [drawerIsOpen, setDrawerIsOpen] = useState(false);
   const openDrawer = () => {
      setDrawerIsOpen(true);
   };
   const closeDrawer = () => {
      setDrawerIsOpen(false);
   };
   return (
      <React.Fragment>
         {drawerIsOpen && <Backdrop onClick={closeDrawer} />}

         <SideDrawer show={drawerIsOpen} onClick={closeDrawer}>
            <nav className="main-navigation_drawer-nav">
               <NavLinks />
            </nav>
         </SideDrawer>

         <MainHeader>
            <button
               className="main-navigation__menu-btn"
               onClick={openDrawer}>
               <span />
               <span />
               <span />
            </button>
            <h1 className="main-navigation__title">
               <Link to="/">Travelers</Link>
            </h1>
            <nav className="main-navigation__header-nav">
               <NavLinks />
            </nav>
         </MainHeader>
      </React.Fragment>
   );
};

export default MainNavigation;
