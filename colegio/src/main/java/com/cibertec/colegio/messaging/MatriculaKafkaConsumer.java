/*package com.cibertec.colegio.messaging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;


@Component
@ConditionalOnProperty(name = "spring.kafka.bootstrap-servers", matchIfMissing = false)
public class MatriculaKafkaConsumer {

    private static final Logger log = LoggerFactory.getLogger(MatriculaKafkaConsumer.class);

    @KafkaListener(topics = "${colegio.kafka.topic.matricula}",
                   groupId = "${spring.kafka.consumer.group-id}")
    public void escuchar(String mensaje) {
        String[] partes = mensaje.split("\\|");
        if (partes.length >= 3) {
            log.info("[Kafka] 📥 Evento de auditoría recibido:");
            log.info("[Kafka]    Tipo      : {}", partes[0]);
            log.info("[Kafka]    ID Alumno : {}", partes[1]);
            log.info("[Kafka]    Timestamp : {}", partes[2]);
        } else {
            log.warn("[Kafka] ⚠️  Mensaje con formato inesperado: {}", mensaje);
        }
    }
}*/
