import { useState, useCallback, useEffect } from 'react';

export const useAuth = () => {
   const [username, setUsername] = useState();
   const [token, setToken] = useState(false);
   const [userId, setUserId] = useState();

   const login = useCallback((uid, token, expirationDate, name) => {
      console.log(uid);
      setUsername(name);
      setUserId(uid);
      setToken(token);
      const tokenExpirationDate =
         expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
      localStorage.setItem(
         'userData',
         JSON.stringify({
            userId: uid,
            token,
            expiration: tokenExpirationDate.toString(),
            name,
         })
      );
   }, []);

   const logout = useCallback(() => {
      setToken(null);
      setUserId(null);
      setUsername(null);
      localStorage.removeItem('userData');
   }, []);

   useEffect(() => {
      const storedData = JSON.parse(localStorage.getItem('userData'));
      if (
         storedData &&
         storedData.token &&
         new Date(storedData.expiration) > new Date()
      ) {
         login(
            storedData.userId,
            storedData.token,
            new Date(storedData.expiration),
            storedData.name
         );
      }
   }, [login]);
   return { token, login, logout, userId, username };
};
