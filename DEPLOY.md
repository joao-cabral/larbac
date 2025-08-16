# 🚀 Deploy Automático para VPS

Este projeto está configurado para fazer deploy automático na VPS sempre que uma nova tag for criada no GitHub.

## 📋 Pré-requisitos

### 1. Configuração da VPS

Certifique-se de que sua VPS tenha:
- **Node.js 18+** instalado
- **Git** configurado
- **Nginx** rodando
- **SSH** habilitado
- Repositório clonado em `/var/www/html`

### 2. Configuração dos GitHub Secrets

Vá em **Settings > Secrets and variables > Actions** no seu repositório GitHub e adicione:

```
VPS_HOST=seu-ip-da-vps
VPS_USERNAME=seu-usuario-ssh
VPS_SSH_KEY=sua-chave-privada-ssh
VPS_PORT=22 (opcional, padrão é 22)
```

#### Como obter a chave SSH:

```bash
# No seu computador local, gere uma chave SSH (se não tiver)
ssh-keygen -t rsa -b 4096 -C "deploy@github"

# Copie a chave pública para a VPS
ssh-copy-id -i ~/.ssh/id_rsa.pub usuario@ip-da-vps

# Copie o conteúdo da chave privada para o GitHub Secret
cat ~/.ssh/id_rsa
```

### 3. Preparação da VPS

```bash
# Conectar na VPS
ssh usuario@ip-da-vps

# Clonar o repositório (se ainda não fez)
sudo git clone https://github.com/seu-usuario/larbac.git /var/www/html
cd /var/www/html

# Configurar permissões
sudo chown -R $USER:$USER /var/www/html
sudo chmod -R 755 /var/www/html

# Instalar dependências
npm install
```

## 🏷️ Como Fazer Deploy

### Método 1: Via GitHub Interface

1. Vá para **Releases** no seu repositório
2. Clique em **Create a new release**
3. Crie uma nova tag (ex: `v1.0.0`)
4. Adicione título e descrição
5. Clique em **Publish release**

### Método 2: Via Command Line

```bash
# Fazer commit das mudanças
git add .
git commit -m "feat: nova versão do portfólio"
git push origin main

# Criar e enviar tag
git tag v1.0.0
git push origin v1.0.0
```

### Método 3: Script Automatizado

Crie um arquivo `release.sh`:

```bash
#!/bin/bash

# Verificar se foi passada uma versão
if [ -z "$1" ]; then
  echo "Uso: ./release.sh v1.0.0"
  exit 1
fi

VERSION=$1

# Fazer commit e push
git add .
git commit -m "release: $VERSION"
git push origin main

# Criar e enviar tag
git tag $VERSION
git push origin $VERSION

echo "✅ Release $VERSION criada! Deploy será iniciado automaticamente."
```

```bash
# Tornar executável e usar
chmod +x release.sh
./release.sh v1.0.0
```

## 📊 Monitoramento

### Acompanhar o Deploy

1. Vá para **Actions** no GitHub
2. Clique no workflow "Deploy to VPS on Tag"
3. Acompanhe os logs em tempo real

### Verificar na VPS

```bash
# Conectar na VPS
ssh usuario@ip-da-vps

# Verificar logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Verificar se o site está funcionando
curl -I http://seu-dominio.com
```

## 🔧 Troubleshooting

### Problemas Comuns

**1. Erro de permissão SSH:**
```bash
# Na VPS, verificar permissões
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

**2. Erro de build:**
```bash
# Verificar se Node.js está atualizado na VPS
node --version
npm --version
```

**3. Nginx não recarrega:**
```bash
# Verificar configuração do Nginx
sudo nginx -t
sudo systemctl status nginx
```

### Rollback Manual

```bash
# Na VPS, voltar para backup anterior
cd /var/www
sudo rm -rf html
sudo mv backup-YYYYMMDD-HHMMSS html
sudo systemctl reload nginx
```

## 🎯 Fluxo Completo

1. **Desenvolvimento** → Fazer mudanças no código
2. **Commit** → `git commit -m "sua mensagem"`
3. **Push** → `git push origin main`
4. **Tag** → `git tag v1.0.0 && git push origin v1.0.0`
5. **Deploy Automático** → GitHub Actions faz o deploy
6. **Verificação** → Site atualizado em `https://seu-dominio.com`

## 📝 Versionamento

Use versionamento semântico:
- `v1.0.0` - Versão principal
- `v1.1.0` - Nova funcionalidade
- `v1.1.1` - Correção de bug
- `release-hotfix` - Deploy de emergência

---

**🎉 Pronto! Agora seu portfólio será deployado automaticamente sempre que você criar uma nova tag!**