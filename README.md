# 🎮 Discord Level Bot

Bot de Discord con sistema de niveles avanzado, mini-juegos interactivos, tarjetas personalizadas y gestión completa de XP.

## ✨ Características

### 🎯 Sistema de Niveles
- Gana XP por mensajes, reacciones, imágenes y videos
- Cooldown de 10 segundos para evitar spam
- Fórmula de progresión que se hace más lenta con cada nivel
- 11 roles diferentes que se otorgan automáticamente por nivel
- Tarjetas de nivel personalizadas con diferentes estilos

### 🎨 Tarjetas Personalizadas
- **Pixel Art** - Usuarios normales
- **Estilo Mar** - Miembros activos (nivel 25+)
- **Estilo Zelda** - Super activos (nivel 35+)
- **Estilo Pokemon** - Nivel 100
- **Geometry Dash** - Boosters del servidor
- **Nocturna** - VIPs
- **Aleatoria** - Usuario especial con estilos rotatorios

### 📊 Leaderboard Personalizado (estilo Arcane bot)
- Barras de progreso de XP para cada usuario
- Gradientes de color: 🥇 Dorado, 🥈 Plateado, 🥉 Bronce
- Avatares grandes con bordes según ranking
- Muestra XP actual / XP requerido para siguiente nivel
- Diseño profesional similar a Arcane bot

### 🎲 Mini-Juegos
1. **Trivia** - 5 preguntas con recompensas (boost 20% x 12h o +1.5 niveles)
2. **Piedra/Papel/Tijera** - Al mejor de 3 (ganador recibe boost 30% x 2h)
3. **Ruleta Rusa** - Sistema de probabilidades realista (ganador +2.5 niveles, perdedor -3 niveles)
4. **Ahorcado Solitario** - 3 rondas consecutivas (boost 25% x 4h o +1 nivel)
5. **Ahorcado Multijugador** - Sistema de anfitrión alternado

### ⚡ Sistema de Boosts
- Boosts de usuario, canal y globales
- Boosts acumulables
- Boost nocturno automático (25%) de 8 PM a 6 AM (horario Venezuela)
- Boosters del servidor y VIPs tienen +200% permanente

### 👥 Comandos de Usuario
- `/level [usuario]` - Muestra nivel con tarjeta personalizada
- `/nivel`, `/rank` - Alias de level
- `/leaderboard` - Top 10 del servidor con imagen
- `/lb` - Alias de leaderboard
- `/rewards list` - Muestra recompensas por nivel
- `/boost list` - Ver boosts activos
- `/boost status` - Ver tu estado de boosts
- `/minijuego trivia/rps/roulette/ahorcado` - Jugar mini-juegos
- `/help` - Ver lista de comandos

### 🛡️ Comandos de Staff
- `/addlevel` - Añadir niveles a usuario
- `/removelevel` - Quitar niveles a usuario
- `/setlevel` - Establecer nivel exacto
- `/xp add/remove/reset` - Gestionar XP
- `/boost add` - Añadir boost a usuario o canal
- `/globalboost add/remove` - Boost para todo el servidor
- `/ban user/channel` - Banear de ganar XP
- `/unban user/channel` - Desbanear
- `/reset temporada` - Resetear todos los niveles
- `/clear levelroles` - Quitar todos los roles de niveles
- `/embed` - Crear embeds personalizados
- `/mensaje` - Enviar mensajes planos
- `/help staff` - Ver comandos de staff

## 🚀 Instalación en Render

### 1. Preparar el Repositorio en GitHub

1. Crea un nuevo repositorio en GitHub
2. Clona este código a tu repositorio:

```bash
git init
git add .
git commit -m "Initial commit: Discord Level Bot"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

### 2. Crear Base de Datos PostgreSQL en Render

1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Click en "New +" → "PostgreSQL"
3. Configura:
   - **Name**: `discord-level-bot-db`
   - **Database**: `levelbot`
   - **User**: (generado automáticamente)
   - **Region**: Elige la más cercana
   - **Plan**: Free
4. Click en "Create Database"
5. **IMPORTANTE**: Copia la **Internal Database URL** (la usarás en el paso 4)

### 3. Obtener Token de Discord

1. Ve a [Discord Developer Portal](https://discord.com/developers/applications)
2. Click en "New Application" y dale un nombre
3. Ve a la sección "Bot" en el menú izquierdo
4. Click en "Add Bot" → "Yes, do it!"
5. En "Privileged Gateway Intents" activa:
   - ✅ Presence Intent
   - ✅ Server Members Intent
   - ✅ Message Content Intent
6. Click en "Reset Token" y copia el token (lo usarás en el paso 4)
7. Copia el **Application ID** (Client ID) desde la pestaña "General Information"

### 4. Invitar el Bot a tu Servidor

1. Ve a "OAuth2" → "URL Generator"
2. Selecciona:
   - **Scopes**: `bot`, `applications.commands`
   - **Bot Permissions**: 
     - Administrator (o permisos específicos: Manage Roles, Send Messages, Embed Links, Attach Files, Read Message History, Add Reactions)
3. Copia la URL generada y ábrela en tu navegador
4. Selecciona tu servidor y autoriza el bot

### 5. Desplegar en Render

1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Click en "New +" → "Web Service"
3. Conecta tu repositorio de GitHub
4. Configura:
   - **Name**: `discord-level-bot`
   - **Region**: Elige la más cercana
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. **Variables de Entorno** (click en "Advanced" → "Add Environment Variable"):
   ```
   DISCORD_TOKEN=tu_token_de_discord_aqui
   CLIENT_ID=tu_application_id_aqui
   DATABASE_URL=tu_internal_database_url_de_render
   NODE_ENV=production
   ```

6. Click en "Create Web Service"

### 6. Verificar el Deploy

1. Espera a que el deploy termine (5-10 minutos)
2. Ve a los logs y verifica que veas:
   ```
   ✅ Bot conectado como TuBot#1234
   ✅ Base de datos inicializada correctamente
   🌙 Night boost scheduler iniciado
   ```
3. Ve a tu servidor de Discord y prueba `/help`

## ⚙️ Configuración

### IDs Configurados Automáticamente

El bot ya viene configurado con estos IDs (ubicados en `src/config/constants.js`):

```javascript
STAFF_ROLE_ID: '1230949715127042098'
BOOSTER_ROLE_ID: '1423037247606882399'
VIP_ROLE_ID: '1423037247606882399'
SPECIAL_USER_ID: '956700088103747625'

NO_XP_CHANNELS: ['1313723272290111559', '1258524941289263254']
LEVEL_UP_CHANNEL: '1243975130908983356'

LEVEL_REWARDS: {
  1: '1313715879816597514',
  5: '1313716079998140536',
  10: '1313716235573264437',
  20: '1313716306599481436',
  25: '1239330751334584421',
  30: '1438675114911596624',
  35: '1313716401021911102',
  40: '1313716612452581437',
  50: '1313716715934453761',
  75: '1313716864790302730',
  100: '1313716964383920269'
}
```

**Para cambiar estos IDs:**
1. Edita el archivo `src/config/constants.js`
2. Haz commit y push a GitHub
3. Render re-desplegará automáticamente

### Fórmula de XP

El bot usa una fórmula progresiva que hace que subir de nivel sea más lento:

- **Niveles 1-5**: MUY RÁPIDO (50 XP × nivel)
- **Niveles 6-9**: MUY RÁPIDO (75 XP × nivel)
- **Niveles 10-14**: RÁPIDO (100 XP × nivel)
- **Niveles 15-19**: MEDIANAMENTE RÁPIDO (150 XP × nivel)
- **Niveles 20-34**: NORMAL (200 XP × nivel)
- **Niveles 35-39**: MEDIANAMENTE NORMAL (300 XP × nivel)
- **Niveles 40-49**: UN POCO LENTA (400 XP × nivel)
- **Niveles 50-74**: MEDIANAMENTE LENTA (550 XP × nivel)
- **Niveles 75-89**: LENTA (750 XP × nivel)
- **Nivel 90+**: MUY LENTA (1000 XP × nivel)

## 📊 Base de Datos

El bot usa PostgreSQL con las siguientes tablas:

- **users** - Almacena XP, niveles y datos de usuarios
- **boosts** - Gestiona todos los boosts activos
- **cooldowns** - Control de cooldowns de mini-juegos
- **bans** - Sistema de bans de XP
- **game_sessions** - Sesiones activas de mini-juegos

Todo persiste automáticamente, incluso después de reiniciar el bot.

## 🔧 Desarrollo Local

Si quieres probar el bot localmente:

1. Clona el repositorio
2. Instala dependencias: `npm install`
3. Crea archivo `.env`:
   ```
   DISCORD_TOKEN=tu_token
   CLIENT_ID=tu_client_id
   DATABASE_URL=postgresql://localhost/levelbot
   ```
4. Crea base de datos PostgreSQL local
5. Ejecuta: `npm start`

## 🐛 Solución de Problemas

### El bot no responde a comandos
- Verifica que los comandos slash estén registrados (toma unos minutos la primera vez)
- Asegúrate de que el bot tenga permisos de "applications.commands"
- Revisa los logs en Render para ver errores

### Error de base de datos
- Verifica que la DATABASE_URL sea la Internal Database URL de Render
- Asegúrate de que la base de datos PostgreSQL esté activa

### Tarjetas de nivel no se generan
- Verifica que el bot tenga permiso "Attach Files"
- Revisa los logs para ver errores de Canvas

### Boost nocturno no funciona
- El horario está configurado para Venezuela (UTC-4)
- Se verifica cada 15 minutos
- Revisa los logs para ver mensajes de activación/desactivación

## 📝 Licencia

MIT

## 🤝 Soporte

Si tienes problemas, revisa:
1. Los logs en Render Dashboard
2. Que todos los permisos del bot estén correctos
3. Que las variables de entorno estén configuradas

---

**¡Disfruta tu bot de niveles!** 🎉
