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
        DBtable = 'DepartamentoDB'
        ordering = ['nombre']
        verbose_name = "Departamento"
        verbose_name_plural = "Departamentos"
    

class CursoDB(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    departamento = models.ForeignKey(DepartamentoDB, on_delete=models.CASCADE)
    duracion = models.PositiveIntegerField(help_text="Duración en horas")
    fecha_creacion = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.nombre
        
    class Meta:
        DBtable = 'CursoDB'
        ordering = ['nombre']
        verbose_name = "Curso"
        verbose_name_plural = "Cursos"

class ProfesorDB(models.Model):
    nombre = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    codigo = models.CharField(max_length=9, unique=True)
    correo = models.EmailField(unique=True)
    departamento = models.ForeignKey(DepartamentoDB, on_delete=models.CASCADE)
    cursos = models.ManyToManyField(CursoDB)
    fecha_creacion = models.DateField(auto_now_add=True)
    fecha_ingreso = models.DateField()
    observaciones = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.nombre} {self.apellidos}"

    class Meta:
        DBtable = 'ProfesorDB'
        ordering = ['apellidos']
        verbose_name = "Profesor"
        verbose_name_plural = "Profesores"

class CarreraDB(models.Model):
    nombre = models.CharField(max_length=100)
    codigo = models.CharField(max_length=10, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    cursos = models.ForeignKey(CursoDB, on_delete=models.CASCADE, related_name='carreras')
    departamento = models.ForeignKey(DepartamentoDB, on_delete=models.CASCADE, related_name='carreras')
    fecha_creacion = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.nombre

    class Meta:
        DBtable = 'CarreraDB'
        ordering = ['nombre']
        verbose_name = "Carrera"
        verbose_name_plural = "Carreras"