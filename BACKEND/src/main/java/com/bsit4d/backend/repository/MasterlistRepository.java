package com.bsit4d.backend.repository;

import com.bsit4d.backend.model.MasterlistModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MasterlistRepository extends JpaRepository<MasterlistModel, Long> {
    // Add custom query methods if needed
    Optional<MasterlistModel> findByIdNumber(String idNumber);
    Optional<MasterlistModel> findByIdNumberAndStatus(String idNumber, String status);
    boolean existsByFirstNameAndMiddleNameAndLastNameAndIdNumberAndCourse(
            String firstName, String middleName, String lastName, String idNumber, String course);
    int  countByAcademicYearAndIdNumberAndSemester(String academicYear, String idNumber, String semester);
    Optional<MasterlistModel> findByIdNumberAndAcademicYearAndSemester(String idNumber, String academicYear, String semester);

    @Modifying
    @Query(value = "UPDATE masterlist\n" +
            "SET status = 'ARCHIVED'\n" +
            "WHERE MONTH(CURDATE()) - MONTH(dateAdded) >= 4 AND status = 'ENROLLED' LIMIT 1;\n", nativeQuery = true)
    void updateStatusBasedOnDate();
}

