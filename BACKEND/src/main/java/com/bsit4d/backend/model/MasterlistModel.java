package com.bsit4d.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "masterlist")
public class MasterlistModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long masterlistId;
    private String firstName;
    private String middleName;
    private String lastName;
    private String idNumber;
    private String course;
    private String academicYear;
    private String semester;
    @Column(name = "status", columnDefinition = "VARCHAR(255) DEFAULT 'ENROLLED'")
    private String status = "ENROLLED";
    @Column(name = "dateAdded", nullable = false, updatable = false)
    @CreationTimestamp
    @Temporal(TemporalType.DATE)
    private Date dateAdded;

    public MasterlistModel() {

    }

    public Long getMasterlistId() {
        return masterlistId;
    }

    public void setMasterlistId(Long masterlistId) {
        this.masterlistId = masterlistId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getIdNumber() {
        return idNumber;
    }

    public void setIdNumber(String idNumber) {
        this.idNumber = idNumber;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getDateAdded() {
        return dateAdded;
    }

    public void setDateAdded(Date dateAdded) {
        this.dateAdded = dateAdded;
    }

    public MasterlistModel(Long masterlistId, String firstName, String middleName, String lastName, String idNumber, String course, String academicYear, String semester, String status, Date dateAdded) {
        this.masterlistId = masterlistId;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.idNumber = idNumber;
        this.course = course;
        this.academicYear = academicYear;
        this.semester = semester;
        this.status = status;
        this.dateAdded = dateAdded;
    }
}


