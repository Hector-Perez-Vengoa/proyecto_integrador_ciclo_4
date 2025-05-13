from django.db import models
from profesor.models import ProfesorDB, CursoDB
from django.core.validators import MinValueValidator, MaxValueValidator

class CubiculoDB(models.Model):
    codigo = models.IntegerField(unique=True,max_length=2)
    profesor = models.ForeignKey(ProfesorDB, on_delete=models.CASCADE)
    curso = models.ForeignKey(CursoDB, on_delete=models.CASCADE)
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    fecha_reserva = models.DateField()
    fecha_creacion = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Cubículo {self.codigo} - {self.profesor}"

    class Meta:
        db_table = 'cubiculosDB'
        ordering = ['codigo']
        verbose_name = "Cubículo"
        verbose_name_plural = "Cubículos"
