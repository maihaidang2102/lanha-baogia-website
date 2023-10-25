import React, { useState } from 'react';
import './SlideShow.scss'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight,faTimes } from '@fortawesome/free-solid-svg-icons'; 

const Slideshow = ({ imageUrls, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageList, setImageList] = useState(imageUrls); 

  const nextSlide = () => {
    if (currentIndex < imageUrls.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="slideshow">
      <div className="close-button" onClick={onClose}>
        <FontAwesomeIcon icon={faTimes} size="2x" color="#1c1b1a" />
      </div>
      <div className="slideshow-content">
        <div className="slide-control" onClick={prevSlide}>
          <FontAwesomeIcon icon={faChevronLeft} size="2x" color="#1c1b1a" />
        </div>
        <img
          src={`https://api.lanha.vn/profiles/icon-img/${imageUrls[currentIndex]}`}
          alt={`Slide ${currentIndex + 1}`}
          className="slide"
        />
        <div className="slide-control" onClick={nextSlide}>
          <FontAwesomeIcon icon={faChevronRight} size="2x" color="#1c1b1a" />
        </div>
      </div> 
      {/* <div className="image-list-container">
        </div> */}

    </div>
       

  );
};

export default Slideshow;
