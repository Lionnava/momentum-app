import { inviteUserAction } from './actions';
import { SubmitButton } from './submit-button'; // Un componente para el botón de envío

/**
 * Página que renderiza el formulario para invitar a nuevos usuarios.
 * Utiliza una Server Action para manejar el envío del formulario.
 */
export default function InviteUserPage() {
  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Invitar Nuevo Miembro</h1>
        <p className="text-gray-500 mt-2">
          El nuevo miembro recibirá un correo electrónico con un enlace mágico para unirse a la plataforma y configurar su cuenta.
        </p>
      </div>
      
      {/* El formulario llama directamente a la Server Action */}
      <form action={inviteUserAction} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Correo Electrónico del Invitado
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="ejemplo@correo.com"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Asignar Rol Inicial
          </label>
          <select
            id="role"
            name="role"
            required
            defaultValue="employee"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
            <option value="supermanager">Supermanager</option>
          </select>
        </div>
        
        <SubmitButton />
        
      </form>
    </div>
  );
}