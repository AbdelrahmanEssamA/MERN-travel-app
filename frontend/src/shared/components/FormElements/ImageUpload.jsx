import React, { useRef, useState, useEffect } from 'react';

import Button from './Button';
import './ImageUpload.css';

const ImageUpload = (props) => {
   const [file, setFile] = useState();
   const [previewUrl, setPreviewUrl] = useState();
   const [isValid, setIsValid] = useState();

   useEffect(() => {
      if (!file) {
         return;
      }
      const fileReader = new FileReader();
      fileReader.onload = () => {
         setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
   }, [file]);

   const filePickerRef = useRef();
   const pickImageHandler = () => {
      filePickerRef.current.click();
   };
   const pickedHandlerFunc = (e) => {
      let pickedFile;
      let fileIsValid = isValid;
      if (e.target.files || e.target.files.length !== 0) {
         pickedFile = e.target.files[0];
         setFile(pickedFile);
         setIsValid(true);
         fileIsValid = true;
      } else {
         setIsValid(false);
         fileIsValid = false;
      }
      props.onInput(props.id, pickedFile, fileIsValid);
   };
   return (
      <div className="fom-control">
         <input
            type="file"
            id={props.id}
            style={{ display: 'none' }}
            accept=".jpg,.png,.jepg"
            ref={filePickerRef}
            onChange={pickedHandlerFunc}
         />
         <div className={`image-upload ${props.center && 'center'} `}>
            <div className="image-upload__preview">
               {previewUrl ? (
                  <img src={previewUrl} alt="Preview" />
               ) : (
                  <p>Please select an image</p>
               )}
            </div>
            <Button type="button" onClick={pickImageHandler}>
               Pick Image
            </Button>
         </div>
      </div>
   );
};

export default ImageUpload;
