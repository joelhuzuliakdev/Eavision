import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
	try {
		const data = await request.formData();

		const nombre = data.get('nombre')?.toString().trim() || '';
		const telefono = data.get('telefono')?.toString().trim() || '';
		const email = data.get('email')?.toString().trim() || '';
		const provincia = data.get('provincia')?.toString().trim() || '';
		const servicio = data.get('servicio')?.toString().trim() || '';
		const mensaje = data.get('mensaje')?.toString().trim() || '';

		// Validar email
		if (!email) {
			return new Response(
				JSON.stringify({
					success: false,
					message: 'El email está vacío. Por favor, ingresá tu email para poder contactarte.',
					field: 'email',
				}),
				{
					status: 400,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
		}

		const { error } = await resend.emails.send({
			from: 'EaVision <onboarding@resend.dev>',
			to: ['eavision@elladerosa.com.ar'],
			subject: `Nueva consulta de ${nombre}`,
			html: `
				<h2>Nueva solicitud de cotización</h2>

				<p><strong>Nombre y apellido:</strong> ${nombre}</p>
				<p><strong>Teléfono:</strong> ${telefono}</p>
				<p><strong>Email:</strong> ${email}</p>
				<p><strong>Provincia:</strong> ${provincia}</p>
				<p><strong>Servicio de interés:</strong> ${servicio}</p>

				<hr />

				<p><strong>Hectáreas aproximadas / Mensaje:</strong></p>
				<p>${mensaje}</p>
			`,
		});

		if (error) {
			console.error('Error de Resend:', error);

			return new Response(
				JSON.stringify({
					success: false,
					message: 'No se pudo enviar la consulta.',
				}),
				{
					status: 500,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
		}

		return new Response(
			JSON.stringify({
				success: true,
				message: 'Consulta enviada correctamente.',
			}),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	} catch (error) {
		console.error('Error al procesar el formulario:', error);

		return new Response(
			JSON.stringify({
				success: false,
				message: 'Ocurrió un error al enviar la consulta.',
			}),
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	}
};