package com.jobconnect.service;

import com.jobconnect.dto.JobSeekerProfileRequest;
import com.jobconnect.dto.JobSeekerProfileResponse;
import com.jobconnect.entity.JobSeekerProfile;
import com.jobconnect.entity.User;
import com.jobconnect.exception.BadRequestException;
import com.jobconnect.exception.ResourceNotFoundException;
import com.jobconnect.repository.ApplicationRepository;
import com.jobconnect.repository.JobSeekerProfileRepository;
import com.jobconnect.repository.SavedJobRepository;
import com.jobconnect.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Service
public class JobSeekerProfileService {

    private final JobSeekerProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final ApplicationRepository applicationRepository;
    private final SavedJobRepository savedJobRepository;

    public JobSeekerProfileService(JobSeekerProfileRepository profileRepository,
                                  UserRepository userRepository,
                                  FileStorageService fileStorageService,
                                  ApplicationRepository applicationRepository,
                                  SavedJobRepository savedJobRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
        this.applicationRepository = applicationRepository;
        this.savedJobRepository = savedJobRepository;
    }

    public JobSeekerProfileResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        JobSeekerProfile profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    JobSeekerProfile newProfile = new JobSeekerProfile(user);
                    return profileRepository.save(newProfile);
                });

        return mapToResponse(profile, user);
    }

    @Transactional
    public JobSeekerProfileResponse updateProfile(Long userId, JobSeekerProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName().trim());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().trim());
        }
        userRepository.save(user);

        JobSeekerProfile profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> new JobSeekerProfile(user));

        profile.setPhone(request.getPhone());
        profile.setAddress(request.getAddress());
        profile.setDateOfBirth(request.getDateOfBirth());
        profile.setEducation(request.getEducation());
        profile.setSkills(request.getSkills());
        profile.setExperience(request.getExperience());
        profile.setAbout(request.getAbout());
        profile.setLinkedin(request.getLinkedin());
        profile.setGithub(request.getGithub());

        JobSeekerProfile savedProfile = profileRepository.save(profile);
        return mapToResponse(savedProfile, user);
    }

    @Transactional
    public JobSeekerProfileResponse uploadCV(Long userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        JobSeekerProfile profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> new JobSeekerProfile(user));

        // If old resume exists, delete it
        if (profile.getResume() != null) {
            fileStorageService.deleteFile(profile.getResume(), "resumes");
        }

        String storedFilename = fileStorageService.storeResume(file);
        profile.setResume(storedFilename);
        profile.setResumeOriginalName(file.getOriginalFilename());
        profile.setResumeUploadedAt(LocalDateTime.now());

        JobSeekerProfile savedProfile = profileRepository.save(profile);
        return mapToResponse(savedProfile, user);
    }

    @Transactional
    public JobSeekerProfileResponse removeCV(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        JobSeekerProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        if (profile.getResume() != null) {
            fileStorageService.deleteFile(profile.getResume(), "resumes");
            profile.setResume(null);
            profile.setResumeOriginalName(null);
            profile.setResumeUploadedAt(null);
            profile = profileRepository.save(profile);
        }

        return mapToResponse(profile, user);
    }

    @Transactional
    public JobSeekerProfileResponse uploadProfileImage(Long userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        JobSeekerProfile profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> new JobSeekerProfile(user));

        if (profile.getProfileImage() != null) {
            fileStorageService.deleteFile(profile.getProfileImage(), "logos");
        }

        String storedFilename = fileStorageService.storeLogo(file);
        profile.setProfileImage(storedFilename);

        JobSeekerProfile savedProfile = profileRepository.save(profile);
        return mapToResponse(savedProfile, user);
    }

    @Transactional
    public void deleteAccount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        JobSeekerProfile profile = profileRepository.findByUserId(userId).orElse(null);
        if (profile != null) {
            if (profile.getResume() != null) {
                fileStorageService.deleteFile(profile.getResume(), "resumes");
            }
            if (profile.getProfileImage() != null) {
                fileStorageService.deleteFile(profile.getProfileImage(), "logos");
            }
            profileRepository.delete(profile);
        }

        // Clean up applications and saved jobs
        savedJobRepository.deleteAll(savedJobRepository.findByJobSeekerIdOrderBySavedAtDesc(userId));
        applicationRepository.deleteAll(applicationRepository.findByJobSeekerIdOrderByAppliedAtDesc(userId));

        userRepository.delete(user);
    }

    private JobSeekerProfileResponse mapToResponse(JobSeekerProfile profile, User user) {
        JobSeekerProfileResponse res = new JobSeekerProfileResponse();
        res.setId(profile.getId());
        res.setUserId(user.getId());
        res.setName(user.getName());
        res.setEmail(user.getEmail());
        res.setPhone(profile.getPhone() != null ? profile.getPhone() : user.getPhone());
        res.setProfileImage(profile.getProfileImage());
        res.setAddress(profile.getAddress());
        res.setDateOfBirth(profile.getDateOfBirth());
        res.setEducation(profile.getEducation());
        res.setSkills(profile.getSkills());
        res.setExperience(profile.getExperience());
        res.setAbout(profile.getAbout());
        res.setLinkedin(profile.getLinkedin());
        res.setGithub(profile.getGithub());
        res.setResume(profile.getResume());
        res.setResumeOriginalName(profile.getResumeOriginalName());
        res.setResumeUploadedAt(profile.getResumeUploadedAt());
        res.setCreatedAt(profile.getCreatedAt());
        res.setUpdatedAt(profile.getUpdatedAt());

        res.setCompletionPercentage(calculateCompletionPercentage(profile, user));
        return res;
    }

    public int calculateCompletionPercentage(JobSeekerProfile profile, User user) {
        if (profile == null) return 20;
        int points = 0;
        int total = 10;

        if (user.getName() != null && !user.getName().isBlank()) points++;
        if (user.getEmail() != null && !user.getEmail().isBlank()) points++;
        if (profile.getPhone() != null && !profile.getPhone().isBlank()) points++;
        if (profile.getAddress() != null && !profile.getAddress().isBlank()) points++;
        if (profile.getDateOfBirth() != null && !profile.getDateOfBirth().isBlank()) points++;
        if (profile.getEducation() != null && !profile.getEducation().isBlank()) points++;
        if (profile.getSkills() != null && !profile.getSkills().isBlank()) points++;
        if (profile.getExperience() != null && !profile.getExperience().isBlank()) points++;
        if (profile.getAbout() != null && !profile.getAbout().isBlank()) points++;
        if (profile.getResume() != null && !profile.getResume().isBlank()) points++;

        return (points * 100) / total;
    }
}
