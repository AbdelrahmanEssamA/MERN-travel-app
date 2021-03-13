import React, { useEffect, useState } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook';

import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import UsersList from '../components/UsersList';
const Users = () => {
   const { isLoading, error, sendRequest, clearError } = useHttpClient();
   const [loadedUser, setLoadedUser] = useState([]);

   useEffect(() => {
      const fetchUser = async () => {
         try {
            const responseData = await sendRequest(
               'http://localhost:5000/api/users/'
            );
            setLoadedUser(responseData.users);
         } catch (err) {}
      };
      fetchUser();
   }, [sendRequest]);

   return (
      <React.Fragment>
         <ErrorModal error={error} onClear={clearError} />
         {isLoading && (
            <div className="center">
               <LoadingSpinner />
            </div>
         )}
         {!isLoading} <UsersList items={loadedUser} />
      </React.Fragment>
   );
};

export default Users;
