package com.bsit4d.backend.repository;

import com.bsit4d.backend.model.TransactionModel;
import com.bsit4d.backend.model.TransactionUpdateRequestModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionUpdateRequestRepository  extends JpaRepository<TransactionUpdateRequestModel, Long> {

    TransactionUpdateRequestModel findByRequestId(Long requestId);
}
