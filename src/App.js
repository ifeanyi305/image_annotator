import React, { useState } from 'react';
import Annotator from "./pages/Annotator";

function App() {
  const [imageFiles, setImageFiles] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  return (
    <div className="App">
      <Annotator
        imageFiles={imageFiles}
        setImageFiles={setImageFiles}
        imagesPreview={imagesPreview}
        setImagesPreview={setImagesPreview}
      />
    </div>
  );
}

export default App;
