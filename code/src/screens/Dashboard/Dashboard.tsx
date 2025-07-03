import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { MiniLoading } from '../../components/ui/mini-loading';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification, Notification } from '../../components/ui/notification';
import { apiService } from '../../services/api';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  LogOut,
  UserPlus,
  Upload,
  History,
  Shield
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (screen: string) => void;
  onLogout: () => void; // Nueva prop para manejar logout
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onLogout }) => {
  const { user, logout } = useAuth();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [stats, setStats] = useState({
    users: { total: 0 },
    documents: { total: 0, approved: 0, pending: 0, rejected: 0 },
    customs_records: { total: 0, active: 0, inactive: 0, pending: 0 }
  });
  const { notifications, showSuccess, showError, removeNotification } = useNotification();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await apiService.getCustomsStats();
      setStats(response);
    } catch (error: any) {
      showError('No se pudieron cargar los datos');
    }
  };

  const dashboardStats = [
    { title: 'Pasajeros Registrados', value: stats.users.total.toString(), icon: Users, color: 'text-green-600' },
    { title: 'Documentos Procesados', value: stats.documents.approved.toString(), icon: FileText, color: 'text-blue-600' },
    { title: 'Pendientes', value: stats.documents.pending.toString(), icon: BarChart3, color: 'text-yellow-600' },
    { title: 'Rechazados', value: stats.documents.rejected.toString(), icon: Shield, color: 'text-red-600' },
  ];

  const handleQuickAction = (action: string, screen: string) => {
    setLoadingAction(action);
    
    // Simular una pequeña carga antes de navegar
    setTimeout(() => {
      setLoadingAction(null);
      onNavigate(screen);
    }, 500);
  };

  // Nueva función para manejar el logout con confirmación
  const handleLogoutClick = () => {
    // Llamar al logout del contexto para limpiar el estado de autenticación
    logout();
    // Llamar al logout del App para manejar la navegación
    onLogout();
  };

  const quickActions = [
    {
      id: 'register',
      title: 'Registrar Pasajero',
      description: 'Agregar nuevo pasajero al sistema',
      icon: UserPlus,
      action: () => handleQuickAction('register', 'personal-data'),
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      id: 'upload',
      title: 'Subir Documentos',
      description: 'Cargar documentos de identificación',
      icon: Upload,
      action: () => handleQuickAction('upload', 'document-upload'),
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      id: 'history',
      title: 'Ver Historial',
      description: 'Consultar registros históricos',
      icon: History,
      action: () => handleQuickAction('history', 'history'),
      color: 'bg-purple-600 hover:bg-purple-700',
    },
  ];

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                Sistema de Aduana
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogoutClick}
                className="text-gray-600 hover:text-gray-900 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bienvenido, {user?.firstName}
          </h2>
          <p className="text-gray-600">
            Panel de control del sistema de gestión aduanera
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Acciones Rápidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {action.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        {action.description}
                      </p>
                      {loadingAction === action.id ? (
                        <div className="py-2">
                          <MiniLoading message="Preparando..." size="sm" />
                        </div>
                      ) : (
                        <Button
                          onClick={action.action}
                          className={action.color}
                          size="sm"
                        >
                          Acceder
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Últimas acciones realizadas en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: 'Documento aprobado',
                  user: 'Juan Pérez',
                  time: 'Hace 2 horas',
                  type: 'success',
                },
                {
                  action: 'Nuevo pasajero registrado',
                  user: 'María González',
                  time: 'Hace 4 horas',
                  type: 'info',
                },
                {
                  action: 'Documento rechazado',
                  user: 'Carlos Martínez',
                  time: 'Hace 6 horas',
                  type: 'error',
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'info' ? 'bg-blue-500' : 'bg-red-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-600">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </>
  );
};