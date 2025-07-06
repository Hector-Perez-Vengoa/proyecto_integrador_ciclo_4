import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import authService from '../services/authService';

// Estado inicial
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Tipos de acciones
const AuthActionTypes = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AuthActionTypes.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case AuthActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case AuthActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error,
      };
    case AuthActionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case AuthActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case AuthActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Crear contexto
const AuthContext = createContext();

// Provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuthentication = async () => {
      dispatch({ type: AuthActionTypes.SET_LOADING, payload: true });
      
      try {
        const result = await authService.checkAuth();
        
        if (result.authenticated) {
          dispatch({
            type: AuthActionTypes.LOGIN_SUCCESS,
            payload: { user: result.user },
          });
        } else {
          dispatch({ type: AuthActionTypes.LOGOUT });
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        dispatch({ type: AuthActionTypes.LOGOUT });
      } finally {
        dispatch({ type: AuthActionTypes.SET_LOADING, payload: false });
      }
    };

    checkAuthentication();
  }, []); // Solo ejecutar una vez al montar el componente

  // Función de login
  const login = async (username, password) => {
    dispatch({ type: AuthActionTypes.LOGIN_START });
    
    try {
      const result = await authService.login(username, password);
      
      if (result.success) {
        dispatch({
          type: AuthActionTypes.LOGIN_SUCCESS,
          payload: { user: result.user },
        });
        return { success: true };
      } else {
        dispatch({
          type: AuthActionTypes.LOGIN_FAILURE,
          payload: { error: result.error },
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error en login:', error);
      const errorMessage = 'Error de conexión con el servidor';
      dispatch({
        type: AuthActionTypes.LOGIN_FAILURE,
        payload: { error: errorMessage },
      });
      return { success: false, error: errorMessage };
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error en logout:', error);
    }
    dispatch({ type: AuthActionTypes.LOGOUT });
  };

  // Limpiar errores
  const clearError = () => {
    dispatch({ type: AuthActionTypes.CLEAR_ERROR });
  };

  // Valor del contexto
  const value = useMemo(() => ({
    ...state,
    login,
    logout,
    clearError,
  }), [state, login, logout, clearError]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Exportar AuthContext como named export
export { AuthContext };
export default AuthContext;
