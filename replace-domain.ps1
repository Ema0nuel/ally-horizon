[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$From,

    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$To,

    [string]$Root = (Get-Location).Path,

    [switch]$Apply
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$rootPath = (Resolve-Path -LiteralPath $Root).Path.TrimEnd([char[]]@("\", "/"))
$excludedDirectories = "(^|/)(node_modules|\.next|\.git|out|build|coverage)(/|$)"
$protectedPaths = @("docs/google-review-request.md")
$textExtensions = @(
    ".css", ".csv", ".html", ".js", ".jsx", ".json", ".md", ".mdx",
    ".mjs", ".cjs", ".ps1", ".scss", ".sh", ".sql", ".svg", ".toml",
    ".ts", ".tsx", ".txt", ".xml", ".yaml", ".yml"
)
$textNames = @(".editorconfig", ".env", ".gitignore", ".npmrc")
$pattern = [regex]::new(
    [regex]::Escape($From),
    [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
)
$utf8WithoutBom = [System.Text.UTF8Encoding]::new($false)
$changedFiles = 0
$replacementCount = 0

Get-ChildItem -LiteralPath $rootPath -Recurse -File -Force | ForEach-Object {
    $file = $_
    $relativePath = $file.FullName.Substring($rootPath.Length)
        .TrimStart([char[]]@("\", "/"))
        .Replace("\", "/")

    if ($relativePath -match $excludedDirectories) {
        return
    }

    if ($protectedPaths -contains $relativePath.ToLowerInvariant()) {
        return
    }

    $extension = $file.Extension.ToLowerInvariant()
    $isEnvironmentFile =
        $file.Name.Equals(".env", [System.StringComparison]::OrdinalIgnoreCase) -or
        $file.Name.StartsWith(".env.", [System.StringComparison]::OrdinalIgnoreCase)

    if (($textExtensions -notcontains $extension) -and
        ($textNames -notcontains $file.Name.ToLowerInvariant()) -and
        -not $isEnvironmentFile) {
        return
    }

    $content = [System.IO.File]::ReadAllText($file.FullName)
    $matches = $pattern.Matches($content)

    if ($matches.Count -eq 0) {
        return
    }

    $changedFiles++
    $replacementCount += $matches.Count
    $label = if ($matches.Count -eq 1) { "occurrence" } else { "occurrences" }

    if (-not $Apply) {
        Write-Host "Would update $relativePath ($($matches.Count) $label)"
        return
    }

    if ($PSCmdlet.ShouldProcess($relativePath, "Replace $From with $To")) {
        $updated = $pattern.Replace($content, $To)
        [System.IO.File]::WriteAllText($file.FullName, $updated, $utf8WithoutBom)
        Write-Host "Updated $relativePath ($($matches.Count) $label)"
    }
}

if ($Apply) {
    Write-Host "Updated $changedFiles files with $replacementCount replacements."
} else {
    Write-Host "Preview complete. $changedFiles files contain $replacementCount replacements."
    Write-Host "Run the same command with -Apply to write the changes."
}
