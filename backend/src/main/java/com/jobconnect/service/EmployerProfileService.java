package com.jobconnect.service;

import com.jobconnect.dto.EmployerProfileRequest;
import com.jobconnect.dto.EmployerProfileResponse;
import com.jobconnect.entity.EmployerProfile;
import com.jobconnect.entity.User;
import com.jobconnect.exception.BadRequestException;
import com.jobconnect.exception.ResourceNotFoundException;
import com.jobconnect.repository.ApplicationRepository;
import com.jobconnect.repository.EmployerProfileRepository;
import com.jobconnect.repository.JobRepository;
import com.jobconnect.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployerProfileService {

    private final EmployerProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final FileStorageService fileStorageService;

    public EmployerProfileService(EmployerProfileRepository profileRepository,
                                  UserRepository userRepository,
                                  JobRepository jobRepository,
                                  ApplicationRepository applicationRepository,
                                  FileStorageService fileStorageService) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.fileStorageService = fileStorageService;
    }

    public EmployerProfileResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        EmployerProfile profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    EmployerProfile newProfile = new EmployerProfile(user, user.getName() + " Company");
                    return profileRepository.save(newProfile);
                });

        return mapToResponse(profile, user);
    }

    public EmployerProfileResponse getCompanyById(Long id) {
        EmployerProfile profile = profileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
        return mapToResponse(profile, profile.getUser());
    }

    public List<EmployerProfileResponse> getAllCompanies(String search) {
        List<EmployerProfile> profiles;
        if (search != null && !search.isBlank()) {
            profiles = profileRepository.findByCompanyNameContainingIgnoreCaseOrIndustryContainingIgnoreCaseOrLocationContainingIgnoreCase(
                    search.trim(), search.trim(), search.trim());
        } else {
            profiles = profileRepository.findAll();
        }

        return profiles.stream()
                .map(p -> mapToResponse(p, p.getUser()))
                .collect(Collectors.toList());
    }

    @Transactional
    public EmployerProfileResponse updateProfile(Long userId, EmployerProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        EmployerProfile profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> new EmployerProfile(user, request.getCompanyName() != null ? request.getCompanyName() : user.getName()));

        if (request.getCompanyName() != null && !request.getCompanyName().isBlank()) {
            profile.setCompanyName(request.getCompanyName().trim());
        }
        if (request.getDescription() != null) {
            profile.setDescription(request.getDescription());
        }
        if (request.getIndustry() != null) {
            profile.setIndustry(request.getIndustry());
        }
        if (request.getLocation() != null) {
            profile.setLocation(request.getLocation());
        }
        if (request.getWebsite() != null) {
            profile.setWebsite(request.getWebsite());
        }
        if (request.getCompanySize() != null) {
            profile.setCompanySize(request.getCompanySize());
        }
        if (request.getFoundedYear() != null) {
            profile.setFoundedYear(request.getFoundedYear());
        }
        if (request.getPhone() != null) {
            profile.setPhone(request.getPhone());
            user.setPhone(request.getPhone());
            userRepository.save(user);
        }

        EmployerProfile saved = profileRepository.save(profile);
        return mapToResponse(saved, user);
    }

    @Transactional
    public EmployerProfileResponse uploadLogo(Long userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        EmployerProfile profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> new EmployerProfile(user, user.getName()));

        if (profile.getLogo() != null) {
            fileStorageService.deleteFile(profile.getLogo(), "logos");
        }

        String storedLogo = fileStorageService.storeLogo(file);
        profile.setLogo(storedLogo);

        EmployerProfile saved = profileRepository.save(profile);
        return mapToResponse(saved, user);
    }

    @Transactional
    public void deleteCompanyAccount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        EmployerProfile profile = profileRepository.findByUserId(userId).orElse(null);
        if (profile != null) {
            if (profile.getLogo() != null) {
                fileStorageService.deleteFile(profile.getLogo(), "logos");
            }
            profileRepository.delete(profile);
        }

        userRepository.delete(user);
    }

    private EmployerProfileResponse mapToResponse(EmployerProfile profile, User user) {
        EmployerProfileResponse res = new EmployerProfileResponse();
        res.setId(profile.getId());
        res.setUserId(user.getId());
        res.setCompanyName(profile.getCompanyName());
        res.setEmail(user.getEmail());
        res.setPhone(profile.getPhone() != null ? profile.getPhone() : user.getPhone());
        res.setLogo(profile.getLogo());
        res.setDescription(profile.getDescription());
        res.setIndustry(profile.getIndustry());
        res.setLocation(profile.getLocation());
        res.setWebsite(profile.getWebsite());
        res.setCompanySize(profile.getCompanySize());
        res.setFoundedYear(profile.getFoundedYear());
        res.setCreatedAt(profile.getCreatedAt());
        res.setUpdatedAt(profile.getUpdatedAt());

        res.setTotalJobs(jobRepository.countByEmployerId(user.getId()));
        return res;
    }
}
