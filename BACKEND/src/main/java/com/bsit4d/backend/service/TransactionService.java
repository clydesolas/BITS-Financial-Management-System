package com.bsit4d.backend.service;


import com.bsit4d.backend.model.*;
import com.bsit4d.backend.repository.TransactionRepository;
import com.bsit4d.backend.repository.TransactionUpdateRequestRepository;
import com.bsit4d.backend.repository.TransactionVersionRepository;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.*;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private TransactionUpdateRequestRepository transactionUpdateRequestRepository;
    @Autowired
    private TransactionVersionRepository transactionVersionRepository;
    @Autowired
    private EntityManager entityManager;
    @Autowired
    private UserService userService;

    @Value("${image.storage.path}")
    private String storagePath;

    public String save(MultipartFile file, TransactionModel transactionModel) {
        try {
            // Set the associatedUser in the transactionModel
            UserDetails associatedUser = userService.getLoggedInUserDetails();
            transactionModel.setIdNumber(Double.parseDouble(associatedUser.getUsername()));

            // Save the transaction to the database without image data
            transactionRepository.save(transactionModel);

            // Set image data only if a file is provided
            if (file != null && !file.isEmpty()) {
                String filename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
                String uniqueFilename = UUID.randomUUID().toString() + "-" + filename;

                // Create the directory if it doesn't exist
                Path storageDirectory = Paths.get(storagePath);
                Files.createDirectories(storageDirectory);

                // Save the file to the storage directory
                Path filePath = storageDirectory.resolve(uniqueFilename);
                Files.copy(file.getInputStream(), filePath);

                // Construct the relative image path without './uploads/'
                String relativeImagePath = storageDirectory.relativize(filePath).toString();

                // Set the image path in the transactionModel
                transactionModel.setImagePath(relativeImagePath);

                // Update the transactionModel in the database with the image path
                transactionRepository.save(transactionModel);
            }

            return "Success";
        } catch (IOException e) {
            return "Error saving transaction with image: " + e.getMessage();
        } catch (Exception e) {
            return e.getMessage();
        }
    }

    public boolean doesTransactionExist(String studentNumber, String academicYear, String semester, String particular) {
        return transactionRepository.existsByStudentNumberAndAcademicYearAndSemesterAndParticularAndTransactionStatus(studentNumber, academicYear, semester, particular, "OK");
    }



    public String updateTransaction(String transactionId) {
        TransactionModel existingTransaction = transactionRepository.findByTransactionIdAndAuditorRemark(transactionId, "PENDING");
        TransactionModel existingTransaction2 = transactionRepository.findByTransactionIdAndAuditorRemark(transactionId, "NONE");

        try {
            if(existingTransaction!=null) {
                existingTransaction.setAuditorRemark("NONE");
                transactionRepository.save(existingTransaction);
                System.out.println("Res"+existingTransaction.getAuditorRemark());
                return "Success";
                }
            if(existingTransaction2!=null) {
                existingTransaction2.setAuditorRemark("PENDING");
                transactionRepository.save(existingTransaction2);
                System.out.println("Res"+existingTransaction2.getAuditorRemark());
                return "Success";
            }
            else{
                return "Transaction id does not exist.";
            }
//            if("PENDING".equals(existingTransaction.getAuditorRemark())) {
//                existingTransaction.setAuditorRemark("NONE");
//                transactionRepository.save(existingTransaction);
//            }


        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
        }

    public String voidApprovalTransaction(String transactionId, String approval) {
        try {
            if (approval != null) {
                // Retrieve the existing transaction based on transactionId
                TransactionModel existingTransaction = transactionRepository.findByTransactionId(transactionId);

                // Update the transaction based on the approval status (case-insensitive)
                if (approval.equalsIgnoreCase("ACCEPT")) {
                    existingTransaction.setAuditorRemark("ACCEPTED");
                    existingTransaction.setTransactionStatus("VOID");
                } else if (approval.equalsIgnoreCase("CANCEL")) {
                    existingTransaction.setAuditorRemark("NONE");
                    existingTransaction.setTransactionStatus("OK");
                } else if (approval.equalsIgnoreCase("RETURN")) {
                    existingTransaction.setAuditorRemark("NONE");
                    existingTransaction.setTransactionStatus("PENDING");
                }
                System.out.println("Received approval: " + approval);
                // Save the updated transaction
                transactionRepository.save(existingTransaction);

                return "Success";
            } else {
                return "Error: Approval is null";
            }
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }


//    public String updateTransaction(Long requestId, String transactionId, String updateStatus) {
//        try {
//            TransactionModel existingTransaction = transactionRepository.findByTransactionId(transactionId);
//            TransactionUpdateRequestModel requestTransaction = transactionUpdateRequestRepository.findByRequestId(requestId);
//
//            TransactionVersionModel auditLog = new TransactionVersionModel();
//            auditLog.setTransaction(existingTransaction);
//            auditLog.setAmount(existingTransaction.getAmount());
//            auditLog.setQuantity(existingTransaction.getQuantity());
//            auditLog.setTotal(existingTransaction.getTotal());
//            auditLog.setRemark(existingTransaction.getRemark());
//            auditLog.setOrNumber(existingTransaction.getOrNumber());
//            auditLog.setVersion(existingTransaction.getVersion());
//            auditLog.setTransactionDate(existingTransaction.getTransactionDate());
//            auditLog.setChangeTime(LocalDate.now().atStartOfDay());
//
//            existingTransaction.setAmount(requestTransaction.getAmount());
//            existingTransaction.setQuantity(requestTransaction.getQuantity());
//            existingTransaction.setTotal(requestTransaction.getTotal());
//            existingTransaction.setRemark(requestTransaction.getRemark());
//            existingTransaction.setOrNumber(requestTransaction.getOrNumber());
//            existingTransaction.setTransactionDate(requestTransaction.getTransactionDate());
////            logger.info("Before: {}", existingTransaction.getVersion());
////            System.out.println("Before:"+existingTransaction.getVersion());
//            transactionRepository.save(existingTransaction);
//
////            System.out.println("After:"+existingTransaction.getVersion());
//            transactionVersionRepository.save(auditLog);
//
//            return "Success";
//        } catch (Exception e) {
//            // Log the exception or handle it based on your application's needs
//            return "Error: " + e.getMessage();
//        }
//    }

//    public String updateRequestTransaction(String transactionId, TransactionUpdateRequestModel updatedTransaction) {
//        try {
//            TransactionModel existingTransaction = transactionRepository.findByTransactionId(transactionId);
//
//            TransactionUpdateRequestModel requested = new TransactionUpdateRequestModel();
//            requested.setTransactionId(existingTransaction.getTransactionId());
//            requested.setAmount(updatedTransaction.getAmount());
//            requested.setQuantity(updatedTransaction.getQuantity());
//            requested.setTotal(updatedTransaction.getTotal());
//            requested.setRemark(updatedTransaction.getRemark());
//            requested.setOrNumber(updatedTransaction.getOrNumber());
//            requested.setTransactionDate(updatedTransaction.getTransactionDate());
//            requested.setUpdateStatus("PENDING");
//            transactionUpdateRequestRepository.save(requested);
//
//            return "Success";
//        } catch (Exception e) {
//            // Log the exception or handle it based on your application's needs
//            return "Error: " + e.getMessage();
//        }
//    }


    public List<TotalCashflowModel> findTotalCashflow() {
        return transactionRepository.findTotalCashflow();
    }


    public List<MonthlyCashflowModel> getMonthlyCollection() {
        List<MonthlyCashflowModel> transactionModels = transactionRepository.getMonthlyCollection();
        double balance = 0.0;

        for (MonthlyCashflowModel transactionModel : transactionModels) {
            Double cashInflows = 0.0;
            Double cashOutflows = 0.0;
            cashInflows = transactionModel.getCashOnHands();
            balance += cashInflows - cashOutflows;
            transactionModel.setCashOnHands(balance);
        }

        return transactionModels;
    }

    public List<MonthlyCashflowModel> getMonthlyDonation() {
        List<MonthlyCashflowModel> transactionModels = transactionRepository.getMonthlyDonation();
        double balance = 0.0;

        for (MonthlyCashflowModel transactionModel : transactionModels) {
            Double cashInflows = 0.0;
            Double cashOutflows = 0.0;
            cashInflows = transactionModel.getCashOnHands();
            balance += cashInflows - cashOutflows;
            transactionModel.setCashOnHands(balance);
        }

        return transactionModels;
    }

    public List<MonthlyCashflowModel> getMonthlyIgp() {
        List<MonthlyCashflowModel> transactionModels = transactionRepository.getMonthlyIgp();
        double balance = 0.0;

        for (MonthlyCashflowModel transactionModel : transactionModels) {
            Double cashInflows = 0.0;
            Double cashOutflows = 0.0;
            cashInflows = transactionModel.getCashOnHands();
            balance += cashInflows - cashOutflows;
            transactionModel.setCashOnHands(balance);
        }

        return transactionModels;
    }

    //
//    public List<MonthlyDonationModel> findMonthlyDonation() {
//        return transactionRepository.findMonthlyDonation();
//    }
//    public List<MonthlyIgpModel> findMonthlyIgp() {
//        return transactionRepository.findMonthlyIgp();
//    }
    public List<TransactionModel> findAllTransactionsWithBalance() {
        List<TransactionModel> transactionModels = transactionRepository.findAllByAllocationTypeInOrderByTransactionDateDesc(
                List.of("DONATION", "COLLECTION", "IGP"));

        double balanceCollection = 0.0;
        double balanceDonation = 0.0;
        double balanceIGP = 0.0;

        for (TransactionModel transactionModel : transactionModels) {
            Double cashInflows = 0.0;
            Double cashOutflows = 0.0;

            if ("INFLOW".equals(transactionModel.getTransactionType())) {
                cashInflows = transactionModel.getTotal();
            } else if ("OUTFLOW".equals(transactionModel.getTransactionType())) {
                cashOutflows = transactionModel.getTotal();
            }

            if ("COLLECTION".equals(transactionModel.getAllocationType())) {
                balanceCollection += cashInflows - cashOutflows;
            } else if ("DONATION".equals(transactionModel.getAllocationType())) {
                balanceDonation += cashInflows - cashOutflows;
            } else if ("IGP".equals(transactionModel.getAllocationType())) {
                balanceIGP += cashInflows - cashOutflows;
            }

            transactionModel.setBalance(balanceCollection, balanceDonation, balanceIGP);
        }
        Collections.reverse(transactionModels);
        return transactionModels;
    }

    public List<TransactionModel> findAllTransactionsDateRange(
            LocalDate startDate, LocalDate endDate,
            List<String> allocationTypes, List<String> transactionTypes) {
        List<TransactionModel> transactionModels;

        if (allocationTypes != null && transactionTypes != null) {
            transactionModels = transactionRepository.findAllByAllocationTypeInAndTransactionTypeInAndTransactionDateBetweenAndTransactionStatusOrderByTransactionDate(
                    allocationTypes, transactionTypes, startDate, endDate, "OK");
        } else if (allocationTypes != null) {
            transactionModels = transactionRepository.findAllByAllocationTypeInAndTransactionDateBetweenAndTransactionStatusOrderByTransactionDate(
                    allocationTypes, startDate, endDate, "OK");
        } else if (transactionTypes != null) {
            transactionModels = transactionRepository.findAllByTransactionTypeInAndTransactionDateBetweenAndTransactionStatusOrderByTransactionDate(
                    transactionTypes, startDate, endDate, "OK");
        } else {
            transactionModels = transactionRepository.findAllByTransactionDateBetweenAndTransactionStatusOrderByTransactionDate(startDate, endDate, "OK");
        }

        double balanceCollection = 0.0;
        double balanceDonation = 0.0;
        double balanceIGP = 0.0;

        for (TransactionModel transactionModel : transactionModels) {
            Double cashInflows = 0.0;
            Double cashOutflows = 0.0;

            if ("INFLOW".equals(transactionModel.getTransactionType())) {
                cashInflows = transactionModel.getTotal();
            } else if ("OUTFLOW".equals(transactionModel.getTransactionType())) {
                cashOutflows = transactionModel.getTotal();
            }

            if ("COLLECTION".equals(transactionModel.getAllocationType())) {
                balanceCollection += cashInflows - cashOutflows;
            } else if ("DONATION".equals(transactionModel.getAllocationType())) {
                balanceDonation += cashInflows - cashOutflows;
            } else if ("IGP".equals(transactionModel.getAllocationType())) {
                balanceIGP += cashInflows - cashOutflows;
            }

            transactionModel.setBalance(balanceCollection, balanceDonation, balanceIGP);
        }

        return transactionModels;
    }


    public List<TransactionModel> findAllIgpTransactions() {
        try {
            return transactionRepository.findByAllocationTypeAndTransactionStatus("IGP","OK");
        } catch (Exception e) {
            // Log the exception or handle it accordingly
            e.printStackTrace();
            throw new RuntimeException("Error retrieving IGP transactions", e);
        }
    }

    public List<TransactionModel> findAllCollectionTransactions() {
        try {
            return transactionRepository.findByAllocationTypeAndTransactionStatus("COLLECTION","OK");
        } catch (Exception e) {
            // Log the exception or handle it accordingly
            e.printStackTrace();
            throw new RuntimeException("Error retrieving Collection transactions", e);
        }
    }

    public List<TransactionModel> findAllDonationTransactions() {
        try {
            return transactionRepository.findByAllocationTypeAndTransactionStatus("DONATION","OK");
        } catch (Exception e) {
            // Log the exception or handle it accordingly
            e.printStackTrace();
            throw new RuntimeException("Error retrieving Donation transactions", e);
        }
    }


    public List<TransactionModel> getAllTransactions() {
        return transactionRepository.findAll();
    }


//    public String updateLogsTransaction(String transactionId) {
//        TransactionVersionModel existingTransaction = transactionVersionRepository.findByTransactionId(transactionId);
//        if (existingTransaction!=null){
//            return "Success";
//        }
//        else{
//            return "Error";
//        }
//    }

    public List<TransactionModel> getAllTransactionsWithVersions() {
        return transactionRepository.findAllWithTransactionVersion();
    }


    public byte[] generateExcel(List<TransactionModel> transactions) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Transactions");

            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Transaction ID");
            headerRow.createCell(1).setCellValue("Transaction Date");
            headerRow.createCell(2).setCellValue("Type");
            headerRow.createCell(3).setCellValue("Amount");
            headerRow.createCell(4).setCellValue("Quantity");
            headerRow.createCell(5).setCellValue("Total");
            headerRow.createCell(6).setCellValue("Balance");
            headerRow.createCell(7).setCellValue("Particular");
            headerRow.createCell(8).setCellValue("OR Number");
            headerRow.createCell(9).setCellValue("Remark");


            for (int i = 0; i <= 9; i++) {
                headerRow.getCell(i).setCellStyle(headerStyle);
            }

            int rowNum = 1;
            for (TransactionModel transaction : transactions) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(transaction.getTransactionId());
                row.createCell(1).setCellValue(transaction.getTransactionDate().toString());
                row.createCell(2).setCellValue(transaction.getAllocationType());
                row.createCell(3).setCellValue(transaction.getAmount());
                row.createCell(4).setCellValue(transaction.getQuantity());
                row.createCell(5).setCellValue(transaction.getTotal());
                row.createCell(6).setCellValue(transaction.getBalance());
                row.createCell(7).setCellValue(transaction.getParticular());
                row.createCell(8).setCellValue(transaction.getOrNumber());
                row.createCell(9).setCellValue(transaction.getRemark());
            }

            // Auto-resize columns
            for (int i = 0; i <= 9; i++) {
                sheet.autoSizeColumn(i);
            }

            try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
                workbook.write(outputStream);
                return outputStream.toByteArray();
            }

        } catch (IOException e) {
            e.printStackTrace();
            throw e;
        }
    }


    public List<TransactionModel> findAllTransactionsVoid() {
        List<TransactionModel> transactionModels = transactionRepository.findAllByAuditorRemarkAndTransactionStatus("PENDING","OK");
        transactionModels.sort(Comparator.comparing(TransactionModel::getTransactionDate).reversed());
        return transactionModels;
    }

}
