import React, { useState, useRef } from 'react';
import Annotation from 'react-image-annotation';
import image1 from "./image1.png";
import UploadImages from './UploadImages';

const Annotator = ({ imageFiles, setImageFiles, imagesPreview, setImagesPreview }) => {

  const [annotations, setAnnotations] = useState([]);
  const [annotation, setAnnotation] = useState({});
  const [selectedImage, setSelectedImage] = useState(image1);
  const undoStackRef = useRef([]);
  const redoStackRef = useRef([]);

  const style = {
    button: "text-[#fff] bg-[#4ca3dd] py-[2px] px-2 rounded-[5px]",
  }

  const Box = ({ children, geometry, style }) => (
    <div
      style={{
        ...style,
        position: 'absolute',
        left: `${geometry.x}%`,
        top: `${geometry.y}%`,
        height: `${geometry.height}%`,
        width: `${geometry.width}%`,
      }}
    >
      {children}
    </div>
  )

  function renderSelector({ annotation }) {
    const { geometry } = annotation;
    if (!geometry) return null

    return (
      <Box
        geometry={geometry}
        style={{
          border: `solid 2px #E10000`
        }}
      />
    )
  }

  function renderHighlight({ annotation }) {
    const { geometry } = annotation;
    const idIntegerPart = Math.floor(geometry?.height);

    if (!geometry) return null

    return (
      <Box
        key={annotation.data.id}
        geometry={geometry}
        style={{
          border: `solid 3px ${idIntegerPart % 2 !== 0 ? '#E10000' : '#0024E1'}`,
        }}
      />
    )
  }

  // label ui
  function renderContent({ annotation }) {
    const { geometry } = annotation;
    const idIntegerPart = Math.floor(geometry?.height);
    return (
      <div
        key={annotation.data.id}
        style={{
          background: `${idIntegerPart % 2 !== 0 ? '#C60606' : '#0653C6'}`,
          color: 'white',
          paddingRight: 10,
          paddingLeft: 10,
          fontWeight: "bolder",
          fontSize: 15,
          position: 'absolute',
          left: `${geometry.x}%`,
          top: `${geometry.y - 9}%`
        }}
      >
        {annotation.data && annotation.data.text}
      </div>
    )
  }

  function renderEditor (props) {
    const { geometry } = props.annotation
    if (!geometry) return null
  
    return (
      <div
        style={{
          background: 'white',
          borderRadius: 3,
          position: 'absolute',
          left: `${geometry.x}%`,
          top: `${geometry.y + geometry.height}%`,
        }}
        className="p-2 rounded-[10px] mt-[5px]"
      >
        <input
          onChange={e => props.onChange({
            ...props.annotation,
            data: {
              ...props.annotation.data,
              text: e.target.value
            }
          })}
          placeholder="write a description"
          className="block mt-1 p-2 focus:outline-none"
        />
        <button onClick={props.onSubmit} className={`${style.button} m-2`}>Comment</button>
      </div>
    )
  }

  const onChange = (newAnnotation) => {
    setAnnotation(newAnnotation);
  };

  const onSubmit = (newAnnotation) => {
    const { geometry, data } = newAnnotation;

    redoStackRef.current = [];

    setAnnotation({});
    const newAnnotationData = {
      geometry,
      data: {
        ...data,
        id: Math.random(),
        imageId: selectedImage,
      },
    };

    setAnnotations([...annotations, newAnnotationData]);

    undoStackRef.current.push(annotations);
  };

  const handleImageSelection = (index) => {
    setSelectedImage(imagesPreview[index]);
  }

  const handleUndo = () => {
    if (undoStackRef.current.length > 0) {
      const lastAnnotations = undoStackRef.current.pop();
      redoStackRef.current.push([...annotations]);
      setAnnotations(lastAnnotations);
    }
  };

  const handleRedo = () => {
    if (redoStackRef.current.length > 0) {
      const nextAnnotations = redoStackRef.current.pop();
      undoStackRef.current.push([...annotations]);
      setAnnotations(nextAnnotations);
    }
  };

  const applyAnnotationsToNewImage = (previousAnnotations) => {
    return previousAnnotations
      .map(anno => ({
        geometry: anno.geometry,
        data: {
          ...anno.data,
          id: Math.random(),
          imageId: selectedImage,
        }
      }));
  };
  
  const applyAnnotationsToSelectedImage = () => {
    const annotationsForNewImage = applyAnnotationsToNewImage(annotations);
    setAnnotations([...annotations, ...annotationsForNewImage]);
  };

  return (
    <div className="px-4">
      <div className="flex flex-wrap items-start gap-4 justify-evenly">
        <div>
          <UploadImages
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
            imagesPreview={imagesPreview}
            setImagesPreview={setImagesPreview}
          />
        </div>
        <div className="mt-6">
          <p className="text-center text-[20px] font-[600]">Annotate images</p>
          <div className="flex gap-4 justify-center items-center my-4">
            <button className={style.button} onClick={handleUndo} type="button">Undo</button>
            <button className={style.button} onClick={handleRedo} type="button">Redo</button>
            <button className={style.button} onClick={applyAnnotationsToSelectedImage} type="button">Apply all</button>
          </div>
          <div className="w-full md:w-[400px] m-auto cursor-crosshair">
            <Annotation
              src={selectedImage}
              alt="Annotate image"
              annotations={annotations.filter((anno) => anno.data.imageId === selectedImage)}
              value={annotation}
              type={annotation.type}
              className="h-[300px]"
              onChange={onChange}
              onSubmit={onSubmit}
              allowTouch
              renderOverlay={() => null}
              renderSelector={renderSelector}
              renderHighlight={renderHighlight}
              renderContent={renderContent}
              renderEditor={renderEditor}
            />
          </div>
          <div className="mt-[4%] flex flex-wrap gap-4 items-center justify-center mb-4">
            {imageFiles?.map((file, index) => (
              <div key={index} className="h-[70px]">
                <img
                  src={imagesPreview[index]}
                  onClick={() => handleImageSelection(index)}
                  alt={file.name}
                  className="w-[100px] h-full cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Annotator;
