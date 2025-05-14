from rest_framework import serializers
from .models import CubiculoDB

class CubiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CubiculoDB
        fields = '__all__'
        read_only_fields = ['id', 'fecha_creacion']

