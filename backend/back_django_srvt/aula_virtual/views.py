from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from authentication.models import Departamento, Carrera, Curso
from .models import (
    AulaVirtual, AulaVirtualImagen, AulaVirtualComponente, 
    Reserva, BloqueHorario, Notificacion, CalendarioInstitucional, Reglamento
)
from .serializers import (
    AulaVirtualSerializer, AulaVirtualListSerializer, AulaVirtualImagenSerializer,
    AulaVirtualComponenteSerializer, ReservaSerializer, ReservaListSerializer,
    BloqueHorarioSerializer, NotificacionSerializer, CalendarioInstitucionalSerializer,
    ReglamentoSerializer
)

class AulaVirtualViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar las aulas virtuales
    """
    queryset = AulaVirtual.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return AulaVirtualListSerializer
        return AulaVirtualSerializer
    
    @action(detail=True, methods=['get'])
    def disponibilidad(self, request, pk=None):
        """
        Endpoint para verificar la disponibilidad de un aula virtual
        """
        aula = self.get_object()
        fecha = request.query_params.get('fecha')
        
        if not fecha:
            return Response(
                {'error': 'Parámetro fecha es requerido (formato: YYYY-MM-DD)'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            from datetime import datetime
            fecha_obj = datetime.strptime(fecha, '%Y-%m-%d').date()
            
            # Buscar reservas existentes
            reservas = Reserva.objects.filter(
                aula_virtual=aula,
                fecha_reserva=fecha_obj,
                estado__in=['pendiente', 'confirmada', 'en_uso']
            )
            
            # Buscar bloques horarios
            bloques = BloqueHorario.objects.filter(
                aula_virtual=aula,
                fecha=fecha_obj,
                tipo__in=['bloqueado', 'mantenimiento']
            )
            
            return Response({
                'aula': aula.codigo,
                'fecha': fecha,
                'reservas': ReservaListSerializer(reservas, many=True).data,
                'bloques_ocupados': BloqueHorarioSerializer(bloques, many=True).data
            })
            
        except ValueError:
            return Response(
                {'error': 'Formato de fecha inválido. Use YYYY-MM-DD'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

class AulaVirtualImagenViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar las imágenes de aulas virtuales
    """
    queryset = AulaVirtualImagen.objects.all()
    serializer_class = AulaVirtualImagenSerializer
    permission_classes = [permissions.IsAuthenticated]

class AulaVirtualComponenteViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar los componentes de aulas virtuales
    """
    queryset = AulaVirtualComponente.objects.all()
    serializer_class = AulaVirtualComponenteSerializer
    permission_classes = [permissions.IsAuthenticated]

class ReservaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar las reservas
    """
    queryset = Reserva.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ReservaListSerializer
        return ReservaSerializer
    
    def get_queryset(self):
        """
        Filtrar reservas según el usuario
        """
        queryset = Reserva.objects.all()
        
        # Los usuarios normales solo ven sus propias reservas
        if not self.request.user.is_staff:
            queryset = queryset.filter(user=self.request.user)
        
        # Filtros opcionales
        fecha_desde = self.request.query_params.get('fecha_desde')
        fecha_hasta = self.request.query_params.get('fecha_hasta')
        estado = self.request.query_params.get('estado')
        aula_id = self.request.query_params.get('aula_id')
        
        if fecha_desde:
            queryset = queryset.filter(fecha_reserva__gte=fecha_desde)
        if fecha_hasta:
            queryset = queryset.filter(fecha_reserva__lte=fecha_hasta)
        if estado:
            queryset = queryset.filter(estado=estado)
        if aula_id:
            queryset = queryset.filter(aula_virtual_id=aula_id)
            
        return queryset
    
    def perform_create(self, serializer):
        """
        Asignar el usuario actual al crear una reserva
        """
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def cancelar(self, request, pk=None):
        """
        Endpoint para cancelar una reserva
        """
        reserva = self.get_object()
        
        # Verificar permisos
        if reserva.user != request.user and not request.user.is_staff:
            return Response(
                {'error': 'No tiene permisos para cancelar esta reserva'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        motivo = request.data.get('motivo', 'Cancelado por el usuario')
        observaciones = request.data.get('observaciones', '')
        
        if reserva.cancelar(motivo, request.user.username, observaciones):
            return Response({'message': 'Reserva cancelada exitosamente'})
        else:
            return Response(
                {'error': 'No se puede cancelar esta reserva'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

class BloqueHorarioViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar los bloques horarios
    """
    queryset = BloqueHorario.objects.all()
    serializer_class = BloqueHorarioSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Filtrar bloques horarios
        """
        queryset = BloqueHorario.objects.all()
        
        fecha = self.request.query_params.get('fecha')
        aula_id = self.request.query_params.get('aula_id')
        tipo = self.request.query_params.get('tipo')
        
        if fecha:
            queryset = queryset.filter(fecha=fecha)
        if aula_id:
            queryset = queryset.filter(aula_virtual_id=aula_id)
        if tipo:
            queryset = queryset.filter(tipo=tipo)
            
        return queryset

class NotificacionViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar las notificaciones
    """
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Los usuarios solo ven sus propias notificaciones
        """
        return Notificacion.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def marcar_leida(self, request, pk=None):
        """
        Marcar una notificación como leída
        """
        notificacion = self.get_object()
        notificacion.marcar_como_leida()
        return Response({'message': 'Notificación marcada como leída'})
    
    @action(detail=False, methods=['post'])
    def marcar_todas_leidas(self, request):
        """
        Marcar todas las notificaciones del usuario como leídas
        """
        notificaciones = self.get_queryset().filter(leida=False)
        for notificacion in notificaciones:
            notificacion.marcar_como_leida()
        
        return Response({
            'message': f'{notificaciones.count()} notificaciones marcadas como leídas'
        })

class CalendarioInstitucionalViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar el calendario institucional
    """
    queryset = CalendarioInstitucional.objects.all()
    serializer_class = CalendarioInstitucionalSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Filtrar eventos del calendario
        """
        queryset = CalendarioInstitucional.objects.all()
        
        fecha_desde = self.request.query_params.get('fecha_desde')
        fecha_hasta = self.request.query_params.get('fecha_hasta')
        tipo_evento = self.request.query_params.get('tipo_evento')
        
        if fecha_desde:
            queryset = queryset.filter(fecha_inicio__gte=fecha_desde)
        if fecha_hasta:
            queryset = queryset.filter(fecha_fin__lte=fecha_hasta)
        if tipo_evento:
            queryset = queryset.filter(tipo_evento=tipo_evento)
            
        return queryset
    
    def perform_create(self, serializer):
        """
        Asignar el usuario actual como creador del evento
        """
        serializer.save(creado_por=self.request.user)

class ReglamentoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar los reglamentos
    """
    queryset = Reglamento.objects.all()
    serializer_class = ReglamentoSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Filtrar reglamentos
        """
        queryset = Reglamento.objects.all()
        
        tipo = self.request.query_params.get('tipo')
        estado = self.request.query_params.get('estado')
        obligatorio = self.request.query_params.get('obligatorio')
        
        if tipo:
            queryset = queryset.filter(tipo=tipo)
        if estado:
            queryset = queryset.filter(estado=estado)
        if obligatorio is not None:
            queryset = queryset.filter(es_obligatorio=obligatorio.lower() == 'true')
            
        return queryset
    
    @action(detail=True, methods=['post'])
    def incrementar_visualizaciones(self, request, pk=None):
        """
        Incrementar el contador de visualizaciones
        """
        reglamento = self.get_object()
        reglamento.incrementar_visualizaciones()
        return Response({'message': 'Visualización registrada'})
    
    @action(detail=True, methods=['post'])
    def incrementar_descargas(self, request, pk=None):
        """
        Incrementar el contador de descargas
        """
        reglamento = self.get_object()
        reglamento.incrementar_descargas()
        return Response({'message': 'Descarga registrada'})
