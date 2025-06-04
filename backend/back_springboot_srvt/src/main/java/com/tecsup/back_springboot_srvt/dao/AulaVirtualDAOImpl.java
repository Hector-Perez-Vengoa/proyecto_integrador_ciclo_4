package com.tecsup.back_springboot_srvt.dao;

import com.tecsup.back_springboot_srvt.model.AulaVirtual;
import com.tecsup.back_springboot_srvt.repository.AulaVirtualRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
@Transactional
public class AulaVirtualDAOImpl implements AulaVirtualDAO {

    @PersistenceContext
    private EntityManager entityManager;
    
    @Autowired
    private AulaVirtualRepository aulaVirtualRepository;

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

    @Override
    public List<AulaVirtual> ListarDisponiblesConFiltros(String codigo, String descripcion) {
        return aulaVirtualRepository.findAulasDisponiblesConFiltros(codigo, descripcion);
    }

    @Override
    public List<AulaVirtual> ListarDisponiblesConFiltrosAvanzados(String fecha, String horaInicio, String horaFin, Long cursoId) {
        try {
            // Convertir strings a tipos LocalDate y LocalTime
            LocalDate fechaLocal = null;
            LocalTime horaInicioLocal = null;
            LocalTime horaFinLocal = null;
            
            if (fecha != null && !fecha.trim().isEmpty()) {
                fechaLocal = LocalDate.parse(fecha);
            }
            
            if (horaInicio != null && !horaInicio.trim().isEmpty()) {
                horaInicioLocal = LocalTime.parse(horaInicio);
            }
            
            if (horaFin != null && !horaFin.trim().isEmpty()) {
                horaFinLocal = LocalTime.parse(horaFin);
            }
            
            return aulaVirtualRepository.findAulasDisponiblesConFiltrosAvanzados(
                fechaLocal, horaInicioLocal, horaFinLocal, cursoId);
                
        } catch (Exception e) {
            // En caso de error en la conversión, devolver lista vacía o usar filtros básicos
            System.err.println("Error al procesar filtros avanzados: " + e.getMessage());
            return aulaVirtualRepository.findAulasDisponibles();
        }
    }
}
