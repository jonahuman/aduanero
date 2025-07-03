import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useNotification, Notification } from '../../components/ui/notification';
import { apiService } from '../../services/api';
import { FileText, Upload, ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

interface DocumentUploadProps {
  onNext: (documents: any) => void;
  onBack: () => void;
  userData?: any;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ onNext, onBack, userData }) => {
  const [documents, setDocuments] = useState({
    passport: null as File | null,
    idCard: null as File | null,
  });
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { notifications, showSuccess, showError, removeNotification } = useNotification();

  const handleFileChange = (type: 'passport' | 'idCard', file: File | null) => {
    setDocuments(prev => ({
      ...prev,
      [type]: file,
    }));
  };

  const handleDragOver = (e: React.DragEvent, type: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(type);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent, type: 'passport' | 'idCard') => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(null);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (validTypes.includes(file.type)) {
        handleFileChange(type, file);
      } else {
        alert('Por favor, seleccione un archivo válido (JPG, PNG o PDF)');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canProceed) return;
    
    setIsLoading(true);
    
    try {
      const uploadPromises = [];
      
      if (documents.passport && userData?.userId) {
        const formData = new FormData();
        formData.append('file', documents.passport);
        formData.append('userId', userData.userId);
        formData.append('type', 'passport');
        formData.append('documentNumber', userData.passportNumber || 'TEMP001');
        formData.append('expirationDate', new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString());
        uploadPromises.push(apiService.uploadDocument(formData));
      }
      
      if (documents.idCard && userData?.userId) {
        const formData = new FormData();
        formData.append('file', documents.idCard);
        formData.append('userId', userData.userId);
        formData.append('type', 'id_card');
        formData.append('documentNumber', userData.idNumber || 'TEMP002');
        formData.append('expirationDate', new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString());
        uploadPromises.push(apiService.uploadDocument(formData));
      }
      
      await Promise.all(uploadPromises);
      showSuccess('¡Excelente! Tus documentos se subieron correctamente');
      
      // Crear registro aduanero automáticamente
      if (userData?.userId) {
        await apiService.processUserRegistration(userData, documents);
        showSuccess('¡Listo! Tu registro está completo');
      }
      
      onNext(documents);
    } catch (error: any) {
      showError(error.message || 'No se pudieron subir los documentos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (type: 'passport' | 'idCard') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileChange(type, file);
      }
    };
    input.click();
  };

  const DocumentUploadArea = ({ 
    type, 
    title, 
    description, 
    file 
  }: { 
    type: 'passport' | 'idCard'; 
    title: string; 
    description: string; 
    file: File | null; 
  }) => (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
        dragOver === type
          ? 'border-blue-400 bg-blue-50 scale-105'
          : file
          ? 'border-green-400 bg-green-50'
          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
      }`}
      onDragOver={(e) => handleDragOver(e, type)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, type)}
      onClick={() => !file && handleFileSelect(type)}
    >
      <div className="space-y-4">
        {file ? (
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
        ) : (
          <Upload className="w-12 h-12 text-gray-400 mx-auto" />
        )}
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        {file ? (
          <div className="space-y-2">
            <p className="text-sm font-medium text-green-700">
              ✓ {file.name}
            </p>
            <p className="text-xs text-gray-500">
              Tamaño: {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleFileChange(type, null);
              }}
            >
              Cambiar archivo
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              Arrastra y suelta tu archivo aquí, o haz clic para seleccionar
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleFileSelect(type);
              }}
            >
              Seleccionar archivo
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const canProceed = documents.passport || documents.idCard;

  return (
    <>
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Subir Documentos
            </CardTitle>
            <CardDescription className="text-gray-600">
              Suba sus documentos de identificación (Pasaporte y/o Cédula)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DocumentUploadArea
                  type="passport"
                  title="Pasaporte"
                  description="Suba una foto clara de su pasaporte"
                  file={documents.passport}
                />
                <DocumentUploadArea
                  type="idCard"
                  title="Cédula de Identidad"
                  description="Suba una foto clara de su cédula"
                  file={documents.idCard}
                />
              </div>

              {!canProceed && (
                <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">
                    Debe subir al menos un documento (Pasaporte o Cédula) para continuar.
                  </span>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">📋 Requisitos de los documentos:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>Formato:</strong> JPG, PNG o PDF</li>
                  <li>• <strong>Tamaño máximo:</strong> 5MB por archivo</li>
                  <li>• <strong>Calidad:</strong> La imagen debe ser clara y legible</li>
                  <li>• <strong>Iluminación:</strong> Evite reflejos o sombras</li>
                  <li>• <strong>Completitud:</strong> Asegúrese de que todo el documento sea visible</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t">
                <div className="text-sm text-gray-600">
                  {documents.passport && documents.idCard 
                    ? '✓ Ambos documentos cargados' 
                    : documents.passport 
                    ? '✓ Pasaporte cargado' 
                    : documents.idCard 
                    ? '✓ Cédula cargada' 
                    : 'Ningún documento cargado'}
                </div>
                <Button
                  type="submit"
                  disabled={!canProceed || isLoading}
                  className={`min-w-[150px] ${
                    canProceed && !isLoading
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? 'Subiendo...' : canProceed ? 'Continuar' : 'Seleccione un documento'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      </div>
    </>
  );
};