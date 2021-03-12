import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
   VALIDATOR_REQUIRE,
   VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import './NewPlace.css';

const DUMMY_PLACES = [
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
      id: 'p2',
      title: 'Adams Lookout',
      image:
         'http://www.workthere.com/media/773567/kantoorruimte-huren-amsterdam-adam-tower-6.jpg',
      address: 'Overhoeksplein 5, 1031 KS Amsterdam, Netherlands',
      location: { lat: 52.383863, lng: 4.900161 },
      creator: 'u2',
   },
];

const UpdatePlace = () => {
   const [isLoading, setIsLoading] = useState(true);
   const placeId = useParams().placeId;

   const [formState, inputHandler, setFormData] = useForm(
      {
         title: {
            value: '',
            isValid: false,
         },
         description: {
            value: '',
            isValid: false,
         },
      },
      false
   );

   const identifiedPlace = DUMMY_PLACES.find((p) => p.id === placeId);

   useEffect(() => {
      if (identifiedPlace) {
         setFormData(
            {
               title: {
                  value: identifiedPlace.title,
                  isValid: true,
               },
               description: {
                  value: identifiedPlace.description,
                  isValid: true,
               },
            },
            true
         );
      }
      setIsLoading(false);
   }, [setFormData, identifiedPlace]);

   const placeUpdateSubmitHandler = (event) => {
      event.preventDefault();
      console.log(formState.inputs);
   };

   if (!identifiedPlace) {
      return (
         <div className="center">
            <Card className="place-list">
               <h2>Could not find place!</h2>
            </Card>
         </div>
      );
   }

   if (isLoading) {
      return (
         <div className="center">
            <h2>Loading...</h2>
         </div>
      );
   }

   return (
      <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
         <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={formState.inputs.title.value}
            initialValid={formState.inputs.title.isValid}
         />
         <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            initialValue={formState.inputs.description.value}
            initialValid={formState.inputs.description.isValid}
         />
         <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
         </Button>
      </form>
   );
};

export default UpdatePlace;
