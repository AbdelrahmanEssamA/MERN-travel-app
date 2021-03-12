import React from 'react';
import UsersList from '../components/UsersList';
const Users = () => {
   const USERS = [
      {
         id: 'u1',
         name: 'Kate Dennings',
         image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoL4YLnqSW64iOD3YrvOTdgxYEsoWhUUF9zA&usqp=CAU',
         places: 5,
      },
      {
         id: 'u2',
         name: 'GiGi Hadid',
         image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBB8ahwQS7B1cJ4ytsq37t6n9nH66Q2xXdXg&usqp=CAU',
         places: 1,
      },
   ];

   return <UsersList items={USERS} />;
};

export default Users;
