# Superforge Skill Suite — Windows PowerShell Installer
# Idempotent installation script for Windows environments.
#
# Usage:
#   .\install.ps1             # Install into all detected AI tool directories
#   .\install.ps1 -DryRun      # Preview changes without modifying filesystem
#   .\install.ps1 -Uninstall   # Remove installed symlinks

param (
    [switch]$DryRun = $false,
    [switch]$Uninstall = $false
)

$ErrorActionPreference = "Stop"
$RepoDir = Split-Path -Parent $MyInvocation.MyCommand.Path

$Targets = @(
    "$env:USERPROFILE\.claude\skills",
    "$env:USERPROFILE\.agents\skills",
    "$env:USERPROFILE\.codex\skills",
    "$env:USERPROFILE\.gemini\skills",
    "$env:USERPROFILE\.gemini\antigravity-ide\skills",
    "$env:USERPROFILE\.gemini\config\skills"
)

$SkillsDir = Join-Path $RepoDir "skills"
$Skills = Get-ChildItem -Path $SkillsDir -Directory

function Create-Symlink {
    param (
        [string]$Source,
        [string]$Target
    )

    if (Test-Path $Target) {
        $item = Get-Item $Target
        if ($item.Attributes.HasFlag([System.IO.FileAttributes]::ReparsePoint)) {
            if ($DryRun) {
                Write-Host "  would replace $Target -> $Source" -ForegroundColor Yellow
            } else {
                Remove-Item $Target -Force -Recurse
                New-Item -ItemType SymbolicLink -Path $Target -Value $Source | Out-Null
                Write-Host "  link  $Target -> $Source" -ForegroundColor Green
            }
        } else {
            Write-Host "  skip  $Target (real directory, remove manually)" -ForegroundColor DarkYellow
        }
    } else {
        if ($DryRun) {
            Write-Host "  would link $Target -> $Source" -ForegroundColor Yellow
        } else {
            New-Item -ItemType SymbolicLink -Path $Target -Value $Source | Out-Null
            Write-Host "  link  $Target -> $Source" -ForegroundColor Green
        }
    }
}

function Remove-Symlink {
    param ([string]$Target)
    if (Test-Path $Target) {
        if ($DryRun) {
            Write-Host "  would remove $Target" -ForegroundColor Yellow
        } else {
            Remove-Item $Target -Force -Recurse
            Write-Host "  rm    $Target" -ForegroundColor Red
        }
    }
}

foreach ($targetDir in $Targets) {
    if (-not (Test-Path $targetDir)) {
        if (-not $Uninstall) {
            if (-not $DryRun) {
                New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
            }
        } else {
            continue
        }
    }

    Write-Host "`nTarget: $targetDir" -ForegroundColor Cyan

    foreach ($skill in $Skills) {
        $destPath = Join-Path $targetDir $skill.Name
        if ($Uninstall) {
            Remove-Symlink -Target $destPath
        } else {
            Create-Symlink -Source $skill.FullName -Target $destPath
        }
    }
}

Write-Host ""
if ($Uninstall) {
    Write-Host "Uninstalled Superforge skills." -ForegroundColor Yellow
} else {
    Write-Host "Done. Restart your AI tool to pick up the new skills." -ForegroundColor Green
}
