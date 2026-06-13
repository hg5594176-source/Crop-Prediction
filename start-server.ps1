# ============================================================
# Local Web Server for AI Crop Dashboard
# Runs natively in PowerShell (no Node.js or Python required)
# ============================================================

$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Host "=============================================" -ForegroundColor Green
    Write-Host "  AI Crop Dashboard Server is now running!" -ForegroundColor Green
    Write-Host "  URL: http://localhost:$port/" -ForegroundColor Cyan
    Write-Host "  Press Ctrl+C in this window to stop. " -ForegroundColor Yellow
    Write-Host "=============================================" -ForegroundColor Green
    
    # Auto-open browser
    Start-Process "http://localhost:$port/index.html"
} catch {
    Write-Host "Error starting server: $_" -ForegroundColor Red
    Write-Host "Make sure port $port is not already in use." -ForegroundColor Yellow
    Exit
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "/" -or $urlPath -eq "") {
            $urlPath = "/index.html"
        }

        # Resolve clean relative path inside project directory
        # Unescape URL characters (e.g., spaces represented as %20)
        $cleanPath = [Uri]::UnescapeDataString($urlPath).TrimStart('/')
        $filePath = Join-Path (Get-Location) $cleanPath

        if (Test-Path $filePath -PathType Leaf) {
            try {
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                
                # Determine Content-Type header
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $contentType = switch ($ext) {
                    ".html" { "text/html; charset=utf-8" }
                    ".css"  { "text/css; charset=utf-8" }
                    ".js"   { "application/javascript; charset=utf-8" }
                    ".png"  { "image/png" }
                    ".jpg"  { "image/jpeg" }
                    ".jpeg" { "image/jpeg" }
                    ".gif"  { "image/gif" }
                    ".svg"  { "image/svg+xml" }
                    ".ico"  { "image/x-icon" }
                    ".json" { "application/json; charset=utf-8" }
                    default { "application/octet-stream" }
                }

                $response.ContentType = $contentType
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } catch {
                $response.StatusCode = 500
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes("500 Internal Server Error: $_")
                $response.ContentLength64 = $errBytes.Length
                $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
            }
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlPath")
            $response.ContentLength64 = $errBytes.Length
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.Close()
    }
} catch {
    # Silence listener abort/interrupt exceptions on exit
} finally {
    $listener.Stop()
    Write-Host "`nServer stopped." -ForegroundColor Yellow
}
