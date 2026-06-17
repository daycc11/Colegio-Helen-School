/*package com.cibertec.colegio.messaging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;


@Component
public class MatriculaKafkaProducer {

    private static final Logger log = LoggerFactory.getLogger(MatriculaKafkaProducer.class);

    @Autowired(required = false)
    private KafkaTemplate<String, String> kafkaTemplate;

    @Value("${colegio.kafka.topic.matricula:matricula-eventos}")
    private String topicMatricula;

    
    public void publicarEvento(String tipo, Long idAlumno) {
        if (kafkaTemplate == null) {
            log.warn("[Kafka] ⚠️  Kafka no disponible. Saltando publicación de evento tipo={}.", tipo);
            return;
        }
        String mensaje = tipo + "|" + idAlumno + "|" + LocalDateTime.now();
        log.info("[Kafka] 📤 Publicando evento de matrícula → topic='{}', mensaje='{}'",
                topicMatricula, mensaje);
        try {
            kafkaTemplate.send(topicMatricula, mensaje);
        } catch (Exception e) {
            log.error("[Kafka] ❌ Error al publicar evento: {}", e.getMessage());
        }
    }
}*/
