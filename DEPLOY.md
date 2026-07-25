# Deploy para a VPS

O site e compilado no GitHub Actions e publicado como arquivos estaticos na VPS.
Uma nova versao e enviada sempre que uma tag `v*.*.*` ou `release-*` e criada.

## Infraestrutura

- Aplicacao estatica servida por Nginx em container
- Proxy reverso e SSL gerenciados na VPS
- Dominio principal: `larbac.me`

O Node.js, pnpm e Puppeteer sao usados somente no GitHub Actions. A VPS recebe
apenas o resultado gerado em `dist/`.

## GitHub Secrets

Configure em **Settings > Secrets and variables > Actions**:

```text
VPS_HOST=<endereco da VPS>
VPS_USERNAME=<usuario de deploy>
VPS_PORT=<porta SSH>
VPS_SSH_KEY=<chave privada exclusiva do deploy>
VPS_KNOWN_HOSTS=<chave publica SSH da VPS>
```

## DNS

Antes do primeiro deploy com SSL, configure:

```text
larbac.me      A      <endereco da VPS>
www.larbac.me  CNAME  larbac.me
```

O proxy da VPS emite e renova automaticamente o certificado Let's Encrypt.
Enquanto o dominio estiver em `NXDOMAIN`, a ativacao do SSL falhara.

## Publicar

```bash
git tag v1.0.15
git push origin v1.0.15
```

O deploy mantem as tres releases anteriores para rollback.

## Verificacao

```bash
docker ps --filter name=larbac-web
docker logs --tail 100 larbac-web
curl -I https://larbac.me
```

## Rollback

Na VPS, escolha uma release anterior e altere o link `current` conforme a
estrutura configurada no workflow.

```bash
docker restart larbac-web
```
