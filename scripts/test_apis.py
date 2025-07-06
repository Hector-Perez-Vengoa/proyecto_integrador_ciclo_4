#!/usr/bin/env python
"""
Script para probar todas las APIs del sistema
"""

import requests
import json
import sys

BASE_URL = "http://127.0.0.1:8000"

def test_api_endpoint(url, name, method='GET', data=None):
    """Probar un endpoint específico"""
    try:
        print(f"\n🔍 Probando {name}:")
        print(f"   URL: {url}")
        
        if method == 'GET':
            response = requests.get(url, timeout=5)
        elif method == 'POST':
            response = requests.post(url, json=data, timeout=5)
        
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                if isinstance(data, list):
                    print(f"   ✅ Datos: Lista con {len(data)} elementos")
                    if len(data) > 0:
                        print(f"   📄 Primer elemento: {list(data[0].keys()) if data[0] else 'Vacío'}")
                elif isinstance(data, dict):
                    print(f"   ✅ Datos: Diccionario con {len(data)} campos")
                    print(f"   📄 Campos: {list(data.keys())}")
                else:
                    print(f"   ✅ Datos: {type(data)}")
            except:
                print(f"   📄 Respuesta: {response.text[:100]}...")
        elif response.status_code == 401:
            print(f"   🔒 Requiere autenticación")
        elif response.status_code == 404:
            print(f"   ❌ No encontrado")
        else:
            print(f"   ⚠️  Error: {response.text[:100]}...")
            
        return response.status_code == 200
        
    except requests.exceptions.ConnectionError:
        print(f"   ❌ Error de conexión - ¿Está el servidor corriendo?")
        return False
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False

def main():
    print("🚀 PROBANDO TODAS LAS APIs DEL SISTEMA")
    print("="*50)
    
    # Probar raíz
    success_count = 0
    total_count = 0
    
    # 1. API Raíz
    total_count += 1
    if test_api_endpoint(f"{BASE_URL}/", "API Raíz"):
        success_count += 1
    
    # 2. APIs de autenticación (sin auth requerida)
    endpoints_no_auth = [
        ("/api/auth/csrf/", "CSRF Token"),
    ]
    
    for endpoint, name in endpoints_no_auth:
        total_count += 1
        if test_api_endpoint(f"{BASE_URL}{endpoint}", name):
            success_count += 1
    
    # 3. APIs principales (pueden requerir auth)
    endpoints_main = [
        ("/api/profesores/", "Profesores"),
        ("/api/departamentos/", "Departamentos"),  
        ("/api/carreras/", "Carreras"),
        ("/api/cursos/", "Cursos"),
        ("/api/auth/api/perfiles/", "Perfiles (detallado)"),
        ("/api/auth/api/roles/", "Roles"),
        ("/api/reservas/", "Reservas"),
        ("/api/aulas-virtuales/", "Aulas Virtuales"),
    ]
    
    for endpoint, name in endpoints_main:
        total_count += 1
        if test_api_endpoint(f"{BASE_URL}{endpoint}", name):
            success_count += 1
    
    # Resumen
    print("\n" + "="*50)
    print("📊 RESUMEN DE PRUEBAS:")
    print(f"   ✅ Exitosas: {success_count}/{total_count}")
    print(f"   📈 Porcentaje: {(success_count/total_count)*100:.1f}%")
    
    if success_count == total_count:
        print("\n🎉 ¡Todas las APIs están funcionando!")
    else:
        print(f"\n⚠️  {total_count - success_count} APIs tienen problemas")
        print("   Nota: Los errores 401 (auth requerida) son normales para APIs protegidas")

if __name__ == "__main__":
    main()
