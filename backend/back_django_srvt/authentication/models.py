from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# Modelo de Usuario personalizado que extiende el User de Django
class UsuarioCustom(models.Model):
    """
    Modelo que extiende la funcionalidad del User de Django
    con campos adicionales para Google Authentication
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='usuario_custom')
    google_image_url = models.URLField(blank=True, null=True, help_text="URL de imagen de Google")
    has_password = models.BooleanField(default=True, help_text="Indica si el usuario tiene contraseña local")
    
    def __str__(self):
        return f"UsuarioCustom - {self.user.username}"
    
    class Meta:
        db_table = 'usuario_custom'
        verbose_name = "Usuario Personalizado"
        verbose_name_plural = "Usuarios Personalizados"

# Modelo de Roles
class Rol(models.Model):
    """
    Modelo para gestionar roles de usuario
    """
    ROLE_CHOICES = [
        ('ROLE_USER', 'Usuario'),
        ('ROLE_ADMIN', 'Administrador'),
        ('ROLE_MODERATOR', 'Moderador'),
    ]
    
    nombre = models.CharField(max_length=50, choices=ROLE_CHOICES, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.get_nombre_display()
    
    class Meta:
        db_table = 'rol'
        verbose_name = "Rol"
        verbose_name_plural = "Roles"

# Modelo de Departamento
class Departamento(models.Model):
    """
    Modelo para representar departamentos académicos
    """
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    jefe = models.CharField(max_length=100, blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        db_table = 'departamentodb'
        ordering = ['nombre']
        verbose_name = "Departamento"
        verbose_name_plural = "Departamentos"

# Modelo de Carrera
class Carrera(models.Model):
    """
    Modelo para representar carreras académicas
    """
    nombre = models.CharField(max_length=100)
    codigo = models.CharField(max_length=10, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    departamento = models.ForeignKey(Departamento, on_delete=models.SET_NULL, null=True, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        db_table = 'carreradb'
        ordering = ['nombre']
        verbose_name = "Carrera"
        verbose_name_plural = "Carreras"

# Modelo de Curso
class Curso(models.Model):
    """
    Modelo para representar cursos académicos
    """
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    carrera = models.ForeignKey(Carrera, on_delete=models.SET_NULL, null=True, blank=True)
    duracion = models.PositiveIntegerField(help_text="Duración en horas", null=True, blank=True)
    fecha = models.DateField(null=True, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        db_table = 'cursodb'
        ordering = ['nombre']
        verbose_name = "Curso"
        verbose_name_plural = "Cursos"

# Modelo de Perfil actualizado
class Perfil(models.Model):
    """
    Modelo de perfil de usuario actualizado según SpringBoot
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    imagen_perfil = models.URLField(blank=True, null=True, help_text="URL de imagen de perfil")
    telefono = models.CharField(max_length=15, blank=True, null=True)
    biografia = models.TextField(max_length=500, blank=True, null=True)
    fecha_nacimiento = models.DateField(blank=True, null=True)
    departamento = models.ForeignKey(Departamento, on_delete=models.SET_NULL, null=True, blank=True)
    carreras = models.ManyToManyField(Carrera, blank=True, related_name='perfiles', db_table='perfil_carreras')
    cursos = models.ManyToManyField(Curso, blank=True, related_name='perfiles', db_table='perfil_cursos')
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Perfil de {self.user.get_full_name() or self.user.username}"
    
    @property
    def nombre_completo(self):
        return f"{self.user.first_name} {self.user.last_name}".strip() or self.user.username
    
    def perfil_completo(self):
        """Verifica si el perfil tiene la información básica completa"""
        return all([
            self.user.first_name,
            self.user.last_name,
            self.user.email,
        ])
    
    class Meta:
        db_table = 'perfildb'
        verbose_name = "Perfil"
        verbose_name_plural = "Perfiles"


