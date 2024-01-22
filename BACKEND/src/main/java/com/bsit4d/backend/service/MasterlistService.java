package com.bsit4d.backend.service;

import com.bsit4d.backend.model.MasterlistModel;
import com.bsit4d.backend.repository.MasterlistRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.lang.reflect.Method;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class MasterlistService {



    @Autowired
    private MasterlistRepository masterlistRepository;
    @Transactional
    public void updateStatusBasedOnDate() {
        masterlistRepository.updateStatusBasedOnDate();
    }

    public boolean processExcelFile(MultipartFile file, String academicYear, String semester) throws IOException {
        Workbook workbook = new XSSFWorkbook(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        // Dynamically find the header row
        Row headerRow = sheet.getRow(1);

        if (headerRow == null) {
            throw new IllegalArgumentException("Header row not found in the Excel file.");
        }

        List<String> excelHeaders = new ArrayList<>();
        for (Cell cell : headerRow) {
            excelHeaders.add(getCellValueAsString(cell));
        }
        System.out.println("Actual Headers: " + excelHeaders);
        // Ensure that Excel headers match entity fields
        validateHeaders(excelHeaders);

        MasterlistModel masterlistModel = null;
        for (int i = 2; i <= sheet.getLastRowNum(); i++) {
            Row currentRow = sheet.getRow(i);
            masterlistModel = new MasterlistModel();

            // Map Excel headers to entity fields
            for (int j = 0; j < excelHeaders.size(); j++) {
                Cell currentCell = currentRow.getCell(j);
                String excelHeader = excelHeaders.get(j);

                String setterMethodName = getSetterMethodName(excelHeader);

                // Skip unwanted headers
                if (setterMethodName == null) {
                    continue;
                }

                try {
                    Method setterMethod = MasterlistModel.class.getMethod(setterMethodName, String.class);
                    setterMethod.invoke(masterlistModel, getCellValueAsString(currentCell));
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            if (isUnwantedHeaderRow(currentRow) || isRowEmpty(currentRow)) {
                // Skip unwanted and empty rows
                System.out.println("Skipping unwanted or empty row at index: " + i);
                continue;
            }

            // Check if a similar entity already exists
            Optional<MasterlistModel> existingEntity = masterlistRepository
                    .findByIdNumberAndAcademicYearAndSemester(masterlistModel.getIdNumber(), academicYear, semester);

            if (!existingEntity.isPresent()) {
                // Entity does not exist, insert a new record with academic year and semester
                masterlistModel.setAcademicYear(academicYear);
                masterlistModel.setSemester(semester);
                masterlistRepository.save(masterlistModel);
                System.out.println("Inserted new record for student with student number: " + masterlistModel.getIdNumber());
            }
        }

        workbook.close();

        // Check if all rows with the same acad year, stud number, semester are already existing
        return masterlistRepository
                .countByAcademicYearAndIdNumberAndSemester(academicYear, masterlistModel.getIdNumber(), semester) > 0;
    }



    private boolean isRowEmpty(Row row) {
        for (Cell cell : row) {
            if (cell.getCellType() != CellType.BLANK) {
                return false;
            }
        }
        return true;
    }

    private String getSetterMethodName(String fieldName) {
        // Skip unwanted headers
        if ("Num".equals(fieldName) || "Full Name".equals(fieldName)) {
            return null;
        }

        // Convert Excel header to entity field name convention
        if ("Student Number".equals(fieldName)) {
            return "setIdNumber";
        }

        String[] parts = fieldName.split(" ");
        StringBuilder methodName = new StringBuilder("set");
        for (String part : parts) {
            methodName.append(part.substring(0, 1).toUpperCase()).append(part.substring(1));
        }
        return methodName.toString();
    }

    private void validateHeaders(List<String> excelHeaders) {
        List<String> expectedHeaders = Arrays.asList("First Name", "Last Name", "Middle Name", "Student Number", "Course");

        for (String header : excelHeaders) {
            if ("Num".equals(header) || "Full Name".equals(header)) {
                // Skip unwanted headers
                System.out.println("Skipping unwanted header: " + header);
                continue;
            }

            if (!expectedHeaders.contains(header)) {
                throw new IllegalArgumentException("Excel header '" + header + "' not found for entity field.");
            }
        }
    }

    private boolean isUnwantedHeaderRow(Row row) {
        // Compare the content of each cell with unwanted headers
        List<String> unwantedHeaders = Arrays.asList("Num", "Last Name", "First Name", "Middle Name", "Full Name", "Student Number", "Course");

        for (Cell cell : row) {
            String cellValue = getCellValueAsString(cell).trim();
            if (unwantedHeaders.contains(cellValue)) {
                return true;
            }
        }

        return false;
    }



    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return ""; // Handle null cells as needed
        }

        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                // Format numeric value as a string to prevent scientific notation
                return String.format("%.0f", cell.getNumericCellValue());
            case BLANK:
                return ""; // Handle blank cells as needed
            default:
                return ""; // Handle other cell types as needed
        }
    }


    private Row findHeaderRow(Sheet sheet) {
        Iterator<Row> rowIterator = sheet.iterator();

        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();

            if (isUnwantedHeaderRow(row)) {
                continue; // Skip unwanted header rows
            }

            // Check if the row contains all required headers
            if (containsAllHeaders(row)) {
                return row;
            }
        }

        return null;
    }

    private boolean containsAllHeaders(Row row) {
        // Define the list of required headers
        List<String> requiredHeaders = Arrays.asList("Last Name", "First Name", "Middle Name", "Student Number", "Course");

        // Check if all required headers are present in the row
        for (Cell cell : row) {
            if (cell.getCellType() == CellType.STRING) {
                String cellValue = cell.getStringCellValue().trim();
                if (requiredHeaders.contains(cellValue)) {
                    requiredHeaders.remove(cellValue);
                }
            }
        }

        // If the list is empty, all required headers are present
        return requiredHeaders.isEmpty();
    }





    private boolean isHeaderRow(Row row) {
        for (Cell cell : row) {
            if (cell.getCellType() != CellType.STRING) {
                return false;
            }
        }
        return true;
    }
    public List<MasterlistModel> getAllMasterlist() {
        return masterlistRepository.findAll();
    }

    public Map<String, Object> validateStudentNumber(String studentNumber) {
        try {
            // Check if the student with the given number exists and is enrolled
            Optional<MasterlistModel> masterlist = masterlistRepository.findByIdNumberAndStatus(studentNumber, "ENROLLED");

            Map<String, Object> response = new HashMap<>();

            if (masterlist.isPresent()) {
                response.put("valid", true);
                response.put("name", masterlist.get().getFirstName()+' '+masterlist.get().getLastName());
                response.put("email", masterlist.get().getFirstName().trim().toLowerCase() + '.' + masterlist.get().getLastName().toLowerCase() + "@cvsu.edu.ph");
                response.put("academicYear", masterlist.get().getAcademicYear());
                response.put("semester",masterlist.get().getSemester());
            } else {
                response.put("valid", false);
                response.put("name", null);
            }

            return response;
        } catch (Exception e) {
            // Log the exception or handle it according to your application's requirements
            e.printStackTrace();
            throw new RuntimeException("Error validating student number");
        }
    }



}

