import { ChevronDownIcon } from "lucide-react";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { FilterStatus } from "../../types";

interface FiltroEstadoProps {
  value?: FilterStatus;
  onChange?: (value: FilterStatus) => void;
}

export const FiltroEstado: React.FC<FiltroEstadoProps> = ({ 
  value = 'todos', 
  onChange 
}) => {
  const estados = [
    { value: "todos" as FilterStatus, label: "Todos los estados", count: null },
    { value: "activo" as FilterStatus, label: "Activo", count: null },
    { value: "pendiente" as FilterStatus, label: "Pendiente", count: null },
    { value: "inactivo" as FilterStatus, label: "Inactivo", count: null },
  ];

  const handleValueChange = (newValue: string) => {
    console.log('FiltroEstado - Valor seleccionado:', newValue); // Debug
    if (onChange) {
      onChange(newValue as FilterStatus);
    }
  };

  return (
    <div className="w-full max-w-[247px]">
      <div className="mb-2 pl-[3px] font-['Montserrat',Helvetica] font-bold text-gray-1 text-xs tracking-[0] leading-[21px] uppercase">
        Por Estado
      </div>

      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full h-[50px] rounded-[10px] border border-solid border-[#dfdfdf] px-[18px] py-[11px] bg-white hover:bg-gray-50 transition-colors">
          <SelectValue
            placeholder="Seleccionar estado"
            className="font-small-text-medium-14 text-gray-3"
          />
          <ChevronDownIcon className="h-4 w-4 opacity-50" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
          {estados.map((estado) => (
            <SelectItem 
              key={estado.value} 
              value={estado.value}
              className="hover:bg-gray-50 cursor-pointer px-4 py-2 text-sm"
            >
              <div className="flex items-center justify-between w-full">
                <span>{estado.label}</span>
                {estado.value !== 'todos' && (
                  <div className={`w-2 h-2 rounded-full ml-2 ${
                    estado.value === 'activo' ? 'bg-green-500' :
                    estado.value === 'pendiente' ? 'bg-yellow-500' :
                    estado.value === 'inactivo' ? 'bg-red-500' : 'bg-gray-500'
                  }`} />
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};