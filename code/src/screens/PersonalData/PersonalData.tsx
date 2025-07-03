import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useNotification, Notification } from '../../components/ui/notification';
import { apiService } from '../../services/api';
import { User, ArrowLeft, ArrowRight } from 'lucide-react';

interface PersonalDataProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

export const PersonalData: React.FC<PersonalDataProps> = ({ onNext, onBack }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nationality: '',
    dateOfBirth: '',
    phoneNumber: '',
    address: '',
    passportNumber: '',
    idNumber: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { notifications, showSuccess, showError, removeNotification } = useNotification();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiService.createUser(formData);
      showSuccess('¡Perfecto! Tus datos se guardaron correctamente');
      onNext({ ...formData, userId: response.user.id });
    } catch (error: any) {
      showError(error.message || 'No se pudieron guardar tus datos');
    } finally {
      setIsLoading(false);
    }
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-2xl mx-auto">
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
            <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Registro de Datos Personales
            </CardTitle>
            <CardDescription className="text-gray-600">
              Complete sus datos personales para continuar con el proceso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    Nombres *
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="Ingrese sus nombres"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Apellidos *
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Ingrese sus apellidos"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="nationality" className="text-sm font-medium text-gray-700">
                    Nacionalidad *
                  </label>
                  <Input
                    id="nationality"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Colombiana"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
                    Fecha de Nacimiento *
                  </label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                  Número de Teléfono *
                </label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  placeholder="+57 300 123 4567"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium text-gray-700">
                  Dirección *
                </label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Ingrese su dirección completa"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="passportNumber" className="text-sm font-medium text-gray-700">
                    Número de Pasaporte
                  </label>
                  <Input
                    id="passportNumber"
                    name="passportNumber"
                    value={formData.passportNumber}
                    onChange={handleChange}
                    placeholder="Ej: AB123456"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="idNumber" className="text-sm font-medium text-gray-700">
                    Número de Cédula
                  </label>
                  <Input
                    id="idNumber"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    placeholder="Ej: 12345678"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 min-w-[150px]"
                >
                  {isLoading ? 'Guardando...' : 'Continuar'}
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