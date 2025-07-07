import { useApi } from './useApi';
import { 
  userService, 
  aulaVirtualService, 
  departamentoService, 
  carreraService, 
  cursoService, 
  reservaService 
} from '../services/api';

// Hooks específicos para cada entidad
export const useProfesores = () => {
  return useApi(userService);
};

export const useUsuarios = () => {
  return useApi(userService);
};

export const useUsers = () => {
  return useApi(userService);
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
