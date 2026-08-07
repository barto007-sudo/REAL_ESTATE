vuelve#!/usr/bin/env pwsh
# Script de instalación para Real Estate Auction & Rental Management System

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Real Estate System - Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node -v
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Node.js $nodeVersion instalado" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js no está instalado" -ForegroundColor Red
    exit 1
}

# Verificar PostgreSQL
Write-Host "Verificando PostgreSQL..." -ForegroundColor Yellow
try {
    $psqlVersion = psql --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ PostgreSQL instalado" -ForegroundColor Green
    } else {
        Write-Host "⚠ PostgreSQL no encontrado. Asegúrate de instalarlo." -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠ PostgreSQL no encontrado. Asegúrate de instalarlo." -ForegroundColor Yellow
}

Write-Host ""

# Instalar dependencias del backend
Write-Host "Instalando dependencias del backend..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Error al instalar dependencias del backend" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Backend instalado" -ForegroundColor Green

# Crear .env del backend si no existe
if (-not (Test-Path .env)) {
    Write-Host "Creando archivo .env de backend..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "⚠ Por favor, edita backend/.env con tu configuración de PostgreSQL" -ForegroundColor Yellow
}

Set-Location ..

# Instalar dependencias del frontend
Write-Host "Instalando dependencias del frontend..." -ForegroundColor Yellow
Set-Location frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Error al instalar dependencias del frontend" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Frontend instalado" -ForegroundColor Green

# Crear .env.local del frontend si no existe
if (-not (Test-Path .env.local)) {
    Write-Host "Creando archivo .env.local de frontend..." -ForegroundColor Yellow
    Copy-Item .env.example .env.local
}

Set-Location ..

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✓ Instalación completada" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. Edita backend/.env con tus variables de PostgreSQL"
Write-Host "2. Abre 2 terminales:"
Write-Host "   Terminal 1: cd backend && npm run dev"
Write-Host "   Terminal 2: cd frontend && npm start"
Write-Host ""
Write-Host "Para más información, consulta QUICKSTART.md" -ForegroundColor Cyan
