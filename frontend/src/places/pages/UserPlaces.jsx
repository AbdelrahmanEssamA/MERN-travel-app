import React from 'react';
import PlaceList from '../components/PlaceList';
import { useParams } from 'react-router-dom';
const PLACES = [
   {
      id: 'p1',
      title: 'La Sagrada Familia',
      image:
         'https://images.adsttc.com/media/images/5cff/5ec5/284d/d16d/6a00/1111/large_jpg/1.jpg?1560239805',
      address: 'Carrer de Mallorca, 401, 08013 Barcelona, Spain',
      location: { lat: 41.4030154, lng: 2.1729796 },
      creator: 'u1',
      description:
         'The Basílica de la Sagrada Família, is a large unfinished Roman Catholic minor basilica in the Eixample district of Barcelona, Catalonia, Spain',
   },
   {
      id: 'p1',
      title: 'Adams Lookout',
      image:
         'http://www.workthere.com/media/773567/kantoorruimte-huren-amsterdam-adam-tower-6.jpg',
      address: 'Overhoeksplein 5, 1031 KS Amsterdam, Netherlands',
      location: { lat: 52.383863, lng: 4.900161 },
      creator: 'u2',
   },
];
const UserPlaces = () => {
   const userID = useParams().userId;
   console.log(userID);
   console.log(PLACES);
   const loadedPlaces = PLACES.filter((place) => place.creator === userID);
   return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
