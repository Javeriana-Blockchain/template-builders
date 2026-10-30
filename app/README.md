# jave-contract-starter

Frontend mínimo para tu contrato Soroban: conecta Freighter, carga el contrato por su ID y llama `hello`, `count` y `decrement` con Freighter firmando.

```bash
cd app
cp .env.example .env        # pega tu Contract ID
npm install
npm run dev                 # http://localhost:5173
```

Requisitos: Node 20+, Freighter en TEST NET con la misma cuenta que tiene XLM (las invocaciones que cambian estado pagan fee).

## Cómo habla la app con el contrato

- `src/contract.js`: `contract.Client.from(...)` del SDK lee la interfaz del contrato directamente de la red y expone una función JS por cada función del contrato. `hello` solo se simula (lectura); `count` y `decrement` se simulan, se firman en Freighter y se envían.
- Alternativa "de producción", bindings TypeScript generados por la CLI:

```bash
VITE_CONTRACT_ID=C... npm run bindings     # crea packages/hello_world
```

y en `contract.js` cambia `contract.Client.from(...)` por `new Client({...})` importado de `../packages/hello_world/src/index.ts`. Mismos métodos, pero con tipos.

## Errores que vas a ver

| Mensaje | Qué pasó |
|---|---|
| `Error(Contract, #1)` | El contrato devolvió tu error tipado (CounterIsZero). Funciona como debe. |
| `Buffer is not defined` | Falta el polyfill de `main.jsx`; no lo borres. |
| `User declined access` | Rechazaste la ventana de Freighter. |
| `Bad union switch` / spec | El Contract ID no es de este contrato o no está en testnet. |
