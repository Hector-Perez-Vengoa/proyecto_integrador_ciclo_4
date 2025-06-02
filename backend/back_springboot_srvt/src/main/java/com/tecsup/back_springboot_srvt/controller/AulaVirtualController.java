package com.tecsup.back_springboot_srvt.controller;

import com.tecsup.back_springboot_srvt.model.AulaVirtual;
import com.tecsup.back_springboot_srvt.service.AulaVirtualService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/aula-virtual")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8000"})
public class AulaVirtualController {

    private final AulaVirtualService aulaVirtualService;

    @Autowired
    public AulaVirtualController(AulaVirtualService aulaVirtualService) {
        this.aulaVirtualService = aulaVirtualService;
    }

    // GET http://localhost:8080/aula-virtual
    @GetMapping
    public List<AulaVirtual> listar() {
        return aulaVirtualService.listar();
    }

    // GET http://localhost:8080/aula-virtual/{id}
    @GetMapping("/{id}")
    public AulaVirtual obtener(@PathVariable Long id) {
        return aulaVirtualService.obtener(id);
    }

    // POST http://localhost:8080/aula-virtual
    @PostMapping
    public void crear(@RequestBody AulaVirtual aulaVirtual) {
        aulaVirtualService.crear(aulaVirtual);
    }

    // PUT http://localhost:8080/aula-virtual/{codigo}
    @PutMapping("/{codigo}")
    public void actualizar(@PathVariable String codigo, @RequestBody AulaVirtual aulaVirtual) {
        aulaVirtual.setCodigo(codigo);
        aulaVirtualService.actualizar(aulaVirtual);
    }

    // DELETE http://localhost:8080/aula-virtual/{codigo}
    @DeleteMapping("/{codigo}")
    public void eliminar(@PathVariable String codigo) {
        aulaVirtualService.eliminar(codigo);
    }
}
