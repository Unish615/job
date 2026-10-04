package com.jobconnect.service;

import com.jobconnect.dto.JobResponse;
import com.jobconnect.entity.Job;
import com.jobconnect.entity.Role;
import com.jobconnect.entity.SavedJob;
import com.jobconnect.entity.User;
import com.jobconnect.exception.BadRequestException;
import com.jobconnect.exception.ResourceNotFoundException;
import com.jobconnect.exception.UnauthorizedException;
import com.jobconnect.repository.ApplicationRepository;
import com.jobconnect.repository.JobRepository;
import com.jobconnect.repository.SavedJobRepository;
import com.jobconnect.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SavedJobService {

    private final SavedJobRepository savedJobRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;

    public SavedJobService(SavedJobRepository savedJobRepository,
                           JobRepository jobRepository,
                           UserRepository userRepository,
                           ApplicationRepository applicationRepository) {
        this.savedJobRepository = savedJobRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
    }

    @Transactional
    public void saveJob(Long jobId, Long jobSeekerId) {
        User user = userRepository.findById(jobSeekerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() != Role.JOB_SEEKER) {
            throw new UnauthorizedException("Only job seekers can save jobs");
        }

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        if (savedJobRepository.existsByJobIdAndJobSeekerId(jobId, jobSeekerId)) {
            return; // Already saved, idempotent
        }

        SavedJob savedJob = new SavedJob(job, user);
        savedJobRepository.save(savedJob);
    }

    @Transactional
    public void removeSavedJob(Long jobId, Long jobSeekerId) {
        savedJobRepository.deleteByJobIdAndJobSeekerId(jobId, jobSeekerId);
    }

    public List<JobResponse> getSavedJobs(Long jobSeekerId) {
        return savedJobRepository.findByJobSeekerIdOrderBySavedAtDesc(jobSeekerId)
                .stream()
                .map(sj -> {
                    Job j = sj.getJob();
                    JobResponse res = new JobResponse();
                    res.setId(j.getId());
                    res.setEmployerId(j.getEmployer().getId());
                    res.setEmployerName(j.getEmployer().getName());
                    res.setCompanyName(j.getCompanyName());
                    res.setCompanyLogo(j.getCompanyLogo());
                    res.setTitle(j.getTitle());
                    res.setDescription(j.getDescription());
                    res.setCategory(j.getCategory());
                    res.setJobType(j.getJobType());
                    res.setLocation(j.getLocation());
                    res.setSalary(j.getSalary());
                    res.setExperience(j.getExperience());
                    res.setStatus(j.getStatus());
                    res.setDeadline(j.getDeadline());
                    res.setCreatedAt(j.getCreatedAt());
                    res.setSaved(true);
                    res.setAlreadyApplied(applicationRepository.existsByJobIdAndJobSeekerId(j.getId(), jobSeekerId));
                    return res;
                })
                .collect(Collectors.toList());
    }
}
