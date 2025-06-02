from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class PerfilDB(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    imagen_perfil = models.ImageField(upload_to='perfiles/', blank=True, null=True, default='perfiles/default_profile.png')
    telefono = models.CharField(max_length=15, blank=True, null=True)
    biografia = models.TextField(max_length=500, blank=True, null=True)
    fecha_nacimiento = models.DateField(blank=True, null=True)
    ubicacion = models.CharField(max_length=100, blank=True, null=True)
    sitio_web = models.URLField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    twitter = models.URLField(blank=True, null=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Perfil de {self.user.get_full_name() or self.user.username}"
    
    @property
    def nombre_completo(self):
        return f"{self.user.first_name} {self.user.last_name}".strip() or self.user.username
    
    @property
    def imagen_url(self):
        if self.imagen_perfil and hasattr(self.imagen_perfil, 'url'):
            return self.imagen_perfil.url
        return '/media/perfiles/default_profile.png'
    
    def perfil_completo(self):
        """Verifica si el perfil tiene la información básica completa"""
        return all([
            self.user.first_name,
            self.user.last_name,
            self.user.email,
        ])
    
    class Meta:
        db_table = 'PerfilDB'
        verbose_name = "Perfil"
        verbose_name_plural = "Perfiles"

@receiver(post_save, sender=User)
def crear_perfil_usuario(sender, instance, created, **kwargs):
    if created:
        PerfilDB.objects.create(user=instance)

@receiver(post_save, sender=User)
def guardar_perfil_usuario(sender, instance, **kwargs):
    try:
        instance.perfildb.save()
    except PerfilDB.DoesNotExist:
        PerfilDB.objects.create(user=instance)
