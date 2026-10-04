package com.jobconnect.service;

import com.jobconnect.dto.*;
import com.jobconnect.entity.*;
import com.jobconnect.exception.BadRequestException;
import com.jobconnect.exception.ResourceNotFoundException;
import com.jobconnect.exception.UnauthorizedException;
import com.jobconnect.repository.EmployerProfileRepository;
import com.jobconnect.repository.JobSeekerProfileRepository;
import com.jobconnect.repository.UserRepository;
import com.jobconnect.security.CustomUserPrincipal;
import com.jobconnect.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JobSeekerProfileRepository jobSeekerProfileRepository;
    private final EmployerProfileRepository employerProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       JobSeekerProfileRepository jobSeekerProfileRepository,
                       EmployerProfileRepository employerProfileRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.jobSeekerProfileRepository = jobSeekerProfileRepository;
        this.employerProfileRepository = employerProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("Email already exists");
        }

        Role role;
        try {
            role = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role specified");
        }

        if (role == Role.ADMIN) {
            throw new BadRequestException("Admin accounts cannot be registered publicly");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setPhone(request.getPhone());
        user.setStatus("ACTIVE");

        User savedUser = userRepository.save(user);

        // Auto-create initial profile
        if (role == Role.JOB_SEEKER) {
            JobSeekerProfile profile = new JobSeekerProfile(savedUser);
            profile.setPhone(request.getPhone());
            jobSeekerProfileRepository.save(profile);
        } else if (role == Role.EMPLOYER) {
            String companyName = (request.getCompanyName() != null && !request.getCompanyName().isBlank())
                    ? request.getCompanyName().trim()
                    : request.getName() + " Company";
            EmployerProfile profile = new EmployerProfile(savedUser, companyName);
            profile.setPhone(request.getPhone());
            employerProfileRepository.save(profile);
        }

        String token = tokenProvider.generateTokenFromEmail(savedUser.getEmail(), savedUser.getRole().name());

        AuthResponse response = new AuthResponse(token, savedUser.getId(), savedUser.getName(),
                savedUser.getEmail(), savedUser.getRole(), savedUser.getPhone(), savedUser.getStatus());
        enrichAuthResponse(response, savedUser);
        return response;
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        User user = principal.getUser();

        if ("SUSPENDED".equalsIgnoreCase(user.getStatus())) {
            throw new UnauthorizedException("Your account has been suspended. Please contact the administrator.");
        }

        String token = tokenProvider.generateToken(authentication);

        AuthResponse response = new AuthResponse(token, user.getId(), user.getName(),
                user.getEmail(), user.getRole(), user.getPhone(), user.getStatus());
        enrichAuthResponse(response, user);
        return response;
    }

    public AuthResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserPrincipal)) {
            throw new UnauthorizedException("User not authenticated");
        }
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        AuthResponse response = new AuthResponse(null, user.getId(), user.getName(),
                user.getEmail(), user.getRole(), user.getPhone(), user.getStatus());
        enrichAuthResponse(response, user);
        return response;
    }

    @Transactional
    public String forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(2));
        userRepository.save(user);

        // In production this would send an email; for local/development we return token or instructions
        return token;
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> new BadRequestException("Invalid or expired password reset token"));

        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Password reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }

    private void enrichAuthResponse(AuthResponse response, User user) {
        if (user.getRole() == Role.JOB_SEEKER) {
            jobSeekerProfileRepository.findByUserId(user.getId()).ifPresent(p -> {
                response.setProfileImage(p.getProfileImage());
                response.setResumeUrl(p.getResume());
                response.setProfileCompleted(p.getResume() != null && !p.getResume().isBlank());
            });
        } else if (user.getRole() == Role.EMPLOYER) {
            employerProfileRepository.findByUserId(user.getId()).ifPresent(p -> {
                response.setCompanyName(p.getCompanyName());
                response.setProfileImage(p.getLogo());
                response.setProfileCompleted(p.getCompanyName() != null && !p.getCompanyName().isBlank());
            });
        } else if (user.getRole() == Role.ADMIN) {
            response.setProfileCompleted(true);
        }
    }
}
