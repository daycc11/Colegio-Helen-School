/*package com.cibertec.colegio.messaging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@ConditionalOnProperty(name = "spring.rabbitmq.host", matchIfMissing = false)
public class AlumnoListener {

    private static final Logger log = LoggerFactory.getLogger(AlumnoListener.class);

    @RabbitListener(queues = "${colegio.rabbitmq.queue.alumno}")
    public void procesarRegistroAlumno(Map<String, Object> mensaje) {
        log.info("[RabbitMQ] ✉️  Nuevo alumno registrado recibido en cola:");
        log.info("[RabbitMQ]    Nombre  : {}", mensaje.get("nombres"));
        log.info("[RabbitMQ]    Apellido: {}", mensaje.get("apellidos"));
        log.info("[RabbitMQ]    DNI     : {}", mensaje.get("dni"));
        log.info("[RabbitMQ]    Acción  : Procesando notificación de bienvenida...");
        // TODO: Integrar servicio de email (JavaMailSender)
        log.info("[RabbitMQ] ✅ Notificación procesada correctamente.");
    }
}*/
