package com.bsit4d.backend.repository;

import com.bsit4d.backend.model.LoginHistoryModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LoginHistoryRepository extends JpaRepository<LoginHistoryModel, Long> {
   Optional<LoginHistoryModel> findByLogDateAndIdNumber(LocalDateTime dateAdded, Long username);

    List<LoginHistoryModel> findByIdNumber(Long idNumber);
    @Query("SELECT DISTINCT DATE_FORMAT(lh.logDate, '%Y-%m-%d %H:%i') FROM LoginHistoryModel lh WHERE lh.idNumber = :idNumber ORDER BY DATE_FORMAT(lh.logDate, '%Y-%m-%d %H:%i') DESC")
    List<String> findDistinctLogDateByidNumber(Long idNumber);
}