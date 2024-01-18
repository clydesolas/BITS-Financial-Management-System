package com.bsit4d.backend.config;

// DataLoader.java
import com.bsit4d.backend.model.PriceModel;
import com.bsit4d.backend.model.UserModel;
import com.bsit4d.backend.repository.PriceRepository;
import com.bsit4d.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PriceRepository priceRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataLoader(UserRepository userRepository, PriceRepository priceRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.priceRepository = priceRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        loadUserData();
        loadPriceData();
    }

    private void loadUserData() {
        loadUserIfNotExists("202010372", "ADMIN");
        loadUserIfNotExists("202010373", "TREASURER");
        loadUserIfNotExists("202010374", "AUDITOR");
        loadUserIfNotExists("202010375", "OTHER_OFFICER");
    }

    private void loadUserIfNotExists(String idNumber, String role) {
        if (userRepository.findByIdNumber(Long.parseLong(idNumber)).isEmpty()) {
            UserModel user = new UserModel();
            user.setIdNumber(Long.parseLong(idNumber));
            user.setRole(role);
            user.setStatus("ACTIVE");
            user.setFirstName("Clyde");
            user.setMiddleName("S");
            user.setLastName("Solas");
            user.setPassword(passwordEncoder.encode("1234"));
            userRepository.save(user);
        }
    }

    private void loadPriceData() {
        if (priceRepository.findById(Long.parseLong("1")).isEmpty()) {
            PriceModel price = new PriceModel();
            price.setShirtPrice(Double.parseDouble("250"));
            price.setMembershipFee(Double.parseDouble("80"));
            priceRepository.save(price);
        }
    }
}
