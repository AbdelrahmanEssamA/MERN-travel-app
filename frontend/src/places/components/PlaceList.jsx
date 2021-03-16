import React from 'react';
import PlaceItem from './PlaceItem';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import './PlaceList.css';
const PlaceList = (props) => {
   if (props.items.length === 0) {
      console.log(props.items.length);
      return (
         <Card className="place-list">
            <h1>No Places Found</h1>
            <Button to="/places/new">Share Places</Button>
         </Card>
      );
   }

   return (
      <ul className="place-list">
         {props.items.map((place) => (
            <PlaceItem
               key={place.id}
               id={place.id}
               image={place.image}
               title={place.title}
               description={place.description}
               address={place.address}
               creatorID={place.creator}
               coordinates={place.location}
               onDelete={props.onDeletePlace}
            />
         ))}
      </ul>
   );
};

export default PlaceList;
