// src/components/ui/ProgressBar.tsx

type ProgressBarProps = {
  value: number; // Un valor de 0 a 100
};

export const ProgressBar = ({ value }: ProgressBarProps) => {
  // Aseguramos que el valor esté siempre entre 0 y 100 para evitar errores visuales
  const percentage = Math.max(0, Math.min(100, value));

  return (
    <div className="flex items-center gap-3">
      {/* El contenedor exterior de la barra */}
      <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
        {/* La barra interior que muestra el progreso */}
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{
            width: `${percentage}%`,
            // --- ¡LA MAGIA ESTÁ AQUÍ! ---
            // Añadimos las propiedades de transición de CSS.
            transition: 'width 0.5s ease-in-out',
          }}
        />
      </div>
      {/* El texto que muestra el porcentaje */}
      <span className="text-sm font-medium text-slate-500 w-12 text-right">
        {percentage}%
      </span>
    </div>
  );
};