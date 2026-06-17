package com.cibertec.colegio.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cibertec.colegio.model.Alumno;
import com.cibertec.colegio.model.Grado;
import com.cibertec.colegio.model.Tutor;
import com.cibertec.colegio.repository.AlumnoRepository;
import com.cibertec.colegio.repository.GradoRepository;
import com.cibertec.colegio.repository.TutorRepository;

@Service
public class ReporteService {

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private TutorRepository tutorRepository;

    @Autowired
    private GradoRepository gradoRepository;

    public byte[] generarReporteAlumnos() throws IOException {
        List<Alumno> alumnos = alumnoRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Reporte de Alumnos");

            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);

            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "Nombres", "Apellidos", "DNI", "Fecha Nacimiento", "Grado", "Seccion", "Tutor"};

            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowNum = 1;
            for (Alumno alumno : alumnos) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(alumno.getId());
                row.createCell(1).setCellValue(alumno.getNombres());
                row.createCell(2).setCellValue(alumno.getApellidos());
                row.createCell(3).setCellValue(alumno.getDni());
                row.createCell(4).setCellValue(alumno.getFechaNacimiento() != null ?
                    alumno.getFechaNacimiento().toString() : "");
                row.createCell(5).setCellValue(alumno.getGrado() != null ?
                    alumno.getGrado().getNombre() : "");
                row.createCell(6).setCellValue(alumno.getGrado() != null ?
                    alumno.getGrado().getSeccion() : "");
                row.createCell(7).setCellValue(alumno.getTutor() != null ?
                    alumno.getTutor().getNombres() + " " + alumno.getTutor().getApellidos() : "");
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            Row infoRow = sheet.createRow(rowNum + 2);
            infoRow.createCell(0).setCellValue("Generado el: " +
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")));

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    public byte[] generarReporteTutores() throws IOException {
        List<Tutor> tutores = tutorRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Reporte de Tutores");

            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_GREEN.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);

            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "Nombres", "Apellidos", "DNI", "Telefono", "Email", "Direccion", "Parentesco", "Alumnos a Cargo"};

            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowNum = 1;
            for (Tutor tutor : tutores) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(tutor.getId());
                row.createCell(1).setCellValue(tutor.getNombres());
                row.createCell(2).setCellValue(tutor.getApellidos());
                row.createCell(3).setCellValue(tutor.getDni());
                row.createCell(4).setCellValue(tutor.getTelefono());
                row.createCell(5).setCellValue(tutor.getEmail());
                row.createCell(6).setCellValue(tutor.getDireccion());
                row.createCell(7).setCellValue(tutor.getParentesco());
                row.createCell(8).setCellValue(tutor.getAlumnos() != null ?
                    tutor.getAlumnos().size() : 0);
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            Row infoRow = sheet.createRow(rowNum + 2);
            infoRow.createCell(0).setCellValue("Generado el: " +
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")));

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    public byte[] generarReporteGrados() throws IOException {
        List<Grado> grados = gradoRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Reporte de Grados");

            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_RED.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);

            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "Nombre del Grado", "Seccion", "Cantidad de Alumnos"};

            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowNum = 1;
            for (Grado grado : grados) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(grado.getId());
                row.createCell(1).setCellValue(grado.getNombre());
                row.createCell(2).setCellValue(grado.getSeccion());
                row.createCell(3).setCellValue(grado.getAlumnos() != null ?
                    grado.getAlumnos().size() : 0);
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            Row infoRow = sheet.createRow(rowNum + 2);
            infoRow.createCell(0).setCellValue("Generado el: " +
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")));

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    public byte[] generarReporteCompleto() throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            crearHojaAlumnos(workbook);
            crearHojaTutores(workbook);
            crearHojaGrados(workbook);
            crearHojaResumen(workbook);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    private void crearHojaAlumnos(Workbook workbook) {
        List<Alumno> alumnos = alumnoRepository.findAll();
        Sheet sheet = workbook.createSheet("Alumnos");
        CellStyle headerStyle = crearEstiloEncabezado(workbook, IndexedColors.DARK_BLUE);

        Row headerRow = sheet.createRow(0);
        String[] headers = {"ID", "Nombres", "Apellidos", "DNI", "Fecha Nacimiento", "Grado", "Seccion", "Tutor"};

        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        int rowNum = 1;
        for (Alumno alumno : alumnos) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(alumno.getId());
            row.createCell(1).setCellValue(alumno.getNombres());
            row.createCell(2).setCellValue(alumno.getApellidos());
            row.createCell(3).setCellValue(alumno.getDni());
            row.createCell(4).setCellValue(alumno.getFechaNacimiento() != null ?
                alumno.getFechaNacimiento().toString() : "");
            row.createCell(5).setCellValue(alumno.getGrado() != null ?
                alumno.getGrado().getNombre() : "");
            row.createCell(6).setCellValue(alumno.getGrado() != null ?
                alumno.getGrado().getSeccion() : "");
            row.createCell(7).setCellValue(alumno.getTutor() != null ?
                alumno.getTutor().getNombres() + " " + alumno.getTutor().getApellidos() : "");
        }

        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }
    }

    private void crearHojaTutores(Workbook workbook) {
        List<Tutor> tutores = tutorRepository.findAll();
        Sheet sheet = workbook.createSheet("Tutores");
        CellStyle headerStyle = crearEstiloEncabezado(workbook, IndexedColors.DARK_GREEN);

        Row headerRow = sheet.createRow(0);
        String[] headers = {"ID", "Nombres", "Apellidos", "DNI", "Telefono", "Email", "Direccion", "Parentesco"};

        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        int rowNum = 1;
        for (Tutor tutor : tutores) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(tutor.getId());
            row.createCell(1).setCellValue(tutor.getNombres());
            row.createCell(2).setCellValue(tutor.getApellidos());
            row.createCell(3).setCellValue(tutor.getDni());
            row.createCell(4).setCellValue(tutor.getTelefono());
            row.createCell(5).setCellValue(tutor.getEmail());
            row.createCell(6).setCellValue(tutor.getDireccion());
            row.createCell(7).setCellValue(tutor.getParentesco());
        }

        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }
    }

    private void crearHojaGrados(Workbook workbook) {
        List<Grado> grados = gradoRepository.findAll();
        Sheet sheet = workbook.createSheet("Grados");
        CellStyle headerStyle = crearEstiloEncabezado(workbook, IndexedColors.DARK_RED);

        Row headerRow = sheet.createRow(0);
        String[] headers = {"ID", "Nombre del Grado", "Seccion", "Cantidad de Alumnos"};

        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        int rowNum = 1;
        for (Grado grado : grados) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(grado.getId());
            row.createCell(1).setCellValue(grado.getNombre());
            row.createCell(2).setCellValue(grado.getSeccion());
            row.createCell(3).setCellValue(grado.getAlumnos() != null ?
                grado.getAlumnos().size() : 0);
        }

        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }
    }

    private void crearHojaResumen(Workbook workbook) {
        Sheet sheet = workbook.createSheet("Resumen");
        CellStyle headerStyle = crearEstiloEncabezado(workbook, IndexedColors.DARK_TEAL);
        CellStyle dataStyle = workbook.createCellStyle();
        Font dataFont = workbook.createFont();
        dataFont.setBold(true);
        dataStyle.setFont(dataFont);

        Row titleRow = sheet.createRow(0);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("RESUMEN ESTADISTICO - HELEN SCHOOL");
        titleCell.setCellStyle(headerStyle);

        int rowNum = 2;

        Row alumnosRow = sheet.createRow(rowNum++);
        alumnosRow.createCell(0).setCellValue("Total de Alumnos:");
        Cell alumnosCell = alumnosRow.createCell(1);
        alumnosCell.setCellValue(alumnoRepository.count());
        alumnosCell.setCellStyle(dataStyle);

        Row tutoresRow = sheet.createRow(rowNum++);
        tutoresRow.createCell(0).setCellValue("Total de Tutores:");
        Cell tutoresCell = tutoresRow.createCell(1);
        tutoresCell.setCellValue(tutorRepository.count());
        tutoresCell.setCellStyle(dataStyle);

        Row gradosRow = sheet.createRow(rowNum++);
        gradosRow.createCell(0).setCellValue("Total de Grados:");
        Cell gradosCell = gradosRow.createCell(1);
        gradosCell.setCellValue(gradoRepository.count());
        gradosCell.setCellStyle(dataStyle);

        Row fechaRow = sheet.createRow(rowNum + 2);
        fechaRow.createCell(0).setCellValue("Fecha de Generacion:");
        fechaRow.createCell(1).setCellValue(LocalDateTime.now().format(
            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")));

        sheet.autoSizeColumn(0);
        sheet.autoSizeColumn(1);
    }

    private CellStyle crearEstiloEncabezado(Workbook workbook, IndexedColors color) {
        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerFont.setColor(IndexedColors.WHITE.getIndex());
        headerStyle.setFont(headerFont);
        headerStyle.setFillForegroundColor(color.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        headerStyle.setAlignment(HorizontalAlignment.CENTER);
        return headerStyle;
    }
}
