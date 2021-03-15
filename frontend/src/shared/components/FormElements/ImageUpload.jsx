import React from 'react';

import './ImageUpload.css';

const ImageUpload = (props) => {
   return (
      <div className="fom-control">
         <input type="file" id={props.id} style={{ display: 'none' }} />
      </div>
   );
};

export default ImageUpload;
