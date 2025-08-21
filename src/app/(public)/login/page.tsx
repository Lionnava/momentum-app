import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">
                    Accede a tu cuenta
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                    para continuar en Momentum
                </p>
            </div>
            <LoginForm />
        </div>
    );
}