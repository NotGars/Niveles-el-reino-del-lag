# 📦 Guía de Deployment - Discord Level Bot

## ⚠️ IMPORTANTE: Este bot NO puede ejecutarse en Replit

Este es un **bot de Discord** que requiere estar conectado 24/7 a los servidores de Discord mediante WebSocket. Replit no es la plataforma adecuada para alojar bots de Discord debido a:

1. Replit está diseñado para aplicaciones web, no para bots persistentes
2. Los bots de Discord necesitan conexión constante, no intermitente
3. Replit puede suspender procesos inactivos

## ✅ Plataformas Recomendadas

### 1. **Render** (Recomendado - GRATIS)

**Ventajas:**
- ✅ Tier gratuito disponible
- ✅ PostgreSQL incluido gratis
- ✅ Deploy automático desde GitHub
- ✅ Fácil configuración

**Pasos:**
Ver `README.md` para instrucciones completas paso a paso.

### 2. **Railway**

**Ventajas:**
- ✅ $5 de crédito gratis mensual
- ✅ PostgreSQL incluido
- ✅ Deploy desde GitHub

**Pasos:**
1. Conecta tu repo de GitHub
2. Añade PostgreSQL addon
3. Configura variables de entorno
4. Deploy automático

### 3. **Heroku**

**Ventajas:**
- ✅ Plataforma establecida
- ⚠️ Ya no tiene tier gratuito

**Pasos:**
1. Instala Heroku CLI
2. `heroku create`
3. Añade PostgreSQL: `heroku addons:create heroku-postgresql`
4. Configura variables: `heroku config:set DISCORD_TOKEN=...`
5. Deploy: `git push heroku main`

### 4. **VPS (DigitalOcean, Linode, etc.)**

**Ventajas:**
- ✅ Control total
- ✅ Múltiples bots en un servidor

**Requisitos:**
- Node.js 18+
- PostgreSQL
- PM2 para mantener el bot corriendo

**Pasos:**
```bash
# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Clonar repo
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo

# Instalar dependencias
npm install

# Configurar .env
nano .env
# Pega: DISCORD_TOKEN=..., CLIENT_ID=..., DATABASE_URL=...

# Instalar PM2
npm install -g pm2

# Iniciar bot
pm2 start src/index.js --name discord-bot
pm2 save
pm2 startup
```

## 🔑 Variables de Entorno Necesarias

```env
DISCORD_TOKEN=tu_token_de_discord
CLIENT_ID=tu_application_id
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=production
```

## 📋 Checklist Antes de Deploy

- [ ] Código subido a GitHub
- [ ] Token de Discord obtenido
- [ ] Bot añadido al servidor de Discord
- [ ] Base de datos PostgreSQL creada
- [ ] Variables de entorno configuradas
- [ ] Permisos del bot verificados (Administrator o específicos)
- [ ] Intents activados en Discord Developer Portal

## 🔍 Verificación Post-Deploy

1. **Revisa los logs** - Debe decir "Bot conectado como..."
2. **Prueba `/help`** en Discord
3. **Envía mensajes** para ganar XP
4. **Verifica `/level`** para ver si la tarjeta se genera
5. **Prueba un mini-juego** como `/minijuego trivia`

## 🐛 Solución de Problemas Comunes

### Bot no se conecta
- ✅ Verifica que DISCORD_TOKEN sea correcto
- ✅ Revisa que los Intents estén activados

### Comandos no aparecen
- ⏰ Espera 5-10 minutos (Discord tarda en registrarlos)
- ✅ Verifica que CLIENT_ID sea correcto

### Error de base de datos
- ✅ Verifica DATABASE_URL
- ✅ Asegúrate de usar la Internal URL (no Externa) en Render

### Tarjetas no se generan
- ✅ Verifica que Canvas se instaló correctamente
- ✅ En algunos entornos necesitas: `apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev`

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs de tu plataforma
2. Verifica que todas las variables estén configuradas
3. Confirma que el bot tenga todos los permisos necesarios

---

**Recuerda:** Este bot está optimizado para Render con deploy desde GitHub. Ver `README.md` para la guía completa paso a paso.
