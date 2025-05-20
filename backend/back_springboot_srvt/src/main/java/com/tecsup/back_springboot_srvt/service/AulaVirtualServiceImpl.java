package com.tecsup.back_springboot_srvt.service;

import com.tecsup.back_springboot_srvt.dao.AulaVirtualDAO;
import com.tecsup.back_springboot_srvt.model.AulaVirtual;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AulaVirtualServiceImpl implements AulaVirtualService{

    private final AulaVirtualDAO aulaVirtualDAO;

    @Autowired
    public AulaVirtualServiceImpl(AulaVirtualDAO aulaVirtualDAO) {
        this.aulaVirtualDAO = aulaVirtualDAO;
    }

    @Override
    public List<AulaVirtual> listar() {
        return aulaVirtualDAO.Listar();
    }

    @Override
    public AulaVirtual obtener(Long id) {
        return aulaVirtualDAO.BuscarPorCodigo(id);
    }

    @Override
    public void crear(AulaVirtual aulaVirtual) {
        aulaVirtualDAO.guardar(aulaVirtual);
    }

    @Override
    public void actualizar(AulaVirtual aulaVirtual) {
        aulaVirtualDAO.actualizar(aulaVirtual);
    }

    @Override
    public void eliminar(String codigo) {
        aulaVirtualDAO.eliminar(codigo);
    }


}
