# <Nombre del equipo> · Ruta JaveBlockchain 2026-II · Builders

> Plantilla del semillero JaveBlockchain (PUJ). Reemplaza todo lo que esté entre `< >`.

## Equipo

| Integrante | Nivel | Dirección pública de testnet (G…) | GitHub |
|---|---|---|---|
| <Nombre 1> | Builders | `G...` | @usuario |
| <Nombre 2> | Fundamentos | `G...` | @usuario |
| <Nombre 3> | Builders | `G...` | @usuario |

## Entorno (PR #1)

Pega aquí la salida de los comandos (texto, no captura):

```
$ rustc --version
<pega aquí>

$ stellar --version
<pega aquí>

$ stellar keys address alice
<pega aquí>
```

## Nuestra primera transacción (PR #1, máx. 150 palabras)

<Qué se construyó, qué se firmó y con qué llave, quién pagó el fee, cómo lo verificamos. En sus palabras.>

Hash de la transacción: `<64 caracteres hexadecimales>`

## Contrato (desde la sesión 2)

| Dato | Valor |
|---|---|
| Red | Testnet |
| Contract ID | `C...` |
| Último despliegue | AAAA-MM-DD |

### Compilar, probar, desplegar

```bash
cargo test                                   # pruebas nativas
stellar contract build                       # wasm en target/wasm32v1-none/release/
stellar contract deploy \
  --wasm target/wasm32v1-none/release/hello_world.wasm \
  --source-account alice --network testnet --alias hello_world
stellar contract invoke --id hello_world --source-account alice --network testnet -- hello --to Javeriana
```

## Problema que resolvemos (desde la sesión 3)

<Una frase. Quién tiene el problema, qué le pasa hoy, qué cambia con nuestra solución.>

## Diseño del contrato (sesión 3)

El diseño completo vive en [`docs/DISENO_CONTRATO.md`](docs/DISENO_CONTRATO.md). Resumen:

| Función | Quién la puede llamar (`require_auth`) | Storage que toca | Error que devuelve |
|---|---|---|---|
| | | | |

## Frontend (sesión 3)

Carpeta `app/`: Vite + React que invoca el contrato con Freighter. Ver `app/README.md` para correrla.

Hash de un `count` hecho desde la app: `<64 caracteres hexadecimales>`

## Declaración de uso de IA del proyecto

<Qué herramientas usamos, para qué, y qué partes del código escribimos a mano.>
