package com.bsit4d.backend.repository;


import com.bsit4d.backend.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<TransactionModel, Long> {
    TransactionModel findByTransactionId(String transactionId);

    @Override
    List<TransactionModel> findAll();

    //For outflow inflow breakdown
    @Query(value = "SELECT igpBalance FROM transaction WHERE allocationType = 'IGP' ORDER BY id DESC LIMIT 1", nativeQuery = true)
    Float findLatestIgpBalance();

    @Query(value = "SELECT collectionBalance FROM transaction WHERE allocationType = 'COLLECTION' ORDER BY id DESC LIMIT 1", nativeQuery = true)
    Float findLatestCollectionBalance();

    @Query(value = "SELECT donationBalance FROM transaction WHERE allocationType = 'DONATION' ORDER BY id DESC LIMIT 1", nativeQuery = true)
    Float findLatestDonationBalance();

    //For total outflow, inflow, and netprofit lostt
    @Query("SELECT NEW com.bsit4d.backend.model.TotalCashflowModel(" +
            "t.allocationType, " +
            "SUM(CASE WHEN t.transactionType = 'INFLOW' THEN t.total ELSE 0 END) as totalInflows, " +
            "SUM(CASE WHEN t.transactionType = 'OUTFLOW' THEN t.total ELSE 0 END) as totalOutflows, " +
            "SUM(CASE WHEN t.transactionType = 'INFLOW' THEN t.total ELSE -t.total END)) " +
            "FROM com.bsit4d.backend.model.TransactionModel t " +
            "WHERE t.allocationType IN ('COLLECTION', 'DONATION', 'IGP') AND t.transactionStatus = 'OK'" +
            "GROUP BY t.allocationType")
    List<TotalCashflowModel> findTotalCashflow();

   @Query(value = "SELECT t FROM TransactionModel t   WHERE t.transactionStatus='OK' ORDER BY t.transactionDate  DESC")
    List<TransactionModel> findAllByAllocationTypeInOrderByTransactionDateDesc(List<String> allocationTypes);

    List<TransactionModel> findAllByAllocationTypeInAndTransactionDateBetweenOrderByTransactionDate(List<String> allocationTypes, LocalDate startDate, LocalDate endDate);

    List<TransactionModel> findAllByAllocationTypeInAndTransactionTypeInAndTransactionDateBetweenOrderByTransactionDate(
            List<String> allocationTypes, List<String> transactionTypes,
            LocalDate startDate, LocalDate endDate);

    List<TransactionModel> findAllByTransactionTypeInAndTransactionDateBetweenOrderByTransactionDate(List<String> transactionTypes, LocalDate startDate, LocalDate endDate);


    @Query(value = "SELECT NEW com.bsit4d.backend.model.MonthlyCashflowModel(MONTHNAME(t.transactionDate) AS month, \n" +
            "            SUM(CASE WHEN t.transactionType = 'Inflow' THEN t.total ELSE 0 END) AS cashInflows, \n" +
            "            SUM(CASE WHEN t.transactionType = 'Outflow' THEN t.total ELSE 0 END) AS cashOutflows," +
            "              SUM(CASE WHEN t.transactionType = 'INFLOW' THEN t.total ELSE - t.total END))" +
            "            FROM com.bsit4d.backend.model.TransactionModel t\n" +
            "            WHERE t.allocationType = 'COLLECTION' AND t.transactionStatus = 'OK' GROUP BY YEAR(t.transactionDate), MONTHNAME(t.transactionDate), t.transactionDate \n" +
            "            ORDER BY YEAR(t.transactionDate) ASC, MONTH(t.transactionDate) ASC, t.transactionDate")
    List<MonthlyCashflowModel> getMonthlyCollection();


    @Query(value = "SELECT NEW com.bsit4d.backend.model.MonthlyCashflowModel (MONTHNAME(t.transactionDate) AS month, \n" +
            "            SUM(CASE WHEN t.transactionType = 'Inflow' THEN t.total ELSE 0 END) AS cashInflows, \n" +
            "            SUM(CASE WHEN t.transactionType = 'Outflow' THEN t.total ELSE 0 END) AS cashOutflows," +
            "              SUM(CASE WHEN t.transactionType = 'INFLOW' THEN t.total ELSE - t.total END))" +
            "            FROM com.bsit4d.backend.model.TransactionModel t\n" +
            "            WHERE t.allocationType = 'DONATION'  AND t.transactionStatus = 'OK' GROUP BY YEAR(t.transactionDate), MONTHNAME(t.transactionDate), t.transactionDate \n" +
            "            ORDER BY YEAR(t.transactionDate) ASC, MONTH(t.transactionDate) ASC, t.transactionDate")
    List<MonthlyCashflowModel> getMonthlyDonation();

    @Query(value = "SELECT NEW com.bsit4d.backend.model.MonthlyCashflowModel(MONTHNAME(t.transactionDate) AS month, \n" +
            "            SUM(CASE WHEN t.transactionType = 'Inflow' THEN t.total ELSE 0 END) AS cashInflows, \n" +
            "            SUM(CASE WHEN t.transactionType = 'Outflow' THEN t.total ELSE 0 END) AS cashOutflows," +
            "              SUM(CASE WHEN t.transactionType = 'INFLOW' THEN t.total ELSE - t.total END))" +
            "            FROM com.bsit4d.backend.model.TransactionModel t\n" +
            "            WHERE t.allocationType = 'IGP'  AND t.transactionStatus = 'OK' GROUP BY YEAR(t.transactionDate), MONTHNAME(t.transactionDate), t.transactionDate \n" +
            "            ORDER BY YEAR(t.transactionDate) ASC, MONTH(t.transactionDate) ASC, t.transactionDate")
    List<MonthlyCashflowModel> getMonthlyIgp();

    //for displaying all transaction
    List<TransactionModel> findByAllocationTypeAndTransactionStatus(String allocationType, String transactionStatus);

    @Query("SELECT t FROM TransactionModel t JOIN FETCH t.transactionVersion WHERE t.transactionStatus = 'OK'")
    List<TransactionModel> findAllWithTransactionVersion();
    List<TransactionModel> findByIdNumberAndTransactionStatus(Long idNumber, String transactionStatus);

    boolean existsByStudentNumberAndAcademicYearAndSemesterAndParticularAndTransactionStatus(String studentNumber, String academicYear, String semester, String particular, String transactionStatus);

    TransactionModel findByTransactionIdAndAuditorRemark(String transactionId, String auditorRemark);

    List<TransactionModel> findAllByTransactionDateBetweenOrderByTransactionDate(LocalDate startDate, LocalDate endDate);

    List<TransactionModel> findAllByAllocationTypeInAndTransactionTypeInAndTransactionDateBetweenAndTransactionStatusOrderByTransactionDate(List<String> allocationTypes, List<String> transactionTypes, LocalDate startDate, LocalDate endDate, String transactionStatus);

    List<TransactionModel> findAllByAllocationTypeInAndTransactionDateBetweenAndTransactionStatusOrderByTransactionDate(List<String> allocationTypes, LocalDate startDate, LocalDate endDate, String transactionStatus);

    List<TransactionModel> findAllByTransactionTypeInAndTransactionDateBetweenAndTransactionStatusOrderByTransactionDate(List<String> transactionTypes, LocalDate startDate, LocalDate endDate, String transactionStatus);

    List<TransactionModel> findAllByTransactionDateBetweenAndTransactionStatusOrderByTransactionDate(LocalDate startDate, LocalDate endDate, String transactionStatus);

    List<TransactionModel> findAllByTransactionStatus(String transactionStatus);

    List<TransactionModel> findAllByAuditorRemark(String auditorRemark);

    List<TransactionModel> findAllByAuditorRemarkAndTransactionStatus(String auditorRemark, String transactionStatus);
}
