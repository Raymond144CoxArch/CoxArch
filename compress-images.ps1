# Image Compression Script for Cox Architecture Website
# This script compresses images to reduce file size while maintaining quality

param(
    [string]$ImageMagickPath = "C:\Program Files\ImageMagick-7.1.2-Q16-HDRI\magick.exe",
    [string]$ImagesPath = "images",
    [int]$Quality = 85,
    [int]$MaxWidth = 1920,
    [int]$MaxHeight = 1080,
    [switch]$Backup = $true,
    [switch]$DryRun = $false
)

Write-Host "Cox Architecture Image Compression Tool" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# Check if ImageMagick exists
if (-not (Test-Path $ImageMagickPath)) {
    Write-Host "ERROR: ImageMagick not found at: $ImageMagickPath" -ForegroundColor Red
    Write-Host "Please install ImageMagick or update the path in this script." -ForegroundColor Yellow
    exit 1
}

# Check if images directory exists
if (-not (Test-Path $ImagesPath)) {
    Write-Host "ERROR: Images directory not found: $ImagesPath" -ForegroundColor Red
    exit 1
}

# Create backup directory if requested
$BackupPath = "images_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
if ($Backup -and -not $DryRun) {
    Write-Host "Creating backup in: $BackupPath" -ForegroundColor Yellow
    Copy-Item -Path $ImagesPath -Destination $BackupPath -Recurse
}

# Get all image files
$ImageExtensions = @("*.jpg", "*.jpeg", "*.png", "*.webp")
$ImageFiles = @()
foreach ($ext in $ImageExtensions) {
    $ImageFiles += Get-ChildItem -Path $ImagesPath -Recurse -Include $ext
}

Write-Host "Found $($ImageFiles.Count) images to process" -ForegroundColor Green
Write-Host "Settings: Quality=$Quality%, Max Size=${MaxWidth}x${MaxHeight}" -ForegroundColor Green

if ($DryRun) {
    Write-Host "DRY RUN MODE - No files will be modified" -ForegroundColor Yellow
}

# Initialize counters
$ProcessedCount = 0
$TotalOriginalSize = 0
$TotalNewSize = 0
$SkippedCount = 0

foreach ($file in $ImageFiles) {
    $ProcessedCount++
    $ProgressPercent = [math]::Round(($ProcessedCount / $ImageFiles.Count) * 100, 1)
    
    Write-Progress -Activity "Compressing Images" -Status "Processing $($file.Name)" -PercentComplete $ProgressPercent
    
    $OriginalSize = $file.Length
    $TotalOriginalSize += $OriginalSize
    
    # Skip if file is already small (less than 100KB)
    if ($OriginalSize -lt 100KB) {
        $SizeKB = [math]::Round($OriginalSize/1KB,1)
        Write-Host "Skipping $($file.Name) - already small ($SizeKB KB)" -ForegroundColor Gray
        $SkippedCount++
        $TotalNewSize += $OriginalSize
        continue
    }
    
    if ($DryRun) {
        $SizeMB = [math]::Round($OriginalSize/1MB,2)
        Write-Host "Would compress: $($file.FullName) ($SizeMB MB)" -ForegroundColor Cyan
        $TotalNewSize += $OriginalSize * 0.7  # Estimate 30% reduction
        continue
    }
    
    try {
        # Create temporary file for processing
        $TempFile = [System.IO.Path]::GetTempFileName()
        $TempFile = $TempFile -replace '\.tmp$', '.jpg'
        
        # Compress the image
        $Arguments = @(
            "`"$($file.FullName)`"",
            "-resize", "${MaxWidth}x${MaxHeight}>",
            "-quality", $Quality,
            "-strip",
            "-interlace", "JPEG",
            "`"$TempFile`""
        )
        
        $Process = Start-Process -FilePath $ImageMagickPath -ArgumentList $Arguments -Wait -PassThru -WindowStyle Hidden
        
        if ($Process.ExitCode -eq 0 -and (Test-Path $TempFile)) {
            $NewSize = (Get-Item $TempFile).Length
            
            # Only replace if new file is smaller
            if ($NewSize -lt $OriginalSize) {
                Move-Item -Path $TempFile -Destination $file.FullName -Force
                $TotalNewSize += $NewSize
                $Savings = [math]::Round((($OriginalSize - $NewSize) / $OriginalSize) * 100, 1)
                $OriginalMB = [math]::Round($OriginalSize/1MB,2)
                $NewMB = [math]::Round($NewSize/1MB,2)
                Write-Host "SUCCESS: $($file.Name): $OriginalMB MB -> $NewMB MB (-$Savings%)" -ForegroundColor Green
            } else {
                Remove-Item $TempFile
                $TotalNewSize += $OriginalSize
                Write-Host "SKIP: $($file.Name): No compression benefit, keeping original" -ForegroundColor Yellow
            }
        } else {
            Remove-Item $TempFile -ErrorAction SilentlyContinue
            $TotalNewSize += $OriginalSize
            Write-Host "FAILED: $($file.Name)" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "ERROR processing $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
        $TotalNewSize += $OriginalSize
    }
}

Write-Progress -Activity "Compressing Images" -Completed

# Calculate and display results
$TotalSavings = $TotalOriginalSize - $TotalNewSize
$SavingsPercent = [math]::Round(($TotalSavings / $TotalOriginalSize) * 100, 1)
$OriginalSizeMB = [math]::Round($TotalOriginalSize / 1MB, 2)
$NewSizeMB = [math]::Round($TotalNewSize / 1MB, 2)
$SavingsMB = [math]::Round($TotalSavings / 1MB, 2)

Write-Host ""
Write-Host "COMPRESSION RESULTS" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
Write-Host "Images processed: $($ProcessedCount - $SkippedCount)" -ForegroundColor White
Write-Host "Images skipped: $SkippedCount" -ForegroundColor White
Write-Host "Original size: $OriginalSizeMB MB" -ForegroundColor White
Write-Host "New size: $NewSizeMB MB" -ForegroundColor White
Write-Host "Space saved: $SavingsMB MB ($SavingsPercent%)" -ForegroundColor Green

if ($Backup -and -not $DryRun) {
    Write-Host "Backup created at: $BackupPath" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Image compression complete!" -ForegroundColor Green