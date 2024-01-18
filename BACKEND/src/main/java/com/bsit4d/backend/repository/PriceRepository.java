package com.bsit4d.backend.repository;

import com.bsit4d.backend.model.PriceModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PriceRepository extends JpaRepository<PriceModel, Long> {
}
