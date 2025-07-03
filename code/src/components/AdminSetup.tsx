import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useNotification, Notification } from './ui/notification';
import { apiService } from '../services/api';
import { Settings, Trash2, UserPlus, CheckCircle, XCircle } from 'lucide-react';
import type { SetupStatus, CreateAdminRequest } from '../types';

export const AdminSetup: React.FC = () => {
  const [setupStatus, setSetupStatus] = useState<SetupStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [adminData, setAdminData] = useState<CreateAdminRequest>({
    email: 'admin@aduana.gov',
    password: 'admin123',
    firstName: 'Administrador',
    lastName: 'Sistema',
  });
  const { notifications, showSuccess, showError, removeNotification } = useNotification();

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async (): Promise<void> => {
    try {
      const status = await apiService.checkSetup();
      setSetupStatus(status);
    } catch (error: any) {
      showError('No se pudo verificar el estado del sistema');
    }
  };

  const handleCreateAdmin = async (): Promise<void> => {
    if (!adminData.email.includes('@')) {
      showError('El correo debe contener una @');
      return;
    }

    if (adminData.password.length < 6) {
      showError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await apiService.createAdmin(adminData);
      showSuccess('¡Administrador creado correctamente!');
      await checkSetupStatus();
    } catch (error: any) {
      showError(error.message || 'No se pudo crear el administrador');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (): Promise<void> => {
    if (!confirm('¿Estás seguro de eliminar el administrador?')) {
      return;
    }

    setLoading(true);
    try {
      await apiService.deleteAdmin(adminData.email);
      showSuccess('Administrador eliminado correctamente');
      await checkSetupStatus();
    } catch (error: any) {
      showError(error.message || 'No se pudo eliminar el administrador');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateAdminRequest, value: string): void => {
    setAdminData(prev => ({ ...prev, [field]: value }));
  };

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
      
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mb-4">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-xl font-bold">Configuración de Administrador</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Estado del Sistema */}
          {setupStatus && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Estado del Sistema</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Base de datos conectada:</span>
                  <div className="flex items-center space-x-1">
                    {setupStatus.database_connected ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm ${setupStatus.database_connected ? 'text-green-600' : 'text-red-600'}`}>
                      {setupStatus.database_connected ? 'Conectada' : 'Desconectada'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Administrador existe:</span>
                  <div className="flex items-center space-x-1">
                    {setupStatus.admin_exists ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm ${setupStatus.admin_exists ? 'text-green-600' : 'text-red-600'}`}>
                      {setupStatus.admin_exists ? 'Sí' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Formulario de Admin */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Datos del Administrador</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico *
                </label>
                <Input
                  type="email"
                  value={adminData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="admin@aduana.gov"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña *
                </label>
                <Input
                  type="password"
                  value={adminData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombres
                </label>
                <Input
                  value={adminData.firstName || ''}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Nombres del administrador"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellidos
                </label>
                <Input
                  value={adminData.lastName || ''}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Apellidos del administrador"
                />
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              onClick={handleCreateAdmin}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {setupStatus?.admin_exists ? 'Actualizar Admin' : 'Crear Admin'}
            </Button>
            
            {setupStatus?.admin_exists && (
              <Button
                onClick={handleDeleteAdmin}
                disabled={loading}
                variant="outline"
                className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar Admin
              </Button>
            )}
          </div>

          <div className="text-xs text-gray-500 text-center">
            Esta herramienta es solo para desarrollo y configuración inicial
          </div>
        </CardContent>
      </Card>
    </>
  );
};