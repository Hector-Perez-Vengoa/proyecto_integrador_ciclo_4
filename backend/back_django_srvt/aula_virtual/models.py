from django.db import models

class DepartamentoDB(models.Model):
    nombre = models.CharField(max_length=100)
    codigo = models.CharField(max_length=10, unique=True, null=True, blank=True)
    descripcion = models.TextField(blank=True, null=True)
    jefe = models.CharField(max_length=100, blank=True, null=True) 
    fecha_creacion = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.nombre

    class Meta:
        db_table = 'DepartamentoDB'
        ordering = ['nombre']
        verbose_name = "Departamento"
        verbose_name_plural = "Departamentos"


class CarreraDB(models.Model):
    nombre = models.CharField(max_length=100)
    codigo = models.CharField(max_length=10, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    cursos = models.ManyToManyField('CursoDB', related_name='carreras')
    profesores = models.ManyToManyField('ProfesorDB', related_name='carreras_profesor')  # Cambié el related_name aquí
    departamento = models.ForeignKey(DepartamentoDB, on_delete=models.CASCADE, related_name='carreras')
    fecha_creacion = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.nombre

    class Meta:
        db_table = 'CarreraDB'
        ordering = ['nombre']
        verbose_name = "Carrera"
        verbose_name_plural = "Carreras"



class CursoDB(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    carrera = models.ForeignKey(CarreraDB, on_delete=models.CASCADE, default=1)
    duracion = models.PositiveIntegerField(help_text="Duración en horas")
    fecha_creacion = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.nombre

    class Meta:
        db_table = 'CursoDB'
        ordering = ['nombre']
        verbose_name = "Curso"
        verbose_name_plural = "Cursos"


class ProfesorDB(models.Model):
    nombre = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    codigo = models.CharField(max_length=9, unique=True)
    correo = models.EmailField(unique=True)
    departamento = models.ForeignKey(DepartamentoDB, on_delete=models.CASCADE)
    carreras = models.ManyToManyField('CarreraDB', related_name='profesores_relacionados')  # Cambié el related_name aquí
    cursos = models.ManyToManyField(CursoDB)
    fecha_creacion = models.DateField(auto_now_add=True)
    fecha_ingreso = models.DateField()
    observaciones = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.nombre} {self.apellidos}"

    class Meta:
        db_table = 'ProfesorDB'
        ordering = ['apellidos']
        verbose_name = "Profesor"
        verbose_name_plural = "Profesores"


class AulaVirtualDB(models.Model):
    codigo = models.CharField(unique=True, max_length=2)
    profesor = models.ForeignKey(ProfesorDB, on_delete=models.CASCADE)
    curso = models.ForeignKey(CursoDB, on_delete=models.CASCADE)
    estado = models.CharField(max_length=20, choices=[('disponible', 'Disponible'), ('reservado', 'Reservado')], default='disponible')
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    fecha_reserva = models.DateField()
    motivo_reserva = models.CharField(max_length=100, blank=True, null=True)
    fecha_creacion = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Cubículo {self.codigo} - {self.profesor}"

    class Meta:
        db_table = 'Aula_VirtualDB'
        ordering = ['codigo']
        verbose_name = "Aula Virtual"
        verbose_name_plural = "Aulas Virtuales"
