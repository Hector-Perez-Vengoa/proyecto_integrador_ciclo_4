package com.tecsup.back_springboot_srvt.service;

import com.tecsup.back_springboot_srvt.dto.NotificacionReservaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import java.time.format.DateTimeFormatter;

/**
 * Servicio para envío de notificaciones por correo electrónico
 * Maneja el envío de confirmaciones de reserva a profesores
 */
@Service
public class NotificacionService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${notificaciones.email.remitente}")
    private String emailRemitente;

    @Value("${notificaciones.email.nombre-remitente}")
    private String nombreRemitente;

    @Value("${notificaciones.email.asunto-reserva}")
    private String asuntoReserva;

    @Value("${notificaciones.email.habilitado:true}")
    private boolean notificacionesHabilitadas;

    private static final DateTimeFormatter FORMATO_FECHA = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter FORMATO_HORA = DateTimeFormatter.ofPattern("HH:mm");    /**
     * Envía una notificación de confirmación de reserva al profesor de forma asíncrona
     * @param notificacion Datos de la reserva para la notificación
     */
    @Async("taskExecutor")
    public void enviarNotificacionReserva(NotificacionReservaDTO notificacion) {
        if (!notificacionesHabilitadas) {
            System.out.println("📧 [ASYNC EMAIL] Notificaciones por correo deshabilitadas. Reserva creada sin notificación.");
            return;
        }

        try {
            System.out.println("📧 [ASYNC EMAIL] Iniciando envío de email...");
            System.out.println("🧵 [ASYNC EMAIL] Thread: " + Thread.currentThread().getName());
            
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");

            helper.setFrom(emailRemitente, nombreRemitente);
            helper.setTo(notificacion.getEmailProfesor());
            helper.setSubject(asuntoReserva + " - Reserva #" + notificacion.getReservaId());

            String contenidoHtml = generarContenidoHtml(notificacion);
            helper.setText(contenidoHtml, true);

            System.out.println("📤 [ASYNC EMAIL] Enviando email a " + notificacion.getEmailProfesor() + "...");
            mailSender.send(mensaje);
            System.out.println("✅ [ASYNC EMAIL] Notificación enviada exitosamente a: " + notificacion.getEmailProfesor());

        } catch (Exception e) {
            System.err.println("❌ [ASYNC EMAIL] Error al enviar notificación por correo: " + e.getMessage());
            e.printStackTrace();
            // No lanzamos excepción para no interrumpir el proceso de creación de reserva
            // Solo registramos el error
        }
    }    /**
     * Envía una notificación simple de texto de forma asíncrona (fallback)
     * @param notificacion Datos de la reserva
     */
    @Async("taskExecutor")
    public void enviarNotificacionSimple(NotificacionReservaDTO notificacion) {
        if (!notificacionesHabilitadas) {
            return;
        }

        try {
            System.out.println("📧 [ASYNC EMAIL SIMPLE] Enviando email simple...");
            
            SimpleMailMessage mensaje = new SimpleMailMessage();
            mensaje.setFrom(emailRemitente);
            mensaje.setTo(notificacion.getEmailProfesor());
            mensaje.setSubject(asuntoReserva + " - Reserva #" + notificacion.getReservaId());
            mensaje.setText(generarContenidoTexto(notificacion));

            mailSender.send(mensaje);
            
            System.out.println("✅ [ASYNC EMAIL SIMPLE] Notificación simple enviada a: " + notificacion.getEmailProfesor());

        } catch (Exception e) {
            System.err.println("❌ [ASYNC EMAIL SIMPLE] Error al enviar notificación simple: " + e.getMessage());
        }
    }

    /**
     * Genera el contenido HTML para el correo de notificación
     * @param notificacion Datos de la reserva
     * @return Contenido HTML del correo
     */
    private String generarContenidoHtml(NotificacionReservaDTO notificacion) {
        StringBuilder html = new StringBuilder();
        
        html.append("<!DOCTYPE html>")
            .append("<html lang='es'>")
            .append("<head>")
            .append("<meta charset='UTF-8'>")
            .append("<meta name='viewport' content='width=device-width, initial-scale=1.0'>")
            .append("<title>Confirmación de Reserva</title>")
            .append("<style>")
            .append("body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }")
            .append(".header { background-color: #2c5282; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }")
            .append(".content { background-color: #f7fafc; padding: 20px; border-radius: 0 0 8px 8px; }")
            .append(".info-box { background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #2c5282; }")
            .append(".highlight { color: #2c5282; font-weight: bold; }")
            .append(".footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }")
            .append("</style>")
            .append("</head>")
            .append("<body>")
            .append("<div class='header'>")
            .append("<h1>✅ Reserva Confirmada</h1>")
            .append("<p>Sistema de Reservas de Aulas Virtuales - Tecsup</p>")
            .append("</div>")
            .append("<div class='content'>")
            .append("<p>Estimado/a <span class='highlight'>").append(notificacion.getNombreProfesor()).append("</span>,</p>")
            .append("<p>Su reserva de aula virtual ha sido <strong>confirmada exitosamente</strong>. A continuación los detalles:</p>")
            
            .append("<div class='info-box'>")
            .append("<h3>📋 Detalles de la Reserva</h3>")
            .append("<p><strong>ID de Reserva:</strong> #").append(notificacion.getReservaId()).append("</p>")
            .append("<p><strong>Estado:</strong> <span class='highlight'>").append(notificacion.getEstadoReserva()).append("</span></p>")
            .append("</div>")
            
            .append("<div class='info-box'>")
            .append("<h3>🏫 Información del Aula</h3>")
            .append("<p><strong>Aula Virtual:</strong> ").append(notificacion.getCodigoAula()).append(" - ").append(notificacion.getNombreAula()).append("</p>")
            .append("<p><strong>Curso:</strong> ").append(notificacion.getNombreCurso()).append("</p>")
            .append("</div>")
            
            .append("<div class='info-box'>")
            .append("<h3>📅 Fecha y Horario</h3>")
            .append("<p><strong>Fecha:</strong> ").append(notificacion.getFechaReserva().format(FORMATO_FECHA)).append("</p>")
            .append("<p><strong>Horario:</strong> ").append(notificacion.getHoraInicio().format(FORMATO_HORA))
            .append(" - ").append(notificacion.getHoraFin().format(FORMATO_HORA)).append("</p>")
            .append("</div>");
            
        if (notificacion.getMotivo() != null && !notificacion.getMotivo().trim().isEmpty()) {
            html.append("<div class='info-box'>")
                .append("<h3>📝 Motivo de la Reserva</h3>")
                .append("<p>").append(notificacion.getMotivo()).append("</p>")
                .append("</div>");
        }
        
        html.append("<div class='info-box'>")
            .append("<h3>⚠️ Recordatorios Importantes</h3>")
            .append("<ul>")
            .append("<li>Llegue puntualmente a su reserva</li>")
            .append("<li>Verifique el funcionamiento del equipo antes de iniciar</li>")
            .append("<li>Reporte cualquier problema técnico al administrador</li>")
            .append("<li>Libere el aula al finalizar su sesión</li>")
            .append("</ul>")
            .append("</div>")
            
            .append("<p>Si necesita cancelar o modificar su reserva, por favor contacte al administrador del sistema.</p>")
            .append("<p>Gracias por utilizar el Sistema de Reservas de Aulas Virtuales.</p>")
            .append("</div>")
            
            .append("<div class='footer'>")
            .append("<p>Este es un correo automático, por favor no responder.</p>")
            .append("<p>© 2025 Tecsup - Sistema de Reservas de Aulas Virtuales</p>")
            .append("</div>")
            .append("</body>")
            .append("</html>");
            
        return html.toString();
    }

    /**
     * Genera el contenido de texto plano para el correo
     * @param notificacion Datos de la reserva
     * @return Contenido de texto del correo
     */
    private String generarContenidoTexto(NotificacionReservaDTO notificacion) {
        StringBuilder texto = new StringBuilder();
        
        texto.append("RESERVA CONFIRMADA - Sistema de Aulas Virtuales Tecsup\n")
             .append("=========================================================\n\n")
             .append("Estimado/a ").append(notificacion.getNombreProfesor()).append(",\n\n")
             .append("Su reserva ha sido confirmada exitosamente.\n\n")
             .append("DETALLES DE LA RESERVA:\n")
             .append("- ID de Reserva: #").append(notificacion.getReservaId()).append("\n")
             .append("- Estado: ").append(notificacion.getEstadoReserva()).append("\n")
             .append("- Aula Virtual: ").append(notificacion.getCodigoAula()).append(" - ").append(notificacion.getNombreAula()).append("\n")
             .append("- Curso: ").append(notificacion.getNombreCurso()).append("\n")
             .append("- Fecha: ").append(notificacion.getFechaReserva().format(FORMATO_FECHA)).append("\n")
             .append("- Horario: ").append(notificacion.getHoraInicio().format(FORMATO_HORA))
             .append(" - ").append(notificacion.getHoraFin().format(FORMATO_HORA)).append("\n");
             
        if (notificacion.getMotivo() != null && !notificacion.getMotivo().trim().isEmpty()) {
            texto.append("- Motivo: ").append(notificacion.getMotivo()).append("\n");
        }
        
        texto.append("\nRecuerde llegar puntualmente y verificar el funcionamiento del equipo.\n\n")
             .append("Gracias por utilizar el Sistema de Reservas.\n\n")
             .append("--\n")
             .append("Sistema de Reservas de Aulas Virtuales - Tecsup\n")
             .append("Este es un correo automático, por favor no responder.");
             
        return texto.toString();
    }

    /**
     * Verifica si las notificaciones están habilitadas
     * @return true si están habilitadas, false en caso contrario
     */
    public boolean estanHabilitadasLasNotificaciones() {
        return notificacionesHabilitadas;
    }    /**
     * Obtener estado de notificaciones
     */
    public java.util.Map<String, Object> obtenerEstadoNotificaciones() {
        java.util.Map<String, Object> estado = new java.util.HashMap<>();
        estado.put("habilitadas", notificacionesHabilitadas);
        estado.put("mensaje", notificacionesHabilitadas 
            ? "Las notificaciones por correo están habilitadas" 
            : "Las notificaciones por correo están deshabilitadas");
        return estado;
    }
}
