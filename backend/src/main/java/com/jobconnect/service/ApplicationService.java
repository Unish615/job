package com.jobconnect.service;

import com.jobconnect.dto.ApplicationRequest;
import com.jobconnect.dto.ApplicationResponse;
import com.jobconnect.dto.StatusUpdateRequest;
import com.jobconnect.entity.*;
import com.jobconnect.exception.BadRequestException;
import com.jobconnect.exception.ResourceNotFoundException;
import com.jobconnect.exception.UnauthorizedException;
import com.jobconnect.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final JobSeekerProfileRepository profileRepository;

    public ApplicationService(ApplicationRepository applicationRepository,
                              JobRepository jobRepository,
                              UserRepository userRepository,
                              JobSeekerProfileRepository profileRepository) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    @Transactional
    public ApplicationResponse applyForJob(Long jobSeekerId, ApplicationRequest request) {
        User jobSeeker = userRepository.findById(jobSeekerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (jobSeeker.getRole() != Role.JOB_SEEKER) {
            throw new UnauthorizedException("Only job seekers can apply for jobs");
        }

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + request.getJobId()));

        if (!"ACTIVE".equalsIgnoreCase(job.getStatus())) {
            throw new BadRequestException("This job listing is no longer accepting applications");
        }

        // 1. Check profile exists
        JobSeekerProfile profile = profileRepository.findByUserId(jobSeekerId)
                .orElseThrow(() -> new BadRequestException("Please create and complete your profile before applying"));

        // 2. Check CV is uploaded
        if (profile.getResume() == null || profile.getResume().isBlank()) {
            throw new BadRequestException("Please upload your CV/Resume in your profile before applying for jobs");
        }

        // 3. Check already applied
        if (applicationRepository.existsByJobIdAndJobSeekerId(job.getId(), jobSeekerId)) {
            throw new BadRequestException("You have already applied for this job");
        }

        Application application = new Application();
        application.setJob(job);
        application.setJobSeeker(jobSeeker);
        application.setEmployer(job.getEmployer());
        application.setResume(profile.getResume());
        application.setCoverLetter(request.getCoverLetter());
        application.setStatus("Pending");

        Application saved = applicationRepository.save(application);
        return mapToResponse(saved, profile);
    }

    public List<ApplicationResponse> getMyApplications(Long jobSeekerId) {
        return applicationRepository.findByJobSeekerIdOrderByAppliedAtDesc(jobSeekerId)
                .stream()
                .map(app -> {
                    JobSeekerProfile p = profileRepository.findByUserId(jobSeekerId).orElse(null);
                    return mapToResponse(app, p);
                })
                .collect(Collectors.toList());
    }

    public List<ApplicationResponse> getEmployerApplications(Long employerId, Long jobId) {
        List<Application> list;
        if (jobId != null) {
            Job job = jobRepository.findById(jobId)
                    .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
            if (!job.getEmployer().getId().equals(employerId)) {
                throw new UnauthorizedException("You are not authorized to view applicants for this job");
            }
            list = applicationRepository.findByJobIdOrderByAppliedAtDesc(jobId);
        } else {
            list = applicationRepository.findByEmployerIdOrderByAppliedAtDesc(employerId);
        }

        return list.stream()
                .map(app -> {
                    JobSeekerProfile p = profileRepository.findByUserId(app.getJobSeeker().getId()).orElse(null);
                    return mapToResponse(app, p);
                })
                .collect(Collectors.toList());
    }

    public List<ApplicationResponse> getAllApplications() {
        return applicationRepository.findAllByOrderByAppliedAtDesc().stream()
                .map(app -> {
                    JobSeekerProfile p = profileRepository.findByUserId(app.getJobSeeker().getId()).orElse(null);
                    return mapToResponse(app, p);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public ApplicationResponse updateApplicationStatus(Long applicationId, Long employerId, StatusUpdateRequest request) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        if (!application.getEmployer().getId().equals(employerId)) {
            throw new UnauthorizedException("You do not have permission to update this application");
        }

        application.setStatus(request.getStatus());
        Application saved = applicationRepository.save(application);

        JobSeekerProfile p = profileRepository.findByUserId(saved.getJobSeeker().getId()).orElse(null);
        return mapToResponse(saved, p);
    }

    @Transactional
    public void cancelApplication(Long applicationId, Long jobSeekerId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        if (!application.getJobSeeker().getId().equals(jobSeekerId)) {
            throw new UnauthorizedException("You can only cancel your own applications");
        }

        // Only allowed to cancel if status is still Pending or Reviewed
        if ("Accepted".equalsIgnoreCase(application.getStatus())) {
            throw new BadRequestException("You cannot cancel an accepted application. Please contact the employer.");
        }

        applicationRepository.delete(application);
    }

    private ApplicationResponse mapToResponse(Application app, JobSeekerProfile profile) {
        ApplicationResponse res = new ApplicationResponse();
        res.setId(app.getId());
        res.setJobId(app.getJob().getId());
        res.setJobTitle(app.getJob().getTitle());
        res.setCompanyName(app.getJob().getCompanyName());
        res.setCompanyLogo(app.getJob().getCompanyLogo());
        res.setJobType(app.getJob().getJobType());
        res.setLocation(app.getJob().getLocation());
        res.setSalary(app.getJob().getSalary());

        res.setJobSeekerId(app.getJobSeeker().getId());
        res.setApplicantName(app.getJobSeeker().getName());
        res.setApplicantEmail(app.getJobSeeker().getEmail());
        res.setApplicantPhone(profile != null && profile.getPhone() != null ? profile.getPhone() : app.getJobSeeker().getPhone());
        res.setResume(app.getResume());
        res.setCoverLetter(app.getCoverLetter());
        res.setStatus(app.getStatus());
        res.setAppliedAt(app.getAppliedAt());
        res.setUpdatedAt(app.getUpdatedAt());

        if (profile != null) {
            res.setApplicantEducation(profile.getEducation());
            res.setApplicantSkills(profile.getSkills());
            res.setApplicantExperience(profile.getExperience());
        }

        return res;
    }
}
