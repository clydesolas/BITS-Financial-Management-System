package com.bsit4d.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactionUpdateRequest")
public class TransactionUpdateRequestModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Double requestId;
    @NotNull
    private String transactionId;
    @NotNull
    private Double amount;
    @NotNull
    private Double quantity;
    @NotNull
    private Double total;

    @NotNull
    private String orNumber;
    @NotNull
    private String remark;

    private String updateStatus;
    @Temporal(TemporalType.DATE)
    @NotNull
    private LocalDate transactionDate;

    @Column(name = "dateRequested")
    @CreationTimestamp
    private LocalDateTime dateRequested;

    public TransactionUpdateRequestModel() {
    }

    public TransactionUpdateRequestModel(Double requestId, String transactionId, Double amount, Double quantity, Double total, String orNumber, String remark, String updateStatus, LocalDate transactionDate, LocalDateTime dateRequested) {
        this.requestId = requestId;
        this.transactionId = transactionId;
        this.amount = amount;
        this.quantity = quantity;
        this.total = total;
        this.orNumber = orNumber;
        this.remark = remark;
        this.updateStatus = updateStatus;
        this.transactionDate = transactionDate;
        this.dateRequested = dateRequested;
    }

    public LocalDate getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDate transactionDate) {
        this.transactionDate = transactionDate;
    }

    public Double getRequestId() {
        return requestId;
    }

    public void setRequestId(Double requestId) {
        this.requestId = requestId;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }



    public String getOrNumber() {
        return orNumber;
    }

    public void setOrNumber(String orNumber) {
        this.orNumber = orNumber;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getUpdateStatus() {
        return updateStatus;
    }

    public void setUpdateStatus(String updateStatus) {
        this.updateStatus = updateStatus;
    }

    public LocalDateTime getDateRequested() {
        return dateRequested;
    }

    public void setDateRequested(LocalDateTime dateRequested) {
        this.dateRequested = dateRequested;
    }
}
