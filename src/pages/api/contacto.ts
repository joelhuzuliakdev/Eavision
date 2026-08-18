import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
	try {
		const data = await request.formData();

		const nombre = data.get('nombre')?.toString() || '';
		const telefono = data.get('telefono')?.toString() || '';
		const email = data.get('email')?.toString() || '';
		const provincia = data.get('provincia')?.toString() || '';
		const servicio = data.get('servicio')?.toString() || '';
		const mensaje = data.get('mensaje')?.toString() || '';

		const { error } = await resend.emails.send({
			from: 'EaVision <onboarding@resend.dev>',
			to: ['paulaosella19@gmail.com'],
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