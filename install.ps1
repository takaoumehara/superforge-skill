# Superforge Skill Suite — Windows PowerShell Installer
# Idempotent installation script for Windows environments.
#
# Usage:
#   .\install.ps1             # Install into all detected AI tool directories
#   .\install.ps1 -Update      # git pull, then re-install (skills are symlinks,
#                              # so the pull alone updates them; workflows are copies)
#   .\install.ps1 -DryRun      # Preview changes without modifying filesystem
#   .\install.ps1 -Uninstall   # Remove installed symlinks

param (
    [switch]$DryRun = $false,
    [switch]$Uninstall = $false,
    [switch]$Update = $false
)

$ErrorActionPreference = "Stop"
$RepoDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Skills are symlinked, so `git pull` updates every installed copy at once.
# Workflows are copied (see Install-Workflows) and need this script re-run.
if ($Update -and -not $Uninstall) {
    Write-Host "Updating $RepoDir" -ForegroundColor Cyan
    if ($DryRun) {
        Write-Host "  would run: git -C `"$RepoDir`" pull --ff-only" -ForegroundColor Yellow
    } else {
        git -C $RepoDir pull --ff-only
    }
    Write-Host ""
}

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

# This repo's former name, pointed at the router so existing
# `model-aware-superpowers` references in CLAUDE.md / AGENTS.md keep resolving.
# Must stay in step with LEGACY_ALIAS in install.sh — a user with one machine of
# each OS and one CLAUDE.md gets a silent non-resolution otherwise.
$LegacyAlias = "model-aware-superpowers"
$RouterPath = Join-Path $SkillsDir "superforge"

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

    if ($LegacyAlias) {
        $aliasPath = Join-Path $targetDir $LegacyAlias
        if ($Uninstall) {
            Remove-Symlink -Target $aliasPath
        } else {
            Create-Symlink -Source $RouterPath -Target $aliasPath
        }
    }

    foreach ($skill in $Skills) {
        $destPath = Join-Path $targetDir $skill.Name
        if ($Uninstall) {
            Remove-Symlink -Target $destPath
        } else {
            Create-Symlink -Source $skill.FullName -Target $destPath
        }
    }
}

# Dynamic workflows are a Claude Code feature (v2.1.154+); the other tools have
# no equivalent, so this step is Claude-Code-only and every skill degrades to the
# prose loop without it. See skills/superforge-dev/references/workflow-graphs.md §7.
#
# COPIED rather than symlinked: Claude Code will not load a workflow through a
# symlink. Re-run with -Update after a git pull to refresh them.
function Install-Workflows {
    $sourceDir = Join-Path $RepoDir "workflows"
    if (-not (Test-Path $sourceDir)) { return }

    $configDir = if ($env:CLAUDE_CONFIG_DIR) { $env:CLAUDE_CONFIG_DIR } else { "$env:USERPROFILE\.claude" }
    $workflowDir = Join-Path $configDir "workflows"

    # Same guard the target loop uses: install nothing where the tool is absent.
    if ((-not $Uninstall) -and (-not (Test-Path $configDir))) {
        Write-Host "`nSkipping $workflowDir (Claude Code not present - workflows are Claude-Code-only)" -ForegroundColor DarkYellow
        return
    }

    if ($Uninstall) {
        if (-not (Test-Path $workflowDir)) { return }
        Write-Host "`nTarget: $workflowDir" -ForegroundColor Cyan
        foreach ($src in Get-ChildItem -Path $sourceDir -Filter *.js) {
            $dest = Join-Path $workflowDir $src.Name
            if (Test-Path $dest) {
                if ($DryRun) {
                    Write-Host "  would remove $dest" -ForegroundColor Yellow
                } else {
                    Remove-Item $dest -Force
                    Write-Host "  rm    $dest" -ForegroundColor Red
                }
            }
        }
        return
    }

    Write-Host "`nTarget: $workflowDir" -ForegroundColor Cyan
    if (-not (Test-Path $workflowDir)) {
        if ($DryRun) {
            Write-Host "  would create $workflowDir" -ForegroundColor Yellow
        } else {
            New-Item -ItemType Directory -Path $workflowDir -Force | Out-Null
        }
    }
    foreach ($src in Get-ChildItem -Path $sourceDir -Filter *.js) {
        $dest = Join-Path $workflowDir $src.Name
        if ($DryRun) {
            Write-Host "  would copy $dest" -ForegroundColor Yellow
        } else {
            Copy-Item $src.FullName -Destination $dest -Force
            Write-Host "  copy  $dest" -ForegroundColor Green
        }
    }
}

Install-Workflows

Write-Host ""
if ($Uninstall) {
    Write-Host "Uninstalled Superforge skills." -ForegroundColor Yellow
} else {
    Write-Host "Done. Restart your AI tool to pick up the new skills." -ForegroundColor Green
    Write-Host ""
    Write-Host "Skills are symlinks into this repo, so ``git pull`` updates them everywhere."
    Write-Host "Workflows are copies — re-run ``.\install.ps1 -Update`` to refresh those too."
    Write-Host "What each skill's external claims were checked against, and when: SOURCES.md"
}
