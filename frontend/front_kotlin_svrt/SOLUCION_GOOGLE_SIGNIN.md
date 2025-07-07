# Solución para Error de Google Sign-In

## Problemas identificados y solucionados:

### 1. ✅ Inconsistencia en Client IDs
- **Problema**: Había diferentes client IDs en `google-services.json` y `strings.xml`
- **Solución**: Unificado el client ID a `651082139214-hp5ttpf37e1duh3n67l955ksath1o323.apps.googleusercontent.com`

### 2. ✅ Texto corrupto en strings.xml
- **Problema**: Línea 20 tenía texto corrupto: `g.apps.googleusercontent.com`
- **Solución**: Eliminado el texto corrupto

### 3. ✅ Configuración faltante en AndroidManifest.xml
- **Problema**: Faltaba meta-data para Google Sign-In
- **Solución**: Agregada la configuración necesaria

## Pasos adicionales que DEBES hacer:

### 1. Obtener el SHA-1 Fingerprint
Ejecuta el script `get_sha1.ps1` desde PowerShell:

```powershell
cd frontend/front_kotlin_svrt
.\get_sha1.ps1
```

### 2. Configurar Google Cloud Console
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto: `kotlin-8c923`
3. Ve a **APIs & Services** > **Credentials**
4. Encuentra tu OAuth 2.0 Client ID para Android
5. Agrega el SHA-1 fingerprint obtenido del script

### 3. Verificar configuración en Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: `kotlin-8c923`
3. Ve a **Project Settings** > **General**
4. En la sección "Your apps", verifica que tu app Android esté configurada correctamente
5. Si no está, agrega tu app con el package name: `com.tecsup`

### 4. Limpiar y reconstruir el proyecto
```bash
# En Android Studio:
# 1. File > Invalidate Caches / Restart
# 2. Build > Clean Project
# 3. Build > Rebuild Project
```

### 5. Verificar que el backend esté funcionando
Asegúrate de que tu servidor Spring Boot esté ejecutándose en `http://localhost:8080`

## Configuración actual:

### google-services.json ✅
- Project ID: `kotlin-8c923`
- Client ID: `651082139214-hp5ttpf37e1duh3n67l955ksath1o323.apps.googleusercontent.com`

### application.properties ✅
- Google OAuth configurado correctamente
- Client ID: `651082139214-d8fbf0mb0q09veiv7j87858qchpbg19l.apps.googleusercontent.com`

### strings.xml ✅
- default_web_client_id: `651082139214-hp5ttpf37e1duh3n67l955ksath1o323.apps.googleusercontent.com`

## Errores comunes y soluciones:

### Error 12500: "Error de configuración del desarrollador"
- **Causa**: SHA-1 fingerprint no configurado en Google Cloud Console
- **Solución**: Agregar el SHA-1 fingerprint obtenido del script

### Error 12501: "Inicio de sesión cancelado"
- **Causa**: Usuario canceló el proceso
- **Solución**: Normal, no es un error real

### Error de red
- **Causa**: Problemas de conectividad o backend no disponible
- **Solución**: Verificar que el backend esté ejecutándose

## Logs para debugging:
Los logs de Google Sign-In aparecen con el tag `GoogleSignIn` en Android Studio Logcat.

## Contacto:
Si sigues teniendo problemas después de seguir estos pasos, revisa los logs en Android Studio y compártelos. 