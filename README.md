# Guerras del Olimpo

**Guerras del Olimpo** es un MVP web de defensa lateral 2D con temática de mitología griega. Invoca campeones, protege el Santuario del Olimpo y conquista el Templo de Ares en una batalla entre polis, guardianes y energía divina.

El proyecto usa **Phaser 3 + TypeScript + Vite**. Los gráficos actuales son generados proceduralmente con Phaser mediante `Graphics`, `Container`, formas simples y texturas internas; no se usan assets externos ni material con copyright.

## Instalación

```bash
npm install
```

## Comandos

```bash
npm run dev
npm run build
npm run preview
```

## Controles

- `1` Hoplita
- `2` Arquero de Delfos
- `3` Guardián de Esparta
- `4` Oráculo Arcano
- `Q` Rayo de Zeus

También podés usar los botones inferiores del HUD para invocar unidades y lanzar el Rayo de Zeus.

## Estado del MVP

Incluye menú, escena de juego, escena de mejoras, favor divino como recurso, IA enemiga, invocación de unidades, héroe principal, proyectiles, combate, victoria/derrota y guardado de monedas en `localStorage`.
