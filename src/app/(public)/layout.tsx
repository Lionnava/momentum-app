// src/app/(public)/layout.tsx
export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Este layout ahora hereda los estilos del layout raíz
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            {children}
        </div>
    );
}