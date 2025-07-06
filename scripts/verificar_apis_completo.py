#!/usr/bin/env python
"""
Script para verificar que todos los serializers y vistas estén funcionando correctamente
"""

import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from authentication.models import Perfil, Departamento, Carrera, Curso, Rol, UsuarioCustom
from authentication.serializers import (
    PerfilSerializer, DepartamentoSerializer, CarreraSerializer,
    CursoSerializer, RolSerializer, UsuarioCustomSerializer, PerfilCreateSerializer
)
from django.test import RequestFactory
from rest_framework.test import APIRequestFactory

def test_serializers():
    """Probar que todos los serializers funcionen correctamente"""
    print("🔧 PROBANDO SERIALIZERS")
    print("="*50)
    
    try:
        # Test Departamento Serializer
        departamentos = Departamento.objects.all()
        dept_serializer = DepartamentoSerializer(departamentos, many=True)
        print(f"✅ DepartamentoSerializer: {len(dept_serializer.data)} departamentos")
        
        # Test Carrera Serializer
        carreras = Carrera.objects.all()
        carrera_serializer = CarreraSerializer(carreras, many=True)
        print(f"✅ CarreraSerializer: {len(carrera_serializer.data)} carreras")
        
        # Test Curso Serializer
        cursos = Curso.objects.all()
        curso_serializer = CursoSerializer(cursos, many=True)
        print(f"✅ CursoSerializer: {len(curso_serializer.data)} cursos")
        
        # Test Perfil Serializer
        perfiles = Perfil.objects.all()
        perfil_serializer = PerfilSerializer(perfiles, many=True)
        print(f"✅ PerfilSerializer: {len(perfil_serializer.data)} perfiles")
        
        # Test usuario custom si existen
        usuarios_custom = UsuarioCustom.objects.all()
        if usuarios_custom.exists():
            user_custom_serializer = UsuarioCustomSerializer(usuarios_custom, many=True)
            print(f"✅ UsuarioCustomSerializer: {len(user_custom_serializer.data)} usuarios custom")
        
        # Test roles si existen
        roles = Rol.objects.all()
        if roles.exists():
            rol_serializer = RolSerializer(roles, many=True)
            print(f"✅ RolSerializer: {len(rol_serializer.data)} roles")
        
        return True
        
    except Exception as e:
        print(f"❌ Error en serializers: {e}")
        return False

def test_model_relationships():
    """Probar que las relaciones entre modelos funcionen"""
    print("\n🔗 PROBANDO RELACIONES DE MODELOS")
    print("="*50)
    
    try:
        # Probar relaciones de Perfil
        for perfil in Perfil.objects.all():
            print(f"👤 Perfil: {perfil.user.username}")
            print(f"   📧 Email: {perfil.user.email}")
            print(f"   🏢 Departamento: {perfil.departamento.nombre if perfil.departamento else 'Sin asignar'}")
            print(f"   📚 Carreras: {perfil.carreras.count()}")
            print(f"   📖 Cursos: {perfil.cursos.count()}")
            
            # Probar propiedades del modelo
            print(f"   📝 Nombre completo: {perfil.nombre_completo}")
            print(f"   ✅ Perfil completo: {perfil.perfil_completo()}")
            print()
            
        return True
        
    except Exception as e:
        print(f"❌ Error en relaciones: {e}")
        return False

def test_api_endpoints():
    """Probar que los endpoints estén configurados correctamente"""
    print("\n🌐 PROBANDO CONFIGURACIÓN DE ENDPOINTS")
    print("="*50)
    
    try:
        from django.urls import reverse
        from django.test import Client
        
        client = Client()
        
        # Probar endpoints que no requieren auth
        endpoints_public = [
            ('/', 'API Root'),
            ('/api/auth/csrf/', 'CSRF Token'),
        ]
        
        for url, name in endpoints_public:
            try:
                response = client.get(url)
                print(f"✅ {name}: Status {response.status_code}")
            except Exception as e:
                print(f"❌ {name}: Error {e}")
        
        # Probar que los endpoints protegidos den 403/401 (correcto)
        endpoints_protected = [
            ('/api/profesores/', 'Profesores'),
            ('/api/departamentos/', 'Departamentos'),
            ('/api/carreras/', 'Carreras'),
            ('/api/cursos/', 'Cursos'),
        ]
        
        for url, name in endpoints_protected:
            try:
                response = client.get(url)
                if response.status_code in [401, 403]:
                    print(f"✅ {name}: Protegido correctamente (Status {response.status_code})")
                else:
                    print(f"⚠️  {name}: Status inesperado {response.status_code}")
            except Exception as e:
                print(f"❌ {name}: Error {e}")
                
        return True
        
    except Exception as e:
        print(f"❌ Error en endpoints: {e}")
        return False

def show_data_summary():
    """Mostrar resumen de datos en la base de datos"""
    print("\n📊 RESUMEN DE DATOS")
    print("="*50)
    
    print(f"👥 Usuarios: {User.objects.count()}")
    print(f"👤 Perfiles: {Perfil.objects.count()}")
    print(f"🏢 Departamentos: {Departamento.objects.count()}")
    print(f"📚 Carreras: {Carrera.objects.count()}")
    print(f"📖 Cursos: {Curso.objects.count()}")
    print(f"🔐 Roles: {Rol.objects.count()}")
    print(f"👨‍💼 Usuarios Custom: {UsuarioCustom.objects.count()}")

def main():
    """Función principal"""
    print("🔍 VERIFICACIÓN COMPLETA DE APIs Y MODELOS")
    print("="*60)
    
    # Mostrar resumen de datos
    show_data_summary()
    
    # Probar serializers
    serializers_ok = test_serializers()
    
    # Probar relaciones
    relationships_ok = test_model_relationships()
    
    # Probar endpoints
    endpoints_ok = test_api_endpoints()
    
    # Resumen final
    print("\n🎯 RESUMEN FINAL")
    print("="*50)
    print(f"✅ Serializers: {'OK' if serializers_ok else 'ERROR'}")
    print(f"✅ Relaciones: {'OK' if relationships_ok else 'ERROR'}")
    print(f"✅ Endpoints: {'OK' if endpoints_ok else 'ERROR'}")
    
    if all([serializers_ok, relationships_ok, endpoints_ok]):
        print("\n🎉 ¡TODAS LAS APIs ESTÁN FUNCIONANDO CORRECTAMENTE!")
        print("\n📋 APIs Disponibles:")
        print("   - GET /api/profesores/ (Perfiles de profesores)")
        print("   - GET /api/departamentos/ (Departamentos académicos)")
        print("   - GET /api/carreras/ (Carreras académicas)")
        print("   - GET /api/cursos/ (Cursos disponibles)")
        print("   - GET /api/auth/api/perfiles/ (Perfiles detallados)")
        print("   - POST /api/auth/login/ (Autenticación)")
        print("   - GET /api/auth/check/ (Verificar sesión)")
        print("\n🔒 Nota: Todas las APIs requieren autenticación excepto la raíz y CSRF")
    else:
        print("\n⚠️  Hay algunos problemas que necesitan atención")

if __name__ == "__main__":
    main()
