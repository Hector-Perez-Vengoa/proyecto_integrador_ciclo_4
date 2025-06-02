// src/components/profile/ProfileWelcome.jsx
import React, { useState, useEffect } from 'react';
import { User, Star, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { WELCOME_BENEFITS } from '../../constants/profile';

const ProfileWelcome = ({ isProfileIncomplete, onStartSetup, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (isProfileIncomplete) {
      setIsVisible(true);
      const timer = setTimeout(() => setStep(1), 500);
      return () => clearTimeout(timer);
    }
  }, [isProfileIncomplete]);

  const handleStartSetup = () => {
    setStep(2);
    setTimeout(() => {
      onStartSetup();
      setIsVisible(false);
    }, 300);
  };

  const handleDismiss = () => {
    setStep(3);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div 
        className={`
          bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center transform transition-all duration-500
          ${step >= 1 ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
          ${step === 2 ? 'scale-105' : ''}
          ${step === 3 ? 'scale-95 opacity-0' : ''}
        `}
      >
        {/* Icono animado */}
        <div className="relative mb-6">
          <div 
            className={`
              w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 
              flex items-center justify-center transform transition-all duration-700
              ${step >= 1 ? 'rotate-0 scale-100' : 'rotate-180 scale-50'}
            `}
          >
            <User className="w-10 h-10 text-white" />
          </div>
          
          {/* Partículas flotantes */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <Sparkles
                key={i}
                className={`
                  absolute w-4 h-4 text-yellow-400 transform transition-all duration-1000
                  ${step >= 1 ? 'opacity-100' : 'opacity-0'}
                `}
                style={{
                  top: `${20 + Math.sin(i) * 30}%`,
                  left: `${30 + Math.cos(i) * 40}%`,
                  animationDelay: `${i * 200}ms`,
                  animation: step >= 1 ? 'float 3s ease-in-out infinite' : 'none'
                }}
              />
            ))}
          </div>
        </div>

        {/* Contenido */}
        <div 
          className={`
            transform transition-all duration-500 delay-300
            ${step >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¡Bienvenido! 🎉
          </h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            Tu perfil está incompleto. Completa tu información para obtener una mejor experiencia
            y aprovechar al máximo todas las funcionalidades.
          </p>          {/* Lista de beneficios */}
          <div className="text-left mb-8 space-y-2">
            {WELCOME_BENEFITS.map((benefit, index) => (
              <div 
                key={index}
                className={`
                  flex items-center text-sm text-gray-700 transform transition-all duration-300
                  ${step >= 1 ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}
                `}
                style={{ transitionDelay: `${500 + index * 100}ms` }}
              >
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                {benefit}
              </div>
            ))}
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={handleDismiss}
              className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Ahora no
            </button>
            
            <button
              onClick={handleStartSetup}
              className="
                flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg
                hover:from-blue-600 hover:to-purple-700 transform transition-all duration-200
                hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                flex items-center justify-center gap-2 font-medium
              "
            >
              Configurar ahora
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>      {/* Estilos CSS para animaciones */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
};

export default ProfileWelcome;
