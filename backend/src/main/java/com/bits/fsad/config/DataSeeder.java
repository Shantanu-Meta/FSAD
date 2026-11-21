package com.bits.fsad.config;

import com.bits.fsad.entity.*;
import com.bits.fsad.repository.ApplicationRepository;
import com.bits.fsad.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

/**
 * Seeds the two default users with valid bcrypt hashes and a couple of sample
 * PENDING applications. Reference data (courses/fees/subjects) comes from data.sql.
 */
@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedUsers(UserRepository userRepository,
                                ApplicationRepository applicationRepository,
                                PasswordEncoder encoder) {
        return args -> {
            if (userRepository.existsByUsername("admin")) {
                return; // already seeded
            }

            User admin = new User();
            admin.setUsername("admin");
            admin.setPasswordHash(encoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            admin.setFullName("System Administrator");
            admin.setEmail("admin@college.edu");
            admin.setIsActive(true);
            userRepository.save(admin);

            User clerk = new User();
            clerk.setUsername("clerk");
            clerk.setPasswordHash(encoder.encode("clerk123"));
            clerk.setRole(Role.CLERK);
            clerk.setFullName("Front Desk Clerk");
            clerk.setEmail("clerk@college.edu");
            clerk.setIsActive(true);
            userRepository.save(clerk);

            // Sample applications entered by the clerk for demo/review.
            if (applicationRepository.count() == 0) {
                Application a1 = new Application();
                a1.setApplicantName("Ravi Kumar");
                a1.setDateOfBirth(LocalDate.of(2005, 6, 15));
                a1.setGender("Male");
                a1.setEmail("ravi@example.com");
                a1.setPhone("9876543210");
                a1.setAddress("Bangalore");
                a1.setCourseId(1L); // BCA
                a1.setAcademicRecord("10+2 PCM 78%");
                a1.setStatus(ApplicationStatus.PENDING);
                a1.setEnteredBy(clerk.getUserId());
                applicationRepository.save(a1);

                Application a2 = new Application();
                a2.setApplicantName("Priya Sharma");
                a2.setDateOfBirth(LocalDate.of(2004, 3, 22));
                a2.setGender("Female");
                a2.setEmail("priya@example.com");
                a2.setPhone("9876500000");
                a2.setAddress("Mumbai");
                a2.setCourseId(2L); // MBA
                a2.setAcademicRecord("B.Com 68%");
                a2.setStatus(ApplicationStatus.PENDING);
                a2.setEnteredBy(clerk.getUserId());
                applicationRepository.save(a2);
            }
        };
    }
}
