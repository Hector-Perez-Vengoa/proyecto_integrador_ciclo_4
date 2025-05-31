import React from 'react';
import Logo from '../assets/logo.png'; // Asegúrate de tener una imagen de logo en esta ruta

const Header = () => {
  return (
    <header className="bg-blue-600 w-screen">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo o título */}

        <img src={Logo} alt="Logo" className="h-8 inline-block" />

        {/* Navegación */}
        <nav>
          <ul className="flex text-white space-x-4 p-4">
            <li><a href="#" className="hover:underline">Inicio</a></li>
            <li><a href="#" className="hover:underline">Acerca de</a></li>
            <li><a href="#" className="hover:underline">Contacto</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;