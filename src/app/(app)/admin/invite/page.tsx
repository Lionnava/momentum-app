// src/app/(app)/admin/invite/page.tsx
import { InviteUserForm } from './_components/InviteForm';

export default function InviteUserPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Invitar Nuevo Usuario</h1>
          <p className="mt-1 text-slate-600">
            Envía una invitación por correo electrónico para que un nuevo usuario se una a la plataforma.
          </p>
        </div>
        
        <div className="bg-white p-8 border border-slate-200 rounded-lg shadow-sm">
          <InviteUserForm />
        </div>
      </div>
    </div>
  );
}