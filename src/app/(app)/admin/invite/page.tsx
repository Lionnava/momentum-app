import InviteUserForm from './_components/InviteUserForm';

export default function InvitePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6">Invitar Nuevo Usuario</h1>
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <InviteUserForm />
        </div>
      </div>
    </div>
  );
}