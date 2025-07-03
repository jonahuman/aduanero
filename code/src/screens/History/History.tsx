import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { FiltroEstado } from '../FiltroEstado';
import { useNotification, Notification } from '../../components/ui/notification';
import { apiService } from '../../services/api';
import { 
  History as HistoryIcon, 
  Search, 
  Eye, 
  Download, 
  Calendar,
  User,
  FileText,
  ArrowLeft,
  Filter,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { CustomsRecord, FilterStatus } from '../../types';

interface HistoryProps {
  onBack: () => void;
}



export const History: React.FC<HistoryProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('todos');
  const [records, setRecords] = useState<CustomsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ todos: 0, activo: 0, inactivo: 0, pendiente: 0 });
  const { notifications, showSuccess, showError, removeNotification } = useNotification();

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCustomsRecords(1, 50, '', '');
      setRecords(response.records || []);
      
      // Obtener estadísticas del servidor
      const statsResponse = await apiService.getCustomsStats();
      setStats({
        todos: statsResponse.customs_records.total,
        activo: statsResponse.customs_records.active,
        inactivo: statsResponse.customs_records.inactive,
        pendiente: statsResponse.customs_records.pending,
      });
    } catch (error: any) {
      showError('No se pudieron cargar los registros');
      setRecords([]);
      setStats({ todos: 0, activo: 0, inactivo: 0, pendiente: 0 });
    } finally {
      setLoading(false);
    }
  };


  // Filtrado mejorado con lógica más robusta
  const filteredRecords = useMemo(() => {
    console.log('Aplicando filtros:', { searchTerm, statusFilter }); // Debug
    
    let filtered = records.filter(record => {
      // Filtro de búsqueda
      const matchesSearch = searchTerm === '' || 
        record.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.user.nationality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.documents.some(doc => 
          doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      // Filtro de estado
      const matchesStatus = statusFilter === 'todos' || record.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    console.log('Registros filtrados:', filtered.length); // Debug
    return filtered;
  }, [searchTerm, statusFilter, records]);

  // Usar estadísticas del estado
  const statusStats = stats;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'activo':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Activo
          </Badge>
        );
      case 'inactivo':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Inactivo
          </Badge>
        );
      case 'pendiente':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Desconocido
          </Badge>
        );
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'activo':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'inactivo':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pendiente':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleStatusFilterChange = (newStatus: FilterStatus) => {
    console.log('Cambiando filtro de estado a:', newStatus); // Debug
    setStatusFilter(newStatus);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('todos');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">{statusStats.todos}</span>
              </div>
              <p className="text-sm text-gray-600">Total</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">{statusStats.activo}</span>
              </div>
              <p className="text-sm text-gray-600">Activos</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="text-2xl font-bold text-yellow-600">{statusStats.pendiente}</span>
              </div>
              <p className="text-sm text-gray-600">Pendientes</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center space-x-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="text-2xl font-bold text-red-600">{statusStats.inactivo}</span>
              </div>
              <p className="text-sm text-gray-600">Inactivos</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-xl mb-6">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
              <HistoryIcon className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Historial de Pasajeros
            </CardTitle>
            <p className="text-gray-600">
              Gestione y consulte el historial completo de pasajeros registrados
            </p>
          </CardHeader>
          <CardContent>
            {/* Controles de Filtrado */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar Pasajero
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por nombre, email, nacionalidad o número de documento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="lg:w-64">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filtrar por Estado
                </label>
                <FiltroEstado 
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="flex items-center space-x-2"
                >
                  <Filter className="w-4 h-4" />
                  <span>Limpiar</span>
                </Button>
              </div>
            </div>

            {/* Indicador de Filtros Activos */}
            {(searchTerm || statusFilter !== 'todos') && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      Filtros activos:
                    </span>
                    {searchTerm && (
                      <Badge variant="secondary" className="text-xs">
                        Búsqueda: "{searchTerm}"
                      </Badge>
                    )}
                    {statusFilter !== 'todos' && (
                      <Badge variant="secondary" className="text-xs">
                        Estado: {statusFilter}
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-blue-600">
                    {filteredRecords.length} de {records.length} registros
                  </span>
                </div>
              </div>
            )}

            {/* Lista de Registros */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando registros...</p>
                </div>
              ) : filteredRecords.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No se encontraron registros
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || statusFilter !== 'todos' 
                      ? 'Intenta ajustar los filtros de búsqueda'
                      : 'No hay pasajeros registrados en el sistema'
                    }
                  </p>
                  {(searchTerm || statusFilter !== 'todos') && (
                    <Button variant="outline" onClick={clearFilters}>
                      Limpiar filtros
                    </Button>
                  )}
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <Card key={record.id} className="hover:shadow-md transition-shadow border-l-4 border-l-gray-200 hover:border-l-indigo-500">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(record.status)}
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">
                                {record.user.firstName} {record.user.lastName}
                              </h3>
                              <p className="text-sm text-gray-600">{record.user.email}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-500 font-medium">Nacionalidad:</span>
                              <span className="text-gray-900">{record.user.nationality}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-500 font-medium">Teléfono:</span>
                              <span className="text-gray-900">{record.user.phoneNumber}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-500 font-medium">Documentos:</span>
                              <span className="text-gray-900">
                                {record.documents.map(doc => 
                                  doc.type === 'passport' ? 'Pasaporte' : 'Cédula'
                                ).join(', ')}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-500 font-medium">Procesado:</span>
                              <span className="text-gray-900">{formatDate(record.processedAt)}</span>
                            </div>
                          </div>

                          {record.notes && (
                            <div className="bg-gray-50 p-3 rounded-lg border">
                              <p className="text-sm text-gray-700">
                                <strong className="text-gray-900">Notas:</strong> {record.notes}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-3 lg:min-w-[200px]">
                          {getStatusBadge(record.status)}
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>Ver</span>
                            </Button>
                            <Button size="sm" variant="outline" className="flex items-center space-x-1">
                              <Download className="w-4 h-4" />
                              <span>Descargar</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Paginación y Resumen */}
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t">
              <div className="text-sm text-gray-600">
                Mostrando <strong>{filteredRecords.length}</strong> de <strong>{records.length}</strong> registros
                {statusFilter !== 'todos' && (
                  <span className="ml-2 text-indigo-600">
                    (filtrado por: {statusFilter})
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Siguiente
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};