import React, { useContext, useState } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button.jsx';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceItem.css';
const PlaceItem = (props) => {
   const auth = useContext(AuthContext);
   const [showMap, setShowMap] = useState(false);
   const [showConfirmModal, setShowConfirmModal] = useState(false);

   const openModalHandler = () => {
      setShowMap(true);
   };

   const closeModalHandler = () => {
      setShowMap(false);
   };

   const openDeleteHandler = () => {
      setShowConfirmModal(true);
   };
   const closeDeleteHandler = () => {
      setShowConfirmModal(false);
   };
   const confirmDeleteHandler = () => {
      console.log('deleted');
      setShowConfirmModal(false);
   };

   return (
      <React.Fragment>
         <Modal
            show={showMap}
            onCancel={closeModalHandler}
            header={props.address}
            contentClass="place-item__modal-content"
            footerClass="place-item__modal-actions"
            footer={<Button onClick={closeModalHandler}>CLOSE</Button>}>
            <div className="map-container">
               <Map center={props.coordinates} zoom={16} />
            </div>
         </Modal>
         <Modal
            show={showConfirmModal}
            onCancel={closeDeleteHandler}
            header="Warning"
            footerClass="place-item__modal-actions"
            footer={
               <React.Fragment>
                  <Button inverse onClick={closeDeleteHandler}>
                     Cancel
                  </Button>
                  <Button danger onClick={confirmDeleteHandler}>
                     Delete
                  </Button>
               </React.Fragment>
            }>
            <p>
               Are You sure you want to delete this Place? this action can not
               be undone thereafter
            </p>
         </Modal>
         <li className="place-item">
            <Card className="place-item__content">
               <div className="place-item__image">
                  <img src={props.image} alt="props.title" />
               </div>
               <div className="place-item__info">
                  <h2>{props.title}</h2>
                  <h3>{props.address}</h3>
                  <p>{props.description}</p>
               </div>
               <div className="place-item__actions">
                  <Button inverse onClick={openModalHandler}>
                     View on Map
                  </Button>
                  {auth.isLoggedIn && (
                     <Button to={`/places/${props.id}`}>Edit</Button>
                  )}
                  {auth.isLoggedIn && (
                     <Button danger onClick={openDeleteHandler}>
                        Delete
                     </Button>
                  )}
               </div>
            </Card>
         </li>
      </React.Fragment>
   );
};

export default PlaceItem;
