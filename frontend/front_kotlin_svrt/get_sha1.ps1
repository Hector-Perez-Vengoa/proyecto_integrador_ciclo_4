# Script para obtener el SHA-1 fingerprint del keystore de debug
# Ejecutar este script desde la carpeta raíz del proyecto Android

Write-Host "Obteniendo SHA-1 fingerprint del keystore de debug..." -ForegroundColor Green

# Ruta al keystore de debug (ubicación por defecto en Windows)
$debugKeystorePath = "$env:USERPROFILE\.android\debug.keystore"

if (Test-Path $debugKeystorePath) {
    Write-Host "Keystore encontrado en: $debugKeystorePath" -ForegroundColor Yellow
    
    # Comando para obtener SHA-1
    $keytoolCommand = "keytool -list -v -keystore `"$debugKeystorePath`" -alias androiddebugkey -storepass android -keypass android"
    
    Write-Host "Ejecutando keytool..." -ForegroundColor Yellow
    Write-Host "Comando: $keytoolCommand" -ForegroundColor Gray
    
    try {
        $result = Invoke-Expression $keytoolCommand
        Write-Host "Resultado:" -ForegroundColor Green
        Write-Host $result
        
        # Extraer solo el SHA-1
        $sha1Match = [regex]::Match($result, "SHA1: ([A-F0-9:]+)")
        if ($sha1Match.Success) {
            $sha1 = $sha1Match.Groups[1].Value
            Write-Host "`nSHA-1 Fingerprint:" -ForegroundColor Cyan
            Write-Host $sha1 -ForegroundColor White -BackgroundColor DarkBlue
            Write-Host "`nCopia este SHA-1 y agrégalo a tu proyecto en Google Cloud Console" -ForegroundColor Yellow
        } else {
            Write-Host "No se pudo extraer el SHA-1 del resultado" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "Error ejecutando keytool: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Asegúrate de que Java esté instalado y en el PATH" -ForegroundColor Yellow
    }
} else {
    Write-Host "No se encontró el keystore de debug en: $debugKeystorePath" -ForegroundColor Red
    Write-Host "Esto puede suceder si nunca has ejecutado la aplicación en modo debug" -ForegroundColor Yellow
    Write-Host "Intenta ejecutar la aplicación una vez desde Android Studio" -ForegroundColor Yellow
}

Write-Host "`nPresiona cualquier tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 