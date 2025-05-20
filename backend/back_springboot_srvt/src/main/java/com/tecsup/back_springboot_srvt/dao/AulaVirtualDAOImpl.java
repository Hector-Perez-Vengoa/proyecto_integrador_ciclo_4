package com.tecsup.back_springboot_srvt.dao;

import com.tecsup.back_springboot_srvt.model.AulaVirtual;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Repository
public class AulaVirtualDAOImpl implements AulaVirtualDAO {

    private final String BASE_URL = "http://127.0.0.1:8000/api/aula-virtual/";

    @Autowired
    private RestTemplate restTemplate;

    @Override
    public List<AulaVirtual> Listar() {
        AulaVirtual[] aulas = restTemplate.getForObject(BASE_URL, AulaVirtual[].class);
        return Arrays.asList(aulas);
    }

    @Override
    public AulaVirtual BuscarPorCodigo(Long id) {
        return restTemplate.getForObject(BASE_URL + id + "/", AulaVirtual.class);
    }

    @Override
    public void guardar(AulaVirtual aulaVirtual) {
        restTemplate.postForObject(BASE_URL, aulaVirtual, AulaVirtual.class);
    }

    @Override
    public void actualizar(AulaVirtual aulaVirtual) {
        restTemplate.put(BASE_URL + aulaVirtual.getCodigo() + "/", aulaVirtual);
    }

    @Override
    public void eliminar(String codigo) {
        restTemplate.delete(BASE_URL + codigo + "/");
    }
}
