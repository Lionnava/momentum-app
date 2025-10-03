export function SimpleFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full py-4 px-4 sm:px-6 lg:px-8 mt-auto bg-white border-t border-gray-200">
      <div className="container mx-auto text-center text-xs text-gray-400">
        <p>© {currentYear} Momentum | Desarrollado por Ing. Lionel Nava para la Secretaría de Educación Superior.</p>
      </div>
    </footer>
  );
}