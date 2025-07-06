#!/usr/bin/env python
"""
Script para probar APIs con autenticación
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def login_and_get_session():
    """Hacer login y obtener session para autenticación"""
    print("🔐 Intentando hacer login...")
    
    # Primero obtener CSRF token
    csrf_response = requests.get(f"{BASE_URL}/api/auth/csrf/")
    if csrf_response.status_code != 200:
        print("   ❌ No se pudo obtener CSRF token")
        return None
    
    csrf_token = csrf_response.json()['csrf_token']
    print(f"   ✅ CSRF token obtenido: {csrf_token[:20]}...")
    
    # Hacer login
    login_data = {
        'username': 'admin',
        'password': 'admin123'
    }
    
    headers = {
        'X-CSRFToken': csrf_token,
        'Content-Type': 'application/json'
    }
    
    # Crear session para mantener cookies
    session = requests.Session()
    session.headers.update(headers)
    
    # Establecer CSRF token en cookies
    session.cookies.set('csrftoken', csrf_token)
    
    login_response = session.post(f"{BASE_URL}/api/auth/login/", json=login_data)
    
    if login_response.status_code == 200:
        print("   ✅ Login exitoso")
        return session
    else:
        print(f"   ❌ Login falló: {login_response.text}")
        return None

def test_authenticated_apis():
    """Probar APIs con autenticación"""
    print("\n🚀 PROBANDO APIs CON AUTENTICACIÓN")
    print("="*50)
    
    # Hacer login
    session = login_and_get_session()
    if not session:
        print("❌ No se pudo autenticar. Saliendo...")
        return
    
    # APIs a probar
    endpoints = [
        ("/api/profesores/", "Profesores"),
        ("/api/departamentos/", "Departamentos"),
        ("/api/carreras/", "Carreras"), 
        ("/api/cursos/", "Cursos"),
        ("/api/auth/api/perfiles/", "Perfiles (detallado)"),
        ("/api/reservas/", "Reservas"),
        ("/api/aulas-virtuales/", "Aulas Virtuales"),
    ]
    
    success_count = 0
    total_count = len(endpoints)
    
    for endpoint, name in endpoints:
        print(f"\n🔍 Probando {name}:")
        print(f"   URL: {BASE_URL}{endpoint}")
        
        try:
            response = session.get(f"{BASE_URL}{endpoint}", timeout=10)
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    if isinstance(data, list):
                        print(f"   ✅ Lista con {len(data)} elementos")
                        if len(data) > 0 and isinstance(data[0], dict):
                            print(f"   📄 Campos del primer elemento: {list(data[0].keys())}")
                    elif isinstance(data, dict):
                        print(f"   ✅ Diccionario con {len(data)} campos")
                        print(f"   📄 Campos: {list(data.keys())}")
                    success_count += 1
                except Exception as e:
                    print(f"   ⚠️  Error al parsear JSON: {e}")
                    print(f"   📄 Respuesta: {response.text[:200]}...")
            else:
                print(f"   ❌ Error: {response.text[:100]}...")
                
        except Exception as e:
            print(f"   ❌ Error de conexión: {e}")
    
    # Resumen
    print("\n" + "="*50)
    print("📊 RESUMEN FINAL:")
    print(f"   ✅ APIs funcionando: {success_count}/{total_count}")
    print(f"   📈 Porcentaje de éxito: {(success_count/total_count)*100:.1f}%")
    
    if success_count == total_count:
        print("\n🎉 ¡Todas las APIs están funcionando perfectamente!")
    elif success_count > total_count * 0.7:
        print("\n✅ La mayoría de APIs funcionan bien")
    else:
        print("\n⚠️  Hay problemas con varias APIs")

if __name__ == "__main__":
    test_authenticated_apis()
