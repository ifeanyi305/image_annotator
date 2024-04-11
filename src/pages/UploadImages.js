import React, { useEffect, useState } from 'react';

const UploadImages = ({ imageFiles, setImageFiles, imagesPreview, setImagesPreview }) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelection = (selectedFiles) => {
    const allowedFileTypes = ['image/png', 'image/jpeg', 'image/bmp'];

    const validFiles = Array.from(selectedFiles).filter((file) =>
      allowedFileTypes.includes(file.type)
    );

    if (validFiles?.length > 0) {
      setIsLoading(true);
      setTimeout(() => {
        setImageFiles(validFiles);
        const imageUrls = validFiles.map((file) => URL.createObjectURL(file));
        setImagesPreview(imageUrls);
        setIsLoading(false);
      }, 4000)
    } else {
      alert('No valid file types selected. Please select PNG, JPEG, or BMP files.');
    }
  };

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;

    if (selectedFiles?.length > 0) {
      const updatedFiles = [...imageFiles, ...selectedFiles];
      handleFileSelection(updatedFiles);
    }
  };

  useEffect(() => {
    return () => {
      imageFiles.forEach((file) => URL.revokeObjectURL(file));
    };
  }, [imageFiles]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const droppedFiles = e.dataTransfer.files;

    if (droppedFiles?.length > 0) {
      const updatedFiles = [...imageFiles, ...droppedFiles];
      handleFileSelection(updatedFiles);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  return (
    <div className="container">
      <p className="upload header">Upload files</p>
      <div
        className={`${isDraggingOver ? 'bg-gray-200' : 'upload_con'}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div>
          {
            isLoading ? (
              <div>
                <p className="">Processing Files...</p>
              </div>
            ) : (<></>)
          }
        </div>
        <p className="info">Drag and Drop images here</p>
        <div className="container2">
          <div className="input_con" >
            <input
              type="file"
              id="ctl"
              accept=".png, .jpeg, .jpg, .bmp"
              multiple
              onChange={handleFileChange}
              style={{
                opacity: 0,
                position: 'absolute',
                zIndex: -1,
                // cursor: 'pointer',
              }}
            />
            <label htmlFor="ctl" className="custom_label">
              Select Files
            </label>
          </div>
          <div className="input_con" >
            <input
              type="file"
              id="ctrl"
              webkitdirectory="true"
              directory=""
              multiple
              className="input"
              onChange={handleFileChange}
              style={{
                opacity: 0,
                position: 'absolute',
                zIndex: -1,
                // cursor: 'pointer',
              }}
            />
            <label htmlFor="ctrl" className="custom_label">
              Select Folder
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadImages;