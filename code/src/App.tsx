import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Login } from './screens/Login';
import { Dashboard } from './screens/Dashboard';
import { PersonalData } from './screens/PersonalData';
import { DocumentUpload } from './screens/DocumentUpload';
import { History } from './screens/History';
import { LoadingScreen } from './components/ui/loading-screen';

type Screen = 'login' | 'dashboard' | 'personal-data' | 'document-upload' | 'history';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const handleLoginSuccess = () => {
    setLoadingMessage('Accediendo al sistema...');
    setIsLoading(true);
  };

  // Nueva función para manejar el logout
  const handleLogout = () => {
    setLoadingMessage('Cerrando sesión...');
    setIsLoading(true);
    
    // Limpiar datos del usuario
    setUserData(null);
    
    setTimeout(() => {
      setCurrentScreen('login');
      setIsLoading(false);
    }, 1200);
  };

  const handleNavigate = (screen: string) => {
    console.log('Navegando a:', screen);
    
    // Configurar mensaje de carga según el destino
    let message = '';
    switch (screen) {
      case 'personal-data':
        message = 'Preparando formulario de registro...';
        break;
      case 'document-upload':
        message = 'Inicializando carga de documentos...';
        break;
      case 'history':
        message = 'Cargando historial de pasajeros...';
        break;
      default:
        message = 'Cargando...';
    }
    
    setLoadingMessage(message);
    setIsLoading(true);
    
    // Simular tiempo de carga y luego navegar
    setTimeout(() => {
      setCurrentScreen(screen as Screen);
      setIsLoading(false);
    }, 1500);
  };

  const handlePersonalDataNext = (data: any) => {
    console.log('Datos personales guardados:', data);
    setUserData(data);
    setLoadingMessage('Procesando datos personales...');
    setIsLoading(true);
    
    setTimeout(() => {
      setCurrentScreen('document-upload');
      setIsLoading(false);
    }, 1200);
  };

  const handleDocumentUploadNext = (documents: any) => {
    console.log('Documentos subidos:', documents);
    console.log('Datos del usuario:', userData);
    
    setLoadingMessage('Procesando documentos...');
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      alert('¡Documentos procesados exitosamente! Regresando al dashboard...');
      setCurrentScreen('dashboard');
    }, 2000);
  };

  const handleBack = () => {
    console.log('Volviendo desde:', currentScreen);
    
    let message = '';
    let targetScreen: Screen = 'dashboard';
    
    switch (currentScreen) {
      case 'personal-data':
        message = 'Regresando al dashboard...';
        targetScreen = 'dashboard';
        break;
      case 'document-upload':
        message = 'Regresando a datos personales...';
        targetScreen = 'personal-data';
        break;
      case 'history':
        message = 'Regresando al dashboard...';
        targetScreen = 'dashboard';
        break;
      default:
        targetScreen = 'dashboard';
    }
    
    if (message) {
      setLoadingMessage(message);
      setIsLoading(true);
      
      setTimeout(() => {
        setCurrentScreen(targetScreen);
        setIsLoading(false);
      }, 1000);
    } else {
      setCurrentScreen(targetScreen);
    }
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
    if (loadingMessage.includes('Accediendo al sistema')) {
      setCurrentScreen('dashboard');
    }
  };

  const renderScreen = () => {
    console.log('Renderizando pantalla:', currentScreen);
    
    switch (currentScreen) {
      case 'login':
        return <Login onLoginSuccess={handleLoginSuccess} />;
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'personal-data':
        return <PersonalData onNext={handlePersonalDataNext} onBack={handleBack} />;
      case 'document-upload':
        return <DocumentUpload onNext={handleDocumentUploadNext} onBack={handleBack} userData={userData} />;
      case 'history':
        return <History onBack={handleBack} />;
      default:
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <AuthProvider>
      <div className="App">
        {isLoading && (
          <LoadingScreen 
            message={loadingMessage}
            duration={1500}
            onComplete={handleLoadingComplete}
          />
        )}
        {renderScreen()}
      </div>
    </AuthProvider>
  );
}

export default App;