package com.jobconnect.service;

import com.jobconnect.exception.BadRequestException;
import com.jobconnect.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path uploadDir;
    private final Path resumeDir;
    private final Path logoDir;

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    private static final List<String> ALLOWED_LOGO_EXTENSIONS = Arrays.asList(".jpg", ".jpeg", ".png", ".webp");
    private static final String ALLOWED_RESUME_EXTENSION = ".pdf";

    public FileStorageService(@Value("${app.upload.dir:./uploads}") String uploadPath) {
        this.uploadDir = Paths.get(uploadPath).toAbsolutePath().normalize();
        this.resumeDir = this.uploadDir.resolve("resumes");
        this.logoDir = this.uploadDir.resolve("logos");

        try {
            Files.createDirectories(this.resumeDir);
            Files.createDirectories(this.logoDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not create the directories for file uploads", e);
        }
    }

    public String storeResume(MultipartFile file) {
        validateFile(file, MAX_FILE_SIZE);

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume.pdf");
        String extension = getFileExtension(originalFilename).toLowerCase();

        if (!ALLOWED_RESUME_EXTENSION.equals(extension)) {
            throw new BadRequestException("Invalid file type. Only PDF files are allowed for CV/Resume.");
        }

        String storedFilename = "resume_" + UUID.randomUUID().toString() + extension;
        Path targetLocation = this.resumeDir.resolve(storedFilename);

        try {
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return storedFilename;
        } catch (IOException ex) {
            throw new BadRequestException("Could not store file " + originalFilename + ". Please try again!");
        }
    }

    public String storeLogo(MultipartFile file) {
        validateFile(file, MAX_FILE_SIZE);

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "logo.png");
        String extension = getFileExtension(originalFilename).toLowerCase();

        if (!ALLOWED_LOGO_EXTENSIONS.contains(extension)) {
            throw new BadRequestException("Invalid image format. Allowed formats: JPG, JPEG, PNG, WEBP.");
        }

        String storedFilename = "logo_" + UUID.randomUUID().toString() + extension;
        Path targetLocation = this.logoDir.resolve(storedFilename);

        try {
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return storedFilename;
        } catch (IOException ex) {
            throw new BadRequestException("Could not store file " + originalFilename + ". Please try again!");
        }
    }

    public Resource loadFileAsResource(String filename, String folder) {
        try {
            Path filePath = "resumes".equalsIgnoreCase(folder) ?
                    this.resumeDir.resolve(filename).normalize() :
                    this.logoDir.resolve(filename).normalize();

            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File not found: " + filename);
            }
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("File not found: " + filename);
        }
    }

    public void deleteFile(String filename, String folder) {
        if (filename == null || filename.isBlank()) return;
        try {
            Path filePath = "resumes".equalsIgnoreCase(folder) ?
                    this.resumeDir.resolve(filename).normalize() :
                    this.logoDir.resolve(filename).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ignored) {
        }
    }

    private void validateFile(MultipartFile file, long maxSize) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File cannot be empty");
        }
        if (file.getSize() > maxSize) {
            throw new BadRequestException("File size must be less than 5 MB");
        }
    }

    private String getFileExtension(String filename) {
        int lastIndex = filename.lastIndexOf('.');
        if (lastIndex >= 0) {
            return filename.substring(lastIndex);
        }
        return "";
    }
}
