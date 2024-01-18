package com.bsit4d.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "price")
public class PriceModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long priceId;
    private Double membershipFee;
    private Double shirtPrice;

    public Long getPriceId() {
        return priceId;
    }

    public void setPriceId(Long priceId) {
        this.priceId = priceId;
    }

    public Double getMembershipFee() {
        return membershipFee;
    }

    public void setMembershipFee(Double membershipFee) {
        this.membershipFee = membershipFee;
    }

    public Double getShirtPrice() {
        return shirtPrice;
    }

    public void setShirtPrice(Double shirtPrice) {
        this.shirtPrice = shirtPrice;
    }

    public PriceModel(Long priceId, Double membershipFee, Double shirtPrice) {
        this.priceId = priceId;
        this.membershipFee = membershipFee;
        this.shirtPrice = shirtPrice;
    }

    public PriceModel() {
    }
}
