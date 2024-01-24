package com.bsit4d.backend.service;

import com.bsit4d.backend.model.TransactionModel;
import com.bsit4d.backend.model.UpdatePriceModel;
import org.springframework.stereotype.Service;

@Service
public class UpdatePriceRepository {
    private UpdatePriceRepository updatePriceRepository;
    public String updateTransaction(String transactionId) {
        UpdatePriceModel existingTransaction = updatePriceRepository.findByAuditorRemark("PENDING");
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

    private UpdatePriceModel findByAuditorRemark(String auditorRemark) {
    }
}
