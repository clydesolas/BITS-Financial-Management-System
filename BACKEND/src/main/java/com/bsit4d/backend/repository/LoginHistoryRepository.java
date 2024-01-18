package com.bsit4d.backend.repository;

import com.bsit4d.backend.model.LoginHistoryModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LoginHistoryRepository extends JpaRepository<LoginHistoryModel, Long> {
   Optional<LoginHistoryModel> findByLogDateAndIdNumber(LocalDateTime dateAdded, Long username);

    List<LoginHistoryModel> findByIdNumber(Long idNumber);

}