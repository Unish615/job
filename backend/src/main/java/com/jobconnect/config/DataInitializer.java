package com.jobconnect.config;

import com.jobconnect.entity.*;
import com.jobconnect.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final JobSeekerProfileRepository jobSeekerProfileRepository;
    private final EmployerProfileRepository employerProfileRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final SavedJobRepository savedJobRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           JobSeekerProfileRepository jobSeekerProfileRepository,
                           EmployerProfileRepository employerProfileRepository,
                           JobRepository jobRepository,
                           ApplicationRepository applicationRepository,
                           SavedJobRepository savedJobRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jobSeekerProfileRepository = jobSeekerProfileRepository;
        this.employerProfileRepository = employerProfileRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.savedJobRepository = savedJobRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Already initialized
        }

        // 1. Create Default Admin
        User admin = new User("System Administrator", "admin@jobconnect.com",
                passwordEncoder.encode("admin123"), Role.ADMIN, "+1 (555) 019-2831");
        userRepository.save(admin);

        // 2. Create Employers
        User emp1 = new User("Sarah Jenkins", "techcorp@jobconnect.com",
                passwordEncoder.encode("employer123"), Role.EMPLOYER, "+1 (555) 123-4567");
        userRepository.save(emp1);

        EmployerProfile prof1 = new EmployerProfile(emp1, "CloudScale Technologies");
        prof1.setIndustry("Software Development");
        prof1.setLocation("San Francisco, CA");
        prof1.setWebsite("https://cloudscale.example.com");
        prof1.setCompanySize("51-200");
        prof1.setFoundedYear(2018);
        prof1.setDescription("CloudScale Technologies builds resilient distributed microservices and enterprise SaaS architectures for global clients.");
        prof1.setPhone("+1 (555) 123-4567");
        employerProfileRepository.save(prof1);

        User emp2 = new User("David Miller", "innovate@jobconnect.com",
                passwordEncoder.encode("employer123"), Role.EMPLOYER, "+1 (555) 987-6543");
        userRepository.save(emp2);

        EmployerProfile prof2 = new EmployerProfile(emp2, "Apex Digital Labs");
        prof2.setIndustry("UI/UX Design");
        prof2.setLocation("New York, NY");
        prof2.setWebsite("https://apexdigital.example.com");
        prof2.setCompanySize("11-50");
        prof2.setFoundedYear(2020);
        prof2.setDescription("Apex Digital Labs is an award-winning digital experience studio focusing on cutting-edge web apps and intuitive UX.");
        prof2.setPhone("+1 (555) 987-6543");
        employerProfileRepository.save(prof2);

        // 3. Create Job Seekers
        User seeker1 = new User("Alex Morgan", "seeker@jobconnect.com",
                passwordEncoder.encode("seeker123"), Role.JOB_SEEKER, "+1 (555) 456-7890");
        userRepository.save(seeker1);

        JobSeekerProfile seekerProf1 = new JobSeekerProfile(seeker1);
        seekerProf1.setPhone("+1 (555) 456-7890");
        seekerProf1.setAddress("Seattle, WA");
        seekerProf1.setDateOfBirth("1996-05-14");
        seekerProf1.setEducation("B.S. in Computer Science - University of Washington (2018)");
        seekerProf1.setSkills("Java, Spring Boot, React, Vite, MySQL, Docker, REST APIs, Tailwind CSS, TypeScript");
        seekerProf1.setExperience("4+ years as Full Stack Software Engineer at TechCorp. Built resilient payment APIs and real-time dashboard analytics.");
        seekerProf1.setAbout("Passionate full-stack developer committed to building scalable web applications with clean architecture and modern UX.");
        seekerProf1.setLinkedin("https://linkedin.com/in/alexmorgan");
        seekerProf1.setGithub("https://github.com/alexmorgan");
        seekerProf1.setResume("sample_resume.pdf");
        seekerProf1.setResumeOriginalName("Alex_Morgan_Resume.pdf");
        seekerProf1.setResumeUploadedAt(LocalDateTime.now().minusDays(10));
        jobSeekerProfileRepository.save(seekerProf1);

        User seeker2 = new User("Elena Rostova", "elena@jobconnect.com",
                passwordEncoder.encode("seeker123"), Role.JOB_SEEKER, "+1 (555) 234-5678");
        userRepository.save(seeker2);

        JobSeekerProfile seekerProf2 = new JobSeekerProfile(seeker2);
        seekerProf2.setPhone("+1 (555) 234-5678");
        seekerProf2.setAddress("Austin, TX");
        seekerProf2.setDateOfBirth("1998-11-20");
        seekerProf2.setEducation("B.A. in Digital Arts & Design - UT Austin (2020)");
        seekerProf2.setSkills("Figma, UI/UX Design, Wireframing, Prototyping, HTML/CSS, User Research, Design Systems");
        seekerProf2.setExperience("3 years UI/UX Designer at Creative Studio. Designed mobile apps with over 500k monthly active users.");
        seekerProf2.setAbout("Product designer passionate about human-centered design, modern aesthetics, and seamless interactions.");
        seekerProf2.setLinkedin("https://linkedin.com/in/elenarostova");
        seekerProf2.setResume("sample_resume.pdf");
        seekerProf2.setResumeOriginalName("Elena_Rostova_Portfolio_CV.pdf");
        seekerProf2.setResumeUploadedAt(LocalDateTime.now().minusDays(5));
        jobSeekerProfileRepository.save(seekerProf2);

        // 4. Create Realistic Jobs
        Job job1 = new Job();
        job1.setEmployer(emp1);
        job1.setCompanyName("CloudScale Technologies");
        job1.setTitle("Senior Full Stack Java & React Engineer");
        job1.setCategory("Software Development");
        job1.setJobType("Full Time");
        job1.setLocation("Remote");
        job1.setSalary("$120,000 - $145,000 / year");
        job1.setExperience("4+ Years");
        job1.setEducation("Bachelor's degree in Computer Science or related field");
        job1.setSkills("Java 21, Spring Boot, React, MySQL, Docker, Kubernetes, REST APIs, Git");
        job1.setDescription("Join our high-performing backend & frontend core engineering group to architect scalable cloud microservices and intuitive reactive web dashboards.");
        job1.setResponsibilities("• Design and implement enterprise REST APIs with Spring Boot\n• Architect responsive, modular web components using React and Vite\n• Optimize SQL queries and database schemas for high throughput\n• Collaborate across cross-functional teams in agile sprints");
        job1.setRequirements("• 4+ years of professional full-stack development experience\n• Strong command of Java, Spring Boot, Spring Security, and JPA\n• Proficiency with React, Vite, State Management, and Tailwind CSS\n• Experience with relational databases (MySQL/PostgreSQL)");
        job1.setBenefits("• Comprehensive health, dental, and vision insurance\n• 401(k) matching up to 5%\n• Unlimited PTO and flexible work hours\n• $2,500 annual learning and conference stipend");
        job1.setVacancies(3);
        job1.setDeadline(LocalDate.now().plusDays(45));
        job1.setStatus("ACTIVE");
        jobRepository.save(job1);

        Job job2 = new Job();
        job2.setEmployer(emp2);
        job2.setCompanyName("Apex Digital Labs");
        job2.setTitle("Senior UI/UX Product Designer");
        job2.setCategory("UI/UX Design");
        job2.setJobType("Full Time");
        job2.setLocation("New York, NY");
        job2.setSalary("$105,000 - $130,000 / year");
        job2.setExperience("3+ Years");
        job2.setEducation("Degree in Design, HCI, or equivalent portfolio");
        job2.setSkills("Figma, Design Systems, User Research, Wireframing, Rapid Prototyping, CSS");
        job2.setDescription("Apex Digital Labs is looking for a creative UI/UX Product Designer to craft world-class web and mobile interfaces that captivate users.");
        job2.setResponsibilities("• Lead end-to-end design sprints from wireframes to high-fidelity mocks\n• Maintain and scale comprehensive multi-brand design systems\n• Conduct usability testing sessions and analyze user behavioral feedback\n• Partner closely with frontend developers for pixel-perfect execution");
        job2.setRequirements("• Impressive portfolio demonstrating UI/UX and product design craft\n• 3+ years designing web apps and mobile interfaces\n• Mastery of modern Figma workflows, auto-layout, and components\n• Excellent communication and presentation skills");
        job2.setBenefits("• Health and wellness coverage\n• Hybrid flexibility (2 days in office / 3 remote)\n• Annual company retreat and equipment budget\n• Generous parental leave");
        job2.setVacancies(2);
        job2.setDeadline(LocalDate.now().plusDays(30));
        job2.setStatus("ACTIVE");
        jobRepository.save(job2);

        Job job3 = new Job();
        job3.setEmployer(emp1);
        job3.setCompanyName("CloudScale Technologies");
        job3.setTitle("Cloud DevOps & Infrastructure Engineer");
        job3.setCategory("Cyber Security");
        job3.setJobType("Contract");
        job3.setLocation("San Francisco, CA");
        job3.setSalary("$90 - $110 / hour");
        job3.setExperience("3+ Years");
        job3.setEducation("B.S. in IT, Cybersecurity or relevant field");
        job3.setSkills("AWS, Terraform, CI/CD, Docker, Kubernetes, Linux, Prometheus");
        job3.setDescription("Build and secure our continuous deployment pipelines and cloud infrastructure across multi-region AWS environments.");
        job3.setResponsibilities("• Automate cloud provisioning via Terraform and Ansible\n• Maintain CI/CD pipelines in GitHub Actions\n• Implement observability, logging, and security alerting\n• Conduct vulnerability assessments and disaster recovery drills");
        job3.setRequirements("• Deep experience with AWS cloud services (EKS, RDS, S3, IAM)\n• Strong scripting skills in Bash or Python\n• Familiarity with zero-trust network principles");
        job3.setBenefits("• Competitive hourly rate\n• Flexible contract terms\n• Full remote option");
        job3.setVacancies(1);
        job3.setDeadline(LocalDate.now().plusDays(25));
        job3.setStatus("ACTIVE");
        jobRepository.save(job3);

        Job job4 = new Job();
        job4.setEmployer(emp2);
        job4.setCompanyName("Apex Digital Labs");
        job4.setTitle("Frontend React Developer (Vite / Tailwind)");
        job4.setCategory("Web Development");
        job4.setJobType("Part Time");
        job4.setLocation("Remote");
        job4.setSalary("$55 - $75 / hour");
        job4.setExperience("2+ Years");
        job4.setEducation("Diploma or Bachelor's in CS or Web Development");
        job4.setSkills("React, Vite, JavaScript, Tailwind CSS, Responsive Design, Axios");
        job4.setDescription("Develop clean, accessible, and ultra-fast responsive web client interfaces for high-profile client applications.");
        job4.setResponsibilities("• Implement pixel-perfect React components from Figma designs\n• Integrate backend REST APIs smoothly with Axios\n• Ensure cross-browser and mobile responsive compatibility");
        job4.setRequirements("• 2+ years experience building modern React web apps\n• Expertise in Tailwind CSS and modern CSS layouts (Flexbox, Grid)\n• Strong eye for typography, whitespace, and micro-interactions");
        job4.setBenefits("• 20 hours / week flexible schedule\n• Great portfolio-building projects\n• Potential conversion to full-time");
        job4.setVacancies(2);
        job4.setDeadline(LocalDate.now().plusDays(60));
        job4.setStatus("ACTIVE");
        jobRepository.save(job4);

        Job job5 = new Job();
        job5.setEmployer(emp1);
        job5.setCompanyName("CloudScale Technologies");
        job5.setTitle("AI & Machine Learning Software Intern");
        job5.setCategory("Data Science");
        job5.setJobType("Internship");
        job5.setLocation("San Francisco, CA");
        job5.setSalary("$40 / hour");
        job5.setExperience("0-1 Years");
        job5.setEducation("Currently enrolled in CS, Data Science, or Math degree");
        job5.setSkills("Python, PyTorch, Pandas, Scikit-Learn, SQL, FastApi");
        job5.setDescription("Exciting 3-month summer internship working with our Core AI team on predictive models and automated data ingestion pipelines.");
        job5.setResponsibilities("• Clean and preprocess large-scale operational data sets\n• Assist in benchmarking model performance\n• Document experiments and build demonstration dashboards");
        job5.setRequirements("• Solid foundation in linear algebra, statistics, and machine learning\n• Strong Python programming skills\n• Passion for learning and team collaboration");
        job5.setBenefits("• Mentorship from Senior AI Scientists\n• Housing stipend or relocation support\n• Company events and networking");
        job5.setVacancies(4);
        job5.setDeadline(LocalDate.now().plusDays(90));
        job5.setStatus("ACTIVE");
        jobRepository.save(job5);

        // 5. Create Initial Applications
        Application app1 = new Application(job1, seeker1, emp1, "sample_resume.pdf",
                "I am very excited to apply for this Senior Full Stack role. With my background in Spring Boot and React, I am confident I will make an immediate impact on your team.");
        app1.setStatus("Pending");
        applicationRepository.save(app1);

        Application app2 = new Application(job2, seeker2, emp2, "sample_resume.pdf",
                "As an experienced UI/UX designer with deep Figma expertise, I admire Apex Digital Labs' work and would love to contribute to your studio.");
        app2.setStatus("Reviewed");
        applicationRepository.save(app2);

        // 6. Create Saved Job
        SavedJob savedJob = new SavedJob(job2, seeker1);
        savedJobRepository.save(savedJob);
    }
}
