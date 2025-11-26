# 🔄 Configuração de Múltiplas Contas Git

Este projeto está configurado para usar automaticamente a conta **pessoal** (`fernandopicardi@gmail.com`) porque está em `E:/WORK/coding/Projetos/`.

## 📋 Contas Configuradas

### Conta Pessoal (Padrão para este projeto)
- **Nome:** fernandopicardi
- **Email:** fernandopicardi@gmail.com
- **Usada em:** `E:/WORK/coding/Projetos/`

### Conta de Trabalho
- **Nome:** Fernando Picardi
- **Email:** fernando@yangflow.us
- **Usada em:** Projetos de trabalho (configurar caminho no `.gitconfig`)

## 🚀 Como Funciona

O Git está configurado com **configuração condicional** baseada no diretório:

1. **Projetos em `E:/WORK/coding/Projetos/`** → Usam automaticamente conta pessoal
2. **Outros projetos** → Usam a configuração padrão ou podem ser configurados manualmente

## 🔧 Alternar Conta Manualmente (se necessário)

### Opção 1: Usar o Script Helper
```powershell
# Usar conta pessoal
.\.git-switch-account.ps1 personal

# Usar conta de trabalho
.\.git-switch-account.ps1 work
```

### Opção 2: Comandos Git Diretos
```bash
# Conta pessoal
git config user.name "fernandopicardi"
git config user.email "fernandopicardi@gmail.com"

# Conta de trabalho
git config user.name "Fernando Picardi"
git config user.email "fernando@yangflow.us"
```

### Verificar configuração atual
```bash
git config user.name
git config user.email
```

## 📁 Configurar Projetos de Trabalho

Para que projetos de trabalho usem automaticamente a conta `fernando@yangflow.us`, edite o arquivo `C:\Users\soulu\.gitconfig` e descomente/ajuste:

```gitconfig
[includeIf "gitdir/i:E:/WORK/yangflow/"]
	path = ~/.gitconfig-work
```

Substitua `E:/WORK/yangflow/` pelo caminho real onde ficam seus projetos de trabalho.

## 🔐 Gerenciamento de Credenciais

### Limpar credenciais salvas (se tiver problemas)
```powershell
# Abrir Credential Manager
control /name Microsoft.CredentialManager

# Ou via linha de comando
cmdkey /list
cmdkey /delete:git:https://github.com
```

### Usar SSH (Recomendado)
Este projeto já está configurado para usar SSH (`git@github.com`). Certifique-se de ter as chaves SSH configuradas:

```bash
# Verificar chaves SSH
ssh-add -l

# Adicionar chave SSH (se necessário)
ssh-add ~/.ssh/id_ed25519_fernandopicardi
```

## ✅ Verificação Rápida

```bash
# Ver todas as configurações do repositório
git config --list --local

# Ver configurações globais
git config --list --global
```

## 🆘 Troubleshooting

### Problema: Push falha com erro 403
1. Verifique qual conta está configurada: `git config user.email`
2. Limpe credenciais: `cmdkey /delete:git:https://github.com`
3. Tente push novamente

### Problema: Commits com conta errada
1. Verifique: `git config user.email`
2. Configure manualmente se necessário
3. Para corrigir último commit: `git commit --amend --author="Nome <email>"`

