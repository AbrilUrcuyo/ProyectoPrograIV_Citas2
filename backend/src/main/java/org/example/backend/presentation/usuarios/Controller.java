package org.example.backend.presentation.usuarios;

import org.example.backend.logic.Service;
import org.example.backend.logic.Usuario;
import org.example.backend.data.UsuarioRepository;
import org.example.backend.presentation.security.TokenService;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.context.annotation.Bean;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.File;
import java.util.*;



import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "http://localhost:3000")
@RestController("usuariosController")
@RequestMapping("/usuarios")
@AllArgsConstructor
public class Controller {
    private final PasswordEncoder passwordEncoder;
    private final UsuarioRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    @Autowired
    private Service service;

//    @Value("${picturesPath}")
//    private String picturesPath;

    @PostMapping(value = "/Register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> register(
            @RequestParam("user") String id,
            @RequestParam("password") String password,
            @RequestParam("confirm") String confirm,
            @RequestParam("name") String nombre,
            @RequestParam("userType") String tipo,
            @RequestParam("photo") MultipartFile photo) {

        if (!password.equals(confirm)) {
            return ResponseEntity.badRequest().body("Las contraseñas no coinciden");
        }

        if (service.existeUsuario(id)) {
            return ResponseEntity.badRequest().body("El ID ya está en uso");
        }

        try {
            Usuario usuario = new Usuario();
            usuario.setId(id);
            usuario.setClave(passwordEncoder.encode(password));
            usuario.setTipo(tipo);

            String path = "C:/AAA/images/" + usuario.getId();
            photo.transferTo(new File(path));

            service.registrarUsuarioConTipo(usuario, nombre, id, tipo);
            System.out.println(tipo);
            return ResponseEntity.ok(Collections.singletonMap("message", "Usuario registrado con éxito"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al registrar usuario");
        }
    }



    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario user) {
        try {
            var authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getId(), user.getClave()));
            String token = tokenService.generateToken(authentication);
            // Devuelve el token en un JSON
            return ResponseEntity.ok(Collections.singletonMap("token", token));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Collections.singletonMap("error", "Usuario o contraseña incorrectos"));
        }
    }

}

