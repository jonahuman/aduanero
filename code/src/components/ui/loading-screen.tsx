import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  duration?: number;
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Cargando...", 
  duration = 2000,
  onComplete 
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 200); // Pequeña pausa antes de completar
          return 100;
        }
        return prev + (100 / (duration / 50)); // Actualizar cada 50ms
      });
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-6 max-w-sm mx-auto px-6">
        {/* Spinner circular */}
        <div className="relative">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
        </div>

        {/* Mensaje */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">{message}</h3>
          <p className="text-sm text-gray-600">Por favor espere...</p>
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Porcentaje */}
        <div className="text-sm font-medium text-blue-600">
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
};