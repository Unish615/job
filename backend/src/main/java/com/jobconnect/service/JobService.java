package com.jobconnect.service;

import com.jobconnect.dto.JobRequest;
import com.jobconnect.dto.JobResponse;
import com.jobconnect.entity.EmployerProfile;
import com.jobconnect.entity.Job;
import com.jobconnect.entity.Role;
import com.jobconnect.entity.User;
import com.jobconnect.exception.BadRequestException;
import com.jobconnect.exception.ResourceNotFoundException;
import com.jobconnect.exception.UnauthorizedException;
import com.jobconnect.repository.ApplicationRepository;
import com.jobconnect.repository.EmployerProfileRepository;
import com.jobconnect.repository.JobRepository;
import com.jobconnect.repository.SavedJobRepository;
import com.jobconnect.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final EmployerProfileRepository employerProfileRepository;
    private final ApplicationRepository applicationRepository;
    private final SavedJobRepository savedJobRepository;

    public JobService(JobRepository jobRepository,
                      UserRepository userRepository,
                      EmployerProfileRepository employerProfileRepository,
                      ApplicationRepository applicationRepository,
                      SavedJobRepository savedJobRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.employerProfileRepository = employerProfileRepository;
        this.applicationRepository = applicationRepository;
        this.savedJobRepository = savedJobRepository;
    }

    @Transactional
    public JobResponse createJob(Long employerId, JobRequest request) {
        User employer = userRepository.findById(employerId)
                .orElseThrow(() -> new ResourceNotFoundException("Employer not found with id: " + employerId));

        if (employer.getRole() != Role.EMPLOYER) {
            throw new UnauthorizedException("Only employers can create job listings");
        }

        EmployerProfile profile = employerProfileRepository.findByUserId(employerId)
                .orElse(null);

        Job job = new Job();
        job.setEmployer(employer);
        job.setCompanyName(profile != null && profile.getCompanyName() != null ? profile.getCompanyName() : employer.getName());
        job.setCompanyLogo(profile != null ? profile.getLogo() : null);
        job.setTitle(request.getTitle().trim());
        job.setDescription(request.getDescription());
        job.setResponsibilities(request.getResponsibilities());
        job.setRequirements(request.getRequirements());
        job.setBenefits(request.getBenefits());
        job.setCategory(request.getCategory());
        job.setJobType(request.getJobType());
        job.setLocation(request.getLocation());
        job.setSalary(request.getSalary());
        job.setExperience(request.getExperience());
        job.setEducation(request.getEducation());
        job.setSkills(request.getSkills());
        job.setVacancies(request.getVacancies() != null ? request.getVacancies() : 1);
        job.setDeadline(request.getDeadline());
        job.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");

        Job saved = jobRepository.save(job);
        return mapToResponse(saved, null);
    }

    @Transactional
    public JobResponse updateJob(Long jobId, Long employerId, JobRequest request) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        User currentUser = userRepository.findById(employerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!job.getEmployer().getId().equals(employerId) && currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("You do not have permission to update this job");
        }

        job.setTitle(request.getTitle().trim());
        job.setDescription(request.getDescription());
        job.setResponsibilities(request.getResponsibilities());
        job.setRequirements(request.getRequirements());
        job.setBenefits(request.getBenefits());
        job.setCategory(request.getCategory());
        job.setJobType(request.getJobType());
        job.setLocation(request.getLocation());
        job.setSalary(request.getSalary());
        job.setExperience(request.getExperience());
        job.setEducation(request.getEducation());
        job.setSkills(request.getSkills());
        if (request.getVacancies() != null) job.setVacancies(request.getVacancies());
        job.setDeadline(request.getDeadline());
        if (request.getStatus() != null) job.setStatus(request.getStatus());

        Job updated = jobRepository.save(job);
        return mapToResponse(updated, null);
    }

    @Transactional
    public void deleteJob(Long jobId, Long userId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!job.getEmployer().getId().equals(userId) && currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("You do not have permission to delete this job");
        }

        // Clean up applications and saved records for this job
        applicationRepository.deleteAll(applicationRepository.findByJobIdOrderByAppliedAtDesc(jobId));
        jobRepository.delete(job);
    }

    public JobResponse getJobById(Long jobId, Long currentUserId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));
        return mapToResponse(job, currentUserId);
    }

    public List<JobResponse> getEmployerJobs(Long employerId) {
        return jobRepository.findByEmployerIdOrderByCreatedAtDesc(employerId)
                .stream()
                .map(j -> mapToResponse(j, employerId))
                .collect(Collectors.toList());
    }

    public List<JobResponse> getLatestFeaturedJobs(Long currentUserId) {
        return jobRepository.findTop6ByStatusOrderByCreatedAtDesc("ACTIVE")
                .stream()
                .map(j -> mapToResponse(j, currentUserId))
                .collect(Collectors.toList());
    }

    public Page<JobResponse> searchJobs(String keyword,
                                        String category,
                                        String jobType,
                                        String location,
                                        String experience,
                                        String sortBy,
                                        int page,
                                        int size,
                                        Long currentUserId) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        if ("oldest".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "createdAt");
        } else if ("salary".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "salary");
        }

        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Job> spec = (root, query, cb) -> {
            var predicates = cb.conjunction();
            predicates = cb.and(predicates, cb.equal(root.get("status"), "ACTIVE"));

            if (keyword != null && !keyword.isBlank()) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                var titlePredicate = cb.like(cb.lower(root.get("title")), pattern);
                var descPredicate = cb.like(cb.lower(root.get("description")), pattern);
                var skillsPredicate = cb.like(cb.lower(root.get("skills")), pattern);
                var companyPredicate = cb.like(cb.lower(root.get("companyName")), pattern);
                predicates = cb.and(predicates, cb.or(titlePredicate, descPredicate, skillsPredicate, companyPredicate));
            }

            if (category != null && !category.isBlank() && !"All".equalsIgnoreCase(category)) {
                predicates = cb.and(predicates, cb.equal(root.get("category"), category.trim()));
            }

            if (jobType != null && !jobType.isBlank() && !"All".equalsIgnoreCase(jobType)) {
                predicates = cb.and(predicates, cb.equal(root.get("jobType"), jobType.trim()));
            }

            if (location != null && !location.isBlank()) {
                predicates = cb.and(predicates, cb.like(cb.lower(root.get("location")), "%" + location.trim().toLowerCase() + "%"));
            }

            if (experience != null && !experience.isBlank() && !"All".equalsIgnoreCase(experience)) {
                predicates = cb.and(predicates, cb.like(cb.lower(root.get("experience")), "%" + experience.trim().toLowerCase() + "%"));
            }

            return predicates;
        };

        Page<Job> jobPage = jobRepository.findAll(spec, pageable);
        return jobPage.map(job -> mapToResponse(job, currentUserId));
    }

    public Map<String, Long> getCategoryCounts() {
        List<Object[]> results = jobRepository.countJobsByCategory();
        Map<String, Long> counts = new HashMap<>();
        for (Object[] row : results) {
            String cat = (String) row[0];
            Long count = (Long) row[1];
            if (cat != null) {
                counts.put(cat, count);
            }
        }
        return counts;
    }

    private JobResponse mapToResponse(Job job, Long currentUserId) {
        JobResponse res = new JobResponse();
        res.setId(job.getId());
        res.setEmployerId(job.getEmployer().getId());
        res.setEmployerName(job.getEmployer().getName());
        res.setCompanyName(job.getCompanyName());
        res.setCompanyLogo(job.getCompanyLogo());
        res.setTitle(job.getTitle());
        res.setDescription(job.getDescription());
        res.setResponsibilities(job.getResponsibilities());
        res.setRequirements(job.getRequirements());
        res.setBenefits(job.getBenefits());
        res.setCategory(job.getCategory());
        res.setJobType(job.getJobType());
        res.setLocation(job.getLocation());
        res.setSalary(job.getSalary());
        res.setExperience(job.getExperience());
        res.setEducation(job.getEducation());
        res.setSkills(job.getSkills());
        res.setVacancies(job.getVacancies());
        res.setDeadline(job.getDeadline());
        res.setStatus(job.getStatus());
        res.setCreatedAt(job.getCreatedAt());
        res.setUpdatedAt(job.getUpdatedAt());

        res.setApplicantCount(applicationRepository.findByJobIdOrderByAppliedAtDesc(job.getId()).size());

        if (currentUserId != null) {
            res.setAlreadyApplied(applicationRepository.existsByJobIdAndJobSeekerId(job.getId(), currentUserId));
            res.setSaved(savedJobRepository.existsByJobIdAndJobSeekerId(job.getId(), currentUserId));
        }

        return res;
    }
}
