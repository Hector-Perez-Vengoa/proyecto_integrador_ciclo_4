// src/components/dashboard/PasswordSetupForm.jsx
import { usePasswordSetup } from '../../logic/usePasswordSetup';
import Button from '../ui/Button';
import Input from '../ui/Input';

const PasswordSetupForm = ({ onSuccess }) => {
  const {
    formData,
    errors,
    loading,
    success,
    handleChange,
    handleSubmit
  } = usePasswordSetup();

  if (success) {
    return (
      <div className="mt-6 animate-fadeIn bg-green-50 p-6 rounded-lg">
        <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h2 className="text-lg font-semibold text-green-700 mb-2">¡Contraseña configurada!</h2>
        <p className="text-sm text-green-600">
          Tu contraseña ha sido configurada correctamente. Ahora puedes iniciar sesión utilizando tu correo y contraseña.
        </p>
        {onSuccess && (
          <Button 
            onClick={onSuccess} 
            className="mt-4"
            variant="primary"
          >
            Continuar
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="mt-6 animate-fadeIn">
      <div className="bg-blue-50 p-4 mb-6 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-700 mb-2">Configura tu contraseña</h2>
        <p className="text-sm text-blue-600 opacity-80">
          Para poder acceder posteriormente con tu correo, necesitas crear una contraseña
        </p>
      </div>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        <Input
          label="Nueva Contraseña"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Ingresa una contraseña segura"
          error={errors.password}
          showPasswordToggle={true}
          required
        />
        
        <Input
          label="Confirmar Contraseña"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirma tu contraseña"
          error={errors.confirmPassword}
          showPasswordToggle={true}
          required
        />
        
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          className="w-full"
        >
          Guardar Contraseña
        </Button>
      </form>
    </div>
  );
};

export default PasswordSetupForm;