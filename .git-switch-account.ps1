# Script helper para alternar entre contas Git
# Uso: .\.git-switch-account.ps1 personal|work

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("personal", "work")]
    [string]$Account
)

$repoPath = Get-Location

if ($Account -eq "personal") {
    Write-Host "Configurando conta PESSOAL (fernandopicardi@gmail.com) para este repositório..." -ForegroundColor Green
    git config user.name "fernandopicardi"
    git config user.email "fernandopicardi@gmail.com"
} else {
    Write-Host "Configurando conta de TRABALHO (fernando@yangflow.us) para este repositório..." -ForegroundColor Cyan
    git config user.name "Fernando Picardi"
    git config user.email "fernando@yangflow.us"
}

Write-Host "`nConfiguração atual:" -ForegroundColor Yellow
Write-Host "  Nome: $(git config user.name)" -ForegroundColor White
Write-Host "  Email: $(git config user.email)" -ForegroundColor White
Write-Host "`n✓ Configuração aplicada com sucesso!" -ForegroundColor Green

