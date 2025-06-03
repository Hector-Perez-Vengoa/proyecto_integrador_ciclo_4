package com.tecsup.back_springboot_srvt.dao;

import com.tecsup.back_springboot_srvt.model.AulaVirtual;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public class AulaVirtualDAOImpl implements AulaVirtualDAO {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<AulaVirtual> Listar() {
        TypedQuery<AulaVirtual> query = entityManager.createQuery(
            "SELECT a FROM AulaVirtual a", AulaVirtual.class);
        return query.getResultList();
    }

    @Override
    public List<AulaVirtual> ListarDisponibles() {
        TypedQuery<AulaVirtual> query = entityManager.createQuery(
            "SELECT a FROM AulaVirtual a WHERE a.estado = 'disponible'", AulaVirtual.class);
        return query.getResultList();
    }

    @Override
    public AulaVirtual BuscarPorCodigo(Long id) {
        return entityManager.find(AulaVirtual.class, id);
    }

    @Override
    public void guardar(AulaVirtual aulaVirtual) {
        entityManager.persist(aulaVirtual);
    }

    @Override
    public void actualizar(AulaVirtual aulaVirtual) {
        entityManager.merge(aulaVirtual);
    }

    @Override
    public void eliminar(String codigo) {
        TypedQuery<AulaVirtual> query = entityManager.createQuery(
            "SELECT a FROM AulaVirtual a WHERE a.codigo = :codigo", AulaVirtual.class);
        query.setParameter("codigo", codigo);
        
        List<AulaVirtual> aulas = query.getResultList();
        if (!aulas.isEmpty()) {
            entityManager.remove(aulas.get(0));
        }
    }
}
