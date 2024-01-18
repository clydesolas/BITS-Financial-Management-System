package com.bsit4d.backend.controller;

import com.bsit4d.backend.model.PriceModel;
import com.bsit4d.backend.service.PriceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/price")
public class PriceController {

    private final PriceService priceService;

    @Autowired
    public PriceController(PriceService priceService) {
        this.priceService = priceService;
    }

    @GetMapping("/get")
    public ResponseEntity<PriceModel> getPrice() {
        try {
            PriceModel price = priceService.getPrice();
            if (price != null) {
                return new ResponseEntity<>(price, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            // Log the exception for troubleshooting
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PreAuthorize("hasAuthority ('TREASURER')")
    @PutMapping("/update")
    public ResponseEntity<PriceModel> updatePrice(@RequestBody PriceModel newPrice) {
        try {
            PriceModel updatedPrice = priceService.updatePrice(newPrice);
            if (updatedPrice != null) {
                return new ResponseEntity<>(updatedPrice, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
