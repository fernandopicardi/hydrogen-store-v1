# 🔐 Guia de Configuração SSH para Múltiplas Contas

## ✅ Status Atual

**SSH configurado e funcionando!** O push foi realizado com sucesso usando a conta pessoal.

## 📋 Configuração SSH

### Hosts Configurados

1. **`github.com`** (padrão) → Usa chave pessoal (`id_ed25519_personal`)
   - Para projetos em `E:/WORK/coding/Projetos/`
   - Conta: `fernandopicardi@gmail.com`

2. **`github-personal`** (alias) → Mesma chave pessoal
   - Use se quiser ser explícito: `git@github-personal:usuario/repo.git`

3. **`github-work`** → Usa chave de trabalho (`id_ed25519_work`)
   - Para projetos de trabalho
   - Conta: `fernando@yangflow.us`

## 🚀 Como Usar em Projetos de Trabalho

### Opção 1: Alterar Remote para usar github-work

```bash
# No diretório do projeto de trabalho
git remote set-url origin git@github-work:yangflow/repositorio.git
```

### Opção 2: Manter github.com e mudar SSH config dinamicamente

Se você quiser que projetos em um diretório específico usem automaticamente a conta de trabalho, edite `C:\Users\soulu\.ssh\config` e adicione:

```ssh
# Adicione ANTES da entrada github.com padrão
Host github.com
    HostName github.com
    User git
    # Use Match para aplicar condicionalmente
    Match Host github.com exec "powershell -Command \"if ((Get-Location).Path -like '*yangflow*') { exit 0 } else { exit 1 }\""
        IdentityFile ~/.ssh/id_ed25519_work
    Match Host github.com
        IdentityFile ~/.ssh/id_ed25519_personal
```

**Nota:** A solução mais simples é usar `github-work` explicitamente nos remotes de projetos de trabalho.

## 🔧 Comandos Úteis

### Verificar autenticação SSH
```bash
# Conta pessoal (padrão)
ssh -T git@github.com

# Conta de trabalho
ssh -T git@github-work
```

### Ver chaves SSH carregadas
```bash
ssh-add -l
```

### Adicionar chave manualmente
```powershell
# Chave pessoal
ssh-add $env:USERPROFILE\.ssh\id_ed25519_personal

# Chave de trabalho
ssh-add $env:USERPROFILE\.ssh\id_ed25519_work
```

### Verificar remote atual
```bash
git remote -v
```

### Alterar remote para conta de trabalho
```bash
git remote set-url origin git@github-work:usuario/repositorio.git
```

### Alterar remote para conta pessoal
```bash
git remote set-url origin git@github.com:usuario/repositorio.git
# ou
git remote set-url origin git@github-personal:usuario/repositorio.git
```

## 🆘 Troubleshooting

### Erro: "Permission denied (publickey)"
1. Verifique se a chave está no ssh-agent: `ssh-add -l`
2. Adicione a chave: `ssh-add ~/.ssh/id_ed25519_personal`
3. Verifique se a chave pública está no GitHub (Settings > SSH and GPG keys)

### Erro: "Could not read from remote repository"
1. Verifique o remote: `git remote -v`
2. Teste a conexão: `ssh -T git@github.com`
3. Verifique se o repositório existe e você tem acesso

### Chave não está sendo usada
1. Verifique o SSH config: `cat ~/.ssh/config`
2. Teste com verbose: `ssh -vT git@github.com`
3. Certifique-se de que `IdentitiesOnly yes` está configurado

## 📝 Resumo

- ✅ **Projetos pessoais** (em `E:/WORK/coding/Projetos/`): Usam `git@github.com` → chave pessoal
- ✅ **Projetos de trabalho**: Use `git@github-work` no remote → chave de trabalho
- ✅ **SSH config** está configurado corretamente
- ✅ **Push funcionando** para conta pessoal

