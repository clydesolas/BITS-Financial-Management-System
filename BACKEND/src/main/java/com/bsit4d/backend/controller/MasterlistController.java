package com.bsit4d.backend.controller;

import com.bsit4d.backend.model.MasterlistModel;
import com.bsit4d.backend.service.MasterlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/masterlist")
public class MasterlistController {

    @Autowired
    private MasterlistService masterlistService;
    @PreAuthorize("hasAuthority ('TREASURER')")
    @PostMapping("/upload")
    public ResponseEntity<String> uploadMasterlist(
            @RequestParam("file") MultipartFile file,
            @RequestParam("academicYear") String academicYear,
            @RequestParam("semester") String semester) {
        try {
            boolean allRowsExist = masterlistService.processExcelFile(file, academicYear, semester);

            if (allRowsExist) {
                return ResponseEntity.ok("All rows with the same academic year, student number, and semester already exist.");
            } else {
                return ResponseEntity.ok("Rows processed successfully.");
            }
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing the Excel file.");
        }
    }

    @GetMapping("/get")
    @PreAuthorize("hasAuthority ('TREASURER')")
    public List<MasterlistModel> getAllMasterlist() {
        return masterlistService.getAllMasterlist();
    }

    @GetMapping("/validateStudentNumber/{studentNumber}")
    public ResponseEntity<Map<String, Object>> validateStudentNumber(@PathVariable String studentNumber) {
        try {
            Map<String, Object> response = masterlistService.validateStudentNumber(studentNumber);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Log the exception or handle it according to your application's requirements
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/status")
    public ResponseEntity<String> updateStatusBasedOnDate() {
        masterlistService.updateStatusBasedOnDate();
        return ResponseEntity.ok("Masterlist statuses updated");
    }
}

