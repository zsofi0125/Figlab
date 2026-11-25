# Generates the raster brand images into src/static/assets/img:
#   og-hu.png, og-en.png (1200x630 social share), logo-512.png (JSON-LD logo),
#   apple-touch-icon.png (180x180), favicon-48.png, favicon-32.png.
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

# Keep in sync with brandName in src/config/site.js and the colours in src/styles/tokens.css.
$brand = 'Studio Name'
$bg = New-Color '#f6f1ea'; $text = New-Color '#3e0911'; $muted = New-Color '#6b4448'
$accent = New-Color '#85383e'; $olive = New-Color '#5c6139'; $dusty = New-Color '#c39583'

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

# Light card: name with the accent dot, a small label, the headline, an accent rule and a subtitle.
function New-OgImage([string]$name, [string]$kicker, [string]$title, [string]$subtitle) {
  $canvas = New-Canvas 1200 630; $bmp = $canvas[0]; $g = $canvas[1]
  $g.Clear($bg)
  $g.FillEllipse((New-Object System.Drawing.SolidBrush $accent), 72, 76, 14, 14)
  $g.DrawString($brand, (New-Object System.Drawing.Font 'Segoe UI', 26), (New-Object System.Drawing.SolidBrush $text), 96, 60)
  $g.DrawString($kicker, (New-Object System.Drawing.Font 'Segoe UI Semibold', 18), (New-Object System.Drawing.SolidBrush $olive), 72, 214)
  $titleRect = New-Object System.Drawing.RectangleF 68, 252, 980, 170
  $g.DrawString($title, (New-Object System.Drawing.Font 'Segoe UI', 46), (New-Object System.Drawing.SolidBrush $text), $titleRect)
  $g.FillRectangle((New-Object System.Drawing.SolidBrush $accent), 72, 438, 64, 5)
  $g.DrawString($subtitle, (New-Object System.Drawing.Font 'Segoe UI', 22), (New-Object System.Drawing.SolidBrush $muted), 72, 462)
  Save-Png $bmp $g $name
}

# Dusty-pink dot on dark burgundy: readable on light and dark browser tabs.
function New-Icon([string]$name, [int]$size) {
  $canvas = New-Canvas $size $size; $bmp = $canvas[0]; $g = $canvas[1]
  $g.Clear($text)
  $d = [int]($size * 0.36); $o = [int](($size - $d) / 2)
  $g.FillEllipse((New-Object System.Drawing.SolidBrush $dusty), $o, $o, $d, $d)
  Save-Png $bmp $g $name
}

Write-Host 'Generating brand images...'
New-OgImage 'og-hu.png' 'WEBOLDAL KÉSZÍTÉS' "Olcsó, igényes weboldal kisvállalkozásoknak" 'Fix ár · ingyenes látványterv fizetés előtt'
New-OgImage 'og-en.png' 'WEBSITE DESIGN' 'Affordable websites for small businesses' 'Fixed price · free design draft before you pay'
New-Icon 'logo-512.png' 512
New-Icon 'apple-touch-icon.png' 180
New-Icon 'favicon-48.png' 48
New-Icon 'favicon-32.png' 32
Write-Host 'Done. Rebuild with: npm run build'
