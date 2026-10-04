package com.jobconnect.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomAuthenticationEntryPoint authenticationEntryPoint;
    private final CustomAccessDeniedHandler accessDeniedHandler;

    public SecurityConfig(UserDetailsServiceImpl userDetailsService,
                          JwtAuthenticationFilter jwtAuthenticationFilter,
                          CustomAuthenticationEntryPoint authenticationEntryPoint,
                          CustomAccessDeniedHandler accessDeniedHandler) {
        this.userDetailsService = userDetailsService;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.authenticationEntryPoint = authenticationEntryPoint;
        this.accessDeniedHandler = accessDeniedHandler;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Link", "X-Total-Count"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint(authenticationEntryPoint)
                .accessDeniedHandler(accessDeniedHandler)
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public Endpoints
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/jobs").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/jobs/search").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/jobs/categories").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/jobs/featured").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/jobs/{id:[0-9]+}").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/employer/companies/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/files/**").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers("/error").permitAll()

                // Job Seeker Endpoints
                .requestMatchers("/api/job-seekers/**").hasRole("JOB_SEEKER")
                .requestMatchers("/api/saved-jobs/**").hasRole("JOB_SEEKER")
                .requestMatchers(HttpMethod.POST, "/api/applications").hasRole("JOB_SEEKER")
                .requestMatchers(HttpMethod.GET, "/api/applications/my").hasRole("JOB_SEEKER")
                .requestMatchers(HttpMethod.DELETE, "/api/applications/{id:[0-9]+}").hasRole("JOB_SEEKER")

                // Employer Endpoints
                .requestMatchers("/api/employer/**").hasRole("EMPLOYER")
                .requestMatchers(HttpMethod.POST, "/api/jobs").hasRole("EMPLOYER")
                .requestMatchers(HttpMethod.PUT, "/api/jobs/{id:[0-9]+}").hasRole("EMPLOYER")
                .requestMatchers(HttpMethod.GET, "/api/jobs/employer/my").hasRole("EMPLOYER")
                .requestMatchers(HttpMethod.GET, "/api/applications/employer/**").hasRole("EMPLOYER")
                .requestMatchers(HttpMethod.PUT, "/api/applications/{id:[0-9]+}/status").hasRole("EMPLOYER")

                // Job Delete: Employer (own job) or Admin
                .requestMatchers(HttpMethod.DELETE, "/api/jobs/{id:[0-9]+}").hasAnyRole("EMPLOYER", "ADMIN")

                // Admin Endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // Authenticated Endpoints
                .requestMatchers("/api/files/upload/**").authenticated()

                // Any other request must be authenticated
                .anyRequest().authenticated()
            );

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
