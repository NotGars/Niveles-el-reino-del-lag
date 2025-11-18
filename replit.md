# Discord Level Bot - Proyecto

## Descripción del Proyecto

Bot de Discord con sistema de niveles complejo inspirado en Arcane Bot, con mini-juegos interactivos, tarjetas personalizadas generadas con Canvas, y sistema de boosts acumulables.

## Estructura del Proyecto

```
discord-level-bot/
├── src/
│   ├── commands/          # Comandos slash del bot
│   │   ├── level.js       # /level, /nivel, /rank
│   │   ├── leaderboard.js # /leaderboard, /lb
│   │   ├── rewards.js     # /rewards list
│   │   ├── boost.js       # /boost add/list/status
│   │   ├── addlevel.js    # Staff: añadir niveles
│   │   ├── removelevel.js # Staff: quitar niveles
│   │   ├── setlevel.js    # Staff: establecer nivel
│   │   ├── xp.js          # Staff: gestionar XP
│   │   ├── ban.js         # Staff: banear de XP
│   │   ├── unban.js       # Staff: desbanear de XP
│   │   ├── reset.js       # Staff: resetear temporada
│   │   ├── clear.js       # Staff: limpiar roles
│   │   ├── globalboost.js # Staff: boost global
│   │   ├── minijuego.js   # Mini-juegos interactivos
│   │   ├── help.js        # Ayuda de comandos
│   │   ├── embed.js       # Crear embeds
│   │   └── mensaje.js     # Enviar mensajes
│   ├── config/
│   │   └── constants.js   # Configuración y constantes
│   ├── database/
│   │   └── setup.js       # Inicialización de PostgreSQL
│   ├── events/
│   │   ├── messageCreate.js        # Evento de mensajes
│   │   └── messageReactionAdd.js   # Evento de reacciones
│   ├── minigames/
│   │   └── trivia.js      # Preguntas de trivia
│   ├── utils/
│   │   ├── xpManager.js   # Gestión de XP y niveles
│   │   ├── cooldownManager.js # Gestión de cooldowns
│   │   ├── banManager.js  # Gestión de bans
│   │   ├── cardGenerator.js # Generación de tarjetas
│   │   └── nightBoost.js  # Boost nocturno automático
│   └── index.js           # Punto de entrada principal
├── package.json
├── .env.example
├── .gitignore
└── README.md

```

## Características Principales

### Sistema de Niveles
- Fórmula de XP progresiva que se vuelve más lenta con cada nivel
- Cooldown de 10 segundos entre mensajes para evitar spam
- XP por mensajes, imágenes, videos y reacciones
- 11 roles automáticos por nivel (1, 5, 10, 20, 25, 30, 35, 40, 50, 75, 100)

### Mini-Juegos
1. **Trivia** - 5 preguntas, cooldown 12h
2. **Piedra/Papel/Tijera** - Mejor de 3, cooldown 12h
3. **Ruleta Rusa** - Probabilidades realistas, cooldown 24h
4. **Ahorcado Solitario** - 3 rondas, cooldown 2 días
5. **Ahorcado Multijugador** - Sistema de anfitrión

### Tarjetas Personalizadas
Generadas con Canvas según nivel y roles:
- Pixel Art (normal)
- Estilo Mar (activos, nivel 25+)
- Estilo Zelda (super activos, nivel 35+)
- Estilo Pokemon (nivel 100)
- Geometry Dash (boosters)
- Nocturna (VIPs)
- Aleatoria (usuario especial ID: 956700088103747625)

### Leaderboard Personalizado
Estilo Arcane bot con:
- Barras de progreso de XP para cada usuario
- Gradientes de color (dorado/plateado/bronce)
- Avatares grandes con bordes según ranking
- XP actual / XP requerido mostrado
- Diseño profesional mejorado

### Sistema de Boosts
- Boosts acumulables (suman porcentajes)
- Boost nocturno automático 25% (8 PM - 6 AM Venezuela)
- Boosters/VIPs: +200% permanente
- Boosts de usuario, canal y globales
- Boosts temporales de mini-juegos

### Persistencia
- Base de datos PostgreSQL
- Todo sobrevive reinicios del bot
- Tablas: users, boosts, cooldowns, bans, game_sessions

## IDs Configurados

```javascript
STAFF_ROLE_ID: '1230949715127042098'
BOOSTER_ROLE_ID: '1423037247606882399'
VIP_ROLE_ID: '1423037247606882399'
SPECIAL_USER_ID: '956700088103747625'

NO_XP_CHANNELS: ['1313723272290111559', '1258524941289263254']
LEVEL_UP_CHANNEL: '1243975130908983356'
```

## Deploy

Este proyecto está diseñado para desplegarse en **Render** con GitHub:

1. Subir código a GitHub
2. Crear PostgreSQL database en Render
3. Crear Web Service en Render
4. Configurar variables de entorno
5. Deploy automático

Ver README.md para instrucciones detalladas.

## Estado del Proyecto

✅ Sistema de niveles completo
✅ Todos los comandos implementados
✅ Mini-juegos funcionando
✅ Tarjetas personalizadas con Canvas
✅ Sistema de boosts acumulables
✅ Boost nocturno automático
✅ Persistencia con PostgreSQL
✅ Sistema de cooldowns
✅ Sistema de bans
✅ Roles automáticos por nivel

## Notas de Desarrollo

- El bot usa Discord.js v14
- ES Modules (type: "module" en package.json)
- Canvas para generación de imágenes
- Node-cron para boost nocturno
- Moment-timezone para horario Venezuela
- PostgreSQL con pg driver

## Próximas Mejoras Posibles

- Ahorcado multijugador completo
- Dashboard web para estadísticas
- Sistema de logros
- Eventos temporales
- Intercambio de niveles entre usuarios
