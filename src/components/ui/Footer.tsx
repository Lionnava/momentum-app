// src/components/ui/Footer.tsx
export function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="w-full text-center p-4 bg-white border-t border-gray-200">
            <p className="text-sm text-gray-500">
                © {currentYear} Momentum | Desarrollado por Ing. Lionel Nava para la Secretaría de Educación Superior.
            </p>
        </footer>
    );
}