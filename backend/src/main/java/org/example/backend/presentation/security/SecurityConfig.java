package org.example.backend.presentation.security;


import org.example.backend.data.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

import java.util.Arrays;
import java.util.Collection;

@Configuration
@AllArgsConstructor
public class SecurityConfig {
    private final JwtConfig jwtConfig;
    private final UsuarioRepository userRepository;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration configuration = new CorsConfiguration();
                    configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
                    configuration.setAllowedMethods(Arrays.asList("GET","POST", "PUT", "DELETE", "OPTIONS"));
                    configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
                    return configuration;
                }))
                .sessionManagement(sessionManagement -> sessionManagement
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorizeRequests -> authorizeRequests
                        // Rutas públicas
                        .requestMatchers("/", "/horarios/show/**", "/usuarios/**", "/error").permitAll()
                        // Rutas para pacientes
                        .requestMatchers( "/pacientes/citas", "/pacientes/confirmarCita").hasAuthority("Paciente")
                        // Rutas para médicos
                        .requestMatchers("/medicos/**", "/horarios/showIngresoH", "/horarios/ingresarH", "/citas/**").hasAuthority("Medico")
                        // Rutas para administradores
                        .requestMatchers("/admin/**").hasAuthority("Administrador")
                        // Cualquier otra ruta requiere autenticación
                        .anyRequest().authenticated())
                .oauth2ResourceServer(configurer -> 
                    configurer.jwt(jwt -> {
                        jwt.jwtAuthenticationConverter(jwtAuthenticationConverter());
                    }))
                .build();
    }

    @Bean
    public Converter<Jwt, ? extends AbstractAuthenticationToken> jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            // Obtiene el claim "scope"
            Object scopes = jwt.getClaim("scope");
            if (scopes instanceof String) {
                return AuthorityUtils.commaSeparatedStringToAuthorityList((String) scopes);
            } else if (scopes instanceof Collection<?>) {
                Collection<?> scopeCollection = (Collection<?>) scopes;
                String scopesAsString = String.join(",", scopeCollection.stream()
                        .map(Object::toString)
                        .toList());
                return AuthorityUtils.commaSeparatedStringToAuthorityList(scopesAsString);
            }
            return AuthorityUtils.NO_AUTHORITIES;
        });
        return converter;
    }

    @Bean
    public JwtDecoder jwtDecoder() { return NimbusJwtDecoder.withSecretKey(jwtConfig.getSecretKey()).build(); }
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public AuthenticationManager authManager(AuthenticationProvider authenticationProvider) {
        return new ProviderManager(authenticationProvider);
    }
    @Bean
    AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
    @Bean
    UserDetailsService userDetailsService() {
        return username -> userRepository.findById(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }


}
