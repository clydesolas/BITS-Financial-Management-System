package com.bsit4d.backend.service;

import com.bsit4d.backend.model.PriceModel;
import com.bsit4d.backend.repository.PriceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
@Service
public class PriceService {

    private final PriceRepository priceRepository;

    @Autowired
    public PriceService(PriceRepository priceRepository) {
        this.priceRepository = priceRepository;
    }

    public PriceModel getPrice() {
        return priceRepository.findById(1L).orElse(null);
    }

    public PriceModel updatePrice(PriceModel newPrice) {
        PriceModel currentPrice = getPrice();
        if (currentPrice != null) {
            currentPrice.setMembershipFee(newPrice.getMembershipFee());
            currentPrice.setShirtPrice(newPrice.getShirtPrice());
            return priceRepository.save(currentPrice);
        }
        return null;
    }
}