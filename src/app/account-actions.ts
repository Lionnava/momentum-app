// src/app/account-actions.ts

'use server';

import { createServerClient } from '@/lib/pocketbase';

// Acción para solicitar el reseteo de contraseña
export async function requestPasswordResetAction(formData: FormData) {
    const pb = createServerClient();
    const email = formData.get('email') as string;

    if (!email) {
        return { success: false, message: 'El email es requerido.' };
    }
    
    try {
        await pb.collection('users').requestPasswordReset(email);
        return { success: true, message: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña.' };
    } catch (error) {
        console.error("Error en la solicitud de reseteo de contraseña:", error);
        // No revelamos si el email existe o no por seguridad
        return { success: true, message: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña.' };
    }
}


// Acción para solicitar una nueva cuenta de usuario
export async function requestAccountAction(formData: FormData) {
    const pb = createServerClient();

    const data = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        position: formData.get('position') as string,
        justification: formData.get('justification') as string,
        status: 'pendiente', // Siempre se crea como pendiente
    };

    if (!data.name || !data.email || !data.position) {
        return { success: false, message: 'Nombre, email y puesto son requeridos.' };
    }

    try {
        await pb.collection('registrationRequests').create(data);
        return { success: true, message: 'Tu solicitud ha sido enviada. El administrador la revisará pronto.' };
    } catch (error) {
        console.error("Error al crear la solicitud de registro:", error);
        return { success: false, message: 'Ocurrió un error al enviar tu solicitud.' };
    }
}