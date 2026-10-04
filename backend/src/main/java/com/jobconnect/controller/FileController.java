package com.jobconnect.controller;

import com.jobconnect.service.FileStorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileStorageService fileStorageService;

    public FileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/resume/{filename:.+}")
    public ResponseEntity<Resource> getResume(@PathVariable String filename,
                                              @RequestParam(defaultValue = "false") boolean download) {
        Resource file = fileStorageService.loadFileAsResource(filename, "resumes");
        String disposition = download ? "attachment; filename=\"" + filename + "\"" : "inline; filename=\"" + filename + "\"";

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition)
                .body(file);
    }

    @GetMapping("/logo/{filename:.+}")
    public ResponseEntity<Resource> getLogo(@PathVariable String filename) {
        Resource file = fileStorageService.loadFileAsResource(filename, "logos");
        MediaType mediaType = MediaType.IMAGE_PNG;
        String lower = filename.toLowerCase();
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
            mediaType = MediaType.IMAGE_JPEG;
        } else if (lower.endsWith(".webp")) {
            mediaType = MediaType.parseMediaType("image/webp");
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CACHE_CONTROL, "max-age=86400")
                .body(file);
    }
}
