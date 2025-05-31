// src/components/ui/ImageCarousel.jsx
import { useState, useEffect } from 'react';
import login1 from '../../assets/images/Login1.jpg';
import login2 from '../../assets/images/Login2.jpg';
import login3 from '../../assets/images/Login3.jpg';
import login4 from '../../assets/images/Login4.jpg';
import login5 from '../../assets/images/Login5.jpg';
import login6 from '../../assets/images/Login6.jpg';

const ImageCarousel = () => {
  const images = [login1, login2, login3, login4, login5, login6];
  const captions = [
    "Reserva tu espacio de estudio",
    "Planifica tus sesiones académicas",
    "Accede fácilmente a los cubículos",
    "Espacio ideal para tus proyectos",
    "Ambientes colaborativos de estudio",
    "Gestiona tus reservas en tiempo real"
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsAnimating(false);
      }, 600);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="carousel-container">
      <div className="geometric-shape-1 geometric-bg"></div>
      <div className="geometric-shape-2 geometric-bg"></div>
      <div className="geometric-shape-3 geometric-bg"></div>
      <div className="geometric-shape-4 geometric-bg"></div>
      
      {images.map((image, index) => (
        <div
          key={index}
          className={`carousel-slide ${
            index === currentIndex 
              ? 'carousel-slide-active' 
              : 'carousel-slide-inactive'
          }`}
        >
          <img 
            src={image} 
            alt={`Imagen ${index + 1}`} 
            className="w-full h-full object-cover"
          />
        </div>      ))}
      
      <div className="carousel-caption">
        <h3>{captions[currentIndex]}</h3>
        <h2>Sistema de Reserva de Cubículos Tecsup</h2>
      </div>
      
      <div className="carousel-dots">
        {images.map((_, index) => (
          <div 
            key={`dot-${index}`}
            className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;