import { createServerClient } from '@/utils/supabase/server';
import NewProposalForm from './_components/NewProposalForm';

async function getDivisions() {
  const supabase = createServerClient();
  const { data } = await supabase.from('divisions').select('id, name');
  return data || [];
}

export default async function NewProposalPage() {
  const divisions = await getDivisions();
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Proponer Nueva Tarea</h1>
        <p className="text-gray-600 mb-6">Tu propuesta será revisada por un manager o super manager antes de ser asignada.</p>
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <NewProposalForm divisions={divisions} />
        </div>
      </div>
    </div>
  );
}