import { useApi } from './useApi';
import { 
  profesorService, 
  aulaVirtualService, 
  departamentoService, 
  carreraService, 
  cursoService, 
  reservaService 
} from '../services/api';

// Hooks específicos para cada entidad
export const useProfesores = () => {
  return useApi(profesorService);
};

export const useAulasVirtuales = () => {
  return useApi(aulaVirtualService);
};

export const useDepartamentos = () => {
  return useApi(departamentoService);
};

export const useCarreras = () => {
  return useApi(carreraService);
};

export const useCursos = () => {
  return useApi(cursoService);
};

export const useReservas = () => {
  return useApi(reservaService);
};
