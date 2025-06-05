from django.db import models
from django.contrib.auth.models import User

class DepartamentoDB(models.Model):
    nombre = models.CharField(max_length=100, blank=True)  # blank=True está bien para permitir vacíos en formularios
    descripcion = models.TextField(blank=True, null=True)
    fecha_creacion = models.DateField(auto_now_add=True)
    jefe = models.CharField(max_length=100, blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return self.nombre

    class Meta:
        db_table = 'departamentodb'
        ordering = ['nombre']
        verbose_name = "Departamento"
        verbose_name_plural = "Departamentos"


class CarreraDB(models.Model):
    nombre = models.CharField(max_length=100, blank=True)
    codigo = models.CharField(max_length=3, blank=True, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    departamento = models.ForeignKey(DepartamentoDB, blank=True, null=True, on_delete=models.CASCADE)
    fecha_creacion = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return self.nombre

    class Meta:
        db_table = 'carreradb'
        ordering = ['nombre']
        verbose_name = "Carrera"
        verbose_name_plural = "Carreras"


class CursoDB(models.Model):
    nombre = models.CharField(max_length=100, blank=True)
    descripcion = models.TextField(blank=True, null=True)
    duracion = models.PositiveIntegerField(help_text="Duración en horas", blank=True, null=True)
    fecha = models.DateField(blank=True, null=True)
    carrera = models.ForeignKey(CarreraDB, blank=True, null=True, on_delete=models.CASCADE)
    fecha_creacion = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return self.nombre

    class Meta:
        db_table = 'cursodb'
        ordering = ['nombre']
        verbose_name = "Curso"
        verbose_name_plural = "Cursos"


class ProfesorDB(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True)
    codigo = models.CharField(max_length=9, unique=True, blank=True, null=True)
    nombres = models.CharField(max_length=100, blank=True)
    apellidos = models.CharField(max_length=100, blank=True)
    correo = models.EmailField(unique=True, blank=True, null=True)
    departamento = models.ForeignKey(DepartamentoDB, blank=True, null=True, on_delete=models.CASCADE)
    carreras = models.ManyToManyField(CarreraDB, blank=True, related_name='profesores')  # Cambiado a ManyToManyField
    cursos = models.ManyToManyField(CursoDB, blank=True, related_name='profesores')
    fecha_creacion = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return f"{self.nombres} {self.apellidos}"

    class Meta:
        db_table = 'profesordb'
        ordering = ['apellidos']
        verbose_name = "Profesor"
        verbose_name_plural = "Profesores"
        


class AulaVirtualDB(models.Model):
    codigo = models.CharField(unique=True, max_length=2)
    descripcion = models.TextField(blank=True, null=True)
    estado = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        choices=[
            ('disponible', 'Disponible'),
            ('reservada', 'Reservada'),
            ('en_uso', 'En Uso'),
            ('en_mantenimiento', 'En_Mantenimiento'),
            ('inactiva', 'Inactiva'),
            ('bloqueada', 'Bloqueada')
        ],
        default='disponible'
    )
    fecha_creacion = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return f"AulaVirtual {self.codigo} "

    class Meta:
        db_table = 'aula_virtualdb'
        ordering = ['codigo']
        verbose_name = "Aula Virtual"
        verbose_name_plural = "Aulas Virtuales"


class ReservaDB(models.Model):
    profesor = models.ForeignKey(ProfesorDB, on_delete=models.CASCADE)
    aula_virtual = models.ForeignKey(AulaVirtualDB, on_delete=models.CASCADE)
    curso = models.ForeignKey(CursoDB, on_delete=models.CASCADE)
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    fecha_reserva = models.DateField()
    motivo = models.CharField(max_length=100, blank=True, null=True)
    estado = models.CharField(
        max_length=20,
        choices=[
            ('disponible', 'Disponible'),
            ('reservado', 'Reservado')
        ],
        default='disponible'
    )
    fecha_creacion = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return f"Reserva de {self.profesor} para {self.curso} el {self.fecha_reserva}"

    class Meta:
        db_table = 'reservadb'
        ordering = ['fecha_reserva']
        verbose_name = "Reserva"
        verbose_name_plural = "Reservas"
