# Generates the raster brand images into src/static/assets/img:
#   og-hu.png, og-en.png (1200x630 social share), logo-512.png (JSON-LD logo),
#   apple-touch-icon.png (180x180), favicon-48.png.
# Windows only (System.Drawing). Run with: npm run images
# This file must stay saved as UTF-8 *with BOM*, or Windows PowerShell 5.1 garbles the accents.

Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = 'Stop'

$outDir = Join-Path $PSScriptRoot '..\src\static\assets\img'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

function New-Color([string]$hex, [int]$alpha = 255) {
  $c = [System.Drawing.ColorTranslator]::FromHtml($hex)
  return [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B)
}

$night = New-Color '#140e17'; $skinHi = New-Color '#5b3a63'; $flesh = New-Color '#f1e6cc'
$seed = New-Color '#b81f33'; $seedHi = New-Color '#e04456'; $stem = New-Color '#c7a24f'; $inkDim = New-Color '#bfaec4'

# Fig outline from the site's SVG symbol (#fig-cut), as four cubic Béziers.
function New-FigPath([double[]]$points, [double]$cx, [double]$cy, [double]$s) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  for ($i = 0; $i -lt 4; $i++) {
    $o = $i * 6
    $p = @()
    for ($k = 0; $k -lt 8; $k += 2) {
      $idx = ($o + $k) % 24
      $p += New-Object System.Drawing.PointF ([float]($cx + $points[$idx] * $s)), ([float]($cy + $points[$idx + 1] * $s))
    }
    $path.AddBezier($p[0], $p[1], $p[2], $p[3])
  }
  $path.CloseFigure()
  return $path
}
# start, c1, c2, end for each segment (end of one = start of next)
$skinPts  = @(0,-9, 3,-6, 8.5,-2, 8.5,4.5, 8.5,10, 4.3,12.5, 0,12.5, -4.3,12.5, -8.5,10, -8.5,4.5, -8.5,-2, -3,-6)
$fleshPts = @(0,-7, 2.6,-4.6, 7,-1.4, 7,4.4, 7,8.8, 3.6,11, 0,11, -3.6,11, -7,8.8, -7,4.4, -7,-1.4, -2.6,-4.6)
$seedPts  = @(0,-3.5, 2,-1.8, 5.2,0.5, 5.2,4.6, 5.2,7.8, 2.6,9.4, 0,9.4, -2.6,9.4, -5.2,7.8, -5.2,4.6, -5.2,0.5, -2,-1.8)

function Draw-Fig($g, [double]$cx, [double]$cy, [double]$s) {
  $g.FillRectangle((New-Object System.Drawing.SolidBrush $stem), [float]($cx - 0.8 * $s), [float]($cy - 11 * $s), [float](1.6 * $s), [float](3.6 * $s))
  $g.FillPath((New-Object System.Drawing.SolidBrush $skinHi), (New-FigPath $skinPts $cx $cy $s))
  $g.FillPath((New-Object System.Drawing.SolidBrush $flesh), (New-FigPath $fleshPts $cx $cy $s))
  $g.FillPath((New-Object System.Drawing.SolidBrush $seed), (New-FigPath $seedPts $cx $cy $s))
  $dot = New-Object System.Drawing.SolidBrush (New-Color '#f1e6cc' 215)
  foreach ($d in @(@(-2,3), @(1.6,5), @(-0.6,7), @(2.4,2), @(-3,6), @(0,1))) {
    $r = 0.55 * $s
    $g.FillEllipse($dot, [float]($cx + $d[0] * $s - $r), [float]($cy + $d[1] * $s - $r), [float](2 * $r), [float](2 * $r))
  }
}

function New-Canvas([int]$w, [int]$h) {
  $bmp = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'; $g.TextRenderingHint = 'AntiAliasGridFit'; $g.InterpolationMode = 'HighQualityBicubic'
  return @($bmp, $g)
}

function Save-Png($bmp, $g, [string]$name) {
  $g.Dispose()
  $bmp.Save((Join-Path $outDir $name), [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Host "  wrote $name"
}

function New-OgImage([string]$name, [string]$kicker, [string]$title, [string]$subtitle) {
  $canvas = New-Canvas 1200 630; $bmp = $canvas[0]; $g = $canvas[1]
  $g.Clear($night)
  $glow = New-Object System.Drawing.Drawing2D.GraphicsPath
  $glow.AddEllipse(560, -120, 860, 860)
  $glowBrush = New-Object System.Drawing.Drawing2D.PathGradientBrush $glow
  $glowBrush.CenterColor = New-Color '#2c1a33'; $glowBrush.SurroundColors = @($night)
  $g.FillPath($glowBrush, $glow)

  Draw-Fig $g 930 300 21
  Draw-Fig $g 96 78 2.4
  $g.DrawString('Figlab', (New-Object System.Drawing.Font 'Georgia', 30), (New-Object System.Drawing.SolidBrush $flesh), 124, 56)

  $g.DrawString($kicker, (New-Object System.Drawing.Font 'Consolas', 20), (New-Object System.Drawing.SolidBrush $stem), 72, 214)
  $titleRect = New-Object System.Drawing.RectangleF 68, 256, 680, 160
  $g.DrawString($title, (New-Object System.Drawing.Font 'Georgia', 42), (New-Object System.Drawing.SolidBrush $flesh), $titleRect)
  $g.FillRectangle((New-Object System.Drawing.SolidBrush $seedHi), 72, 418, 64, 5)
  $g.DrawString($subtitle, (New-Object System.Drawing.Font 'Segoe UI', 22), (New-Object System.Drawing.SolidBrush $inkDim), 72, 440)
  Save-Png $bmp $g $name
}

function New-Icon([string]$name, [int]$size, [bool]$withBackground) {
  $canvas = New-Canvas $size $size; $bmp = $canvas[0]; $g = $canvas[1]
  if ($withBackground) { $g.Clear($night) } else { $g.Clear([System.Drawing.Color]::Transparent) }
  $scale = $size / ($(if ($withBackground) { 34 } else { 25 }))
  Draw-Fig $g ($size / 2) ($size / 2 - 0.75 * $scale) $scale
  Save-Png $bmp $g $name
}

Write-Host 'Generating brand images...'
New-OgImage 'og-hu.png' 'WEBOLDAL KÉSZÍTÉS' "Olcsó, igényes weboldal kisvállalkozásoknak" 'Fix ár · ingyenes látványterv fizetés előtt'
New-OgImage 'og-en.png' 'WEBSITE DESIGN' 'Affordable websites for small businesses' 'Fixed price · free design draft before you pay'
New-Icon 'logo-512.png' 512 $true
New-Icon 'apple-touch-icon.png' 180 $true
New-Icon 'favicon-48.png' 48 $false
Write-Host 'Done. Rebuild with: npm run build'
