import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import './NavLinks.css';
const NavLinks = () => {
   const auth = useContext(AuthContext);
   console.log(localStorage.getItem('userData'));
   return (
      <ul className="nav-links">
         <li>
            <NavLink to="/" exact>
               All Users
            </NavLink>
         </li>
         {auth.isLoggedIn && (
            <li>
               <NavLink to={`/${auth.userId}/places`}>My Places</NavLink>
            </li>
         )}

         {auth.isLoggedIn && (
            <li>
               <NavLink to="/places/new">Add Place</NavLink>
            </li>
         )}
         {!auth.isLoggedIn && (
            <li>
               <NavLink to="/auth">Authenticate</NavLink>
            </li>
         )}
         {auth.isLoggedIn && (
            <React.Fragment>
               <li className="username">
                  {localStorage.getItem('userData')
                     ? JSON.parse(localStorage.getItem('userData')).name
                     : auth.name}
               </li>

               <li>
                  <button onClick={auth.logout}>Logout </button>
               </li>
            </React.Fragment>
         )}
      </ul>
   );
};

export default NavLinks;
