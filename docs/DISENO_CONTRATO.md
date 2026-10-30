# Diseño del contrato · [nombre del equipo]

> Una página. Se llena en el taller en casa de la semana 3 (GUIA_S3, paso 2.4) y se revisa en office hours **antes** de escribir código. Reemplaza lo que está entre `[ ]`. Si una fila no la pueden defender en voz alta, no está lista.

## 1. El problema en una frase

[Quién tiene el problema, qué le pasa hoy y qué cambia con el contrato. Ej.: "Los grupos de estudio reúnen plata para fotocopias en efectivo y nadie sabe cuánto hay; el contrato guarda los aportes y solo libera el dinero cuando la mayoría aprueba un gasto."]

## 2. ¿Por qué un contrato y no una base de datos?

[Quiénes son las partes que no confían entre sí. Si solo hay una parte, o todas confían, no necesitan contrato: díganlo y hagan una app con pagos normales (ruta Fundamentos).]

## 3. Estado: qué guarda y dónde

| Dato | Tipo (Rust) | Storage | Clave | Quién lo cambia | TTL: ¿por qué ese? |
|---|---|---|---|---|---|
| [admin] | Address | instance | `ADMIN` | solo en `init` | vive con el contrato |
| [saldo de cada aportante] | i128 | persistent | `Bal(Address)` | `aportar`, `retirar` | datos de usuarios: deben sobrevivir al contrato ocioso |
| [propuesta activa] | struct Propuesta | temporary | `Prop(u32)` | `proponer` | expira sola cuando cierra la votación |

Reglas rápidas: `instance` para configuración y contadores globales; `persistent` para lo que pertenece a usuarios; `temporary` para lo que puede desaparecer sin daño.

## 4. Funciones

| Función | Parámetros | Devuelve | Quién puede llamarla (`require_auth`) | Qué valida antes de escribir | Error tipado si falla |
|---|---|---|---|---|---|
| `init` | admin: Address | () | nadie (solo una vez) | que no esté inicializado | `AlreadyInitialized` |
| [`aportar`] | from: Address, monto: i128 | i128 (nuevo saldo) | `from.require_auth()` | monto > 0 | `MontoInvalido` |
| [`retirar`] | to: Address, monto: i128 | () | `admin.require_auth()` | saldo suficiente, propuesta aprobada | `SaldoInsuficiente`, `NoAprobado` |
| [`ver_saldo`] | of: Address | i128 | nadie (lectura) | — | — |

Checklist por función:
- [ ] Toda función que **escribe** tiene un `require_auth()` o una razón escrita de por qué no.
- [ ] Toda entrada de usuario se valida **antes** de tocar storage.
- [ ] Ningún `panic!` ni `unwrap()` sobre datos de usuario: errores tipados con `#[contracterror]`.
- [ ] Las lecturas no cambian estado (y por tanto no necesitan firma ni fee del usuario).

## 5. Errores

```rust
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    AlreadyInitialized = 1,
    MontoInvalido = 2,
    SaldoInsuficiente = 3,
    NoAutorizado = 4,
}
```

## 6. Flujo principal (quién llama qué, en orden)

1. [Admin despliega e `init(admin)`.]
2. [Aportante A: `aportar(A, 50)` → Freighter pide firma de A.]
3. [Aportante B: `aportar(B, 30)`.]
4. [Admin: `retirar(proveedor, 60)` → solo si …]

## 7. Pruebas que vamos a escribir (antes del código)

| Prueba | Qué garantiza |
|---|---|
| `init_solo_una_vez` | segundo `init` → `AlreadyInitialized` |
| `aportar_suma_saldo` | 50 + 30 = 80 |
| `aportar_monto_cero_falla` | `MontoInvalido` |
| `retirar_sin_auth_falla` | sin `mock_auths` del admin → panic de auth |
| `retirar_mas_del_saldo_falla` | `SaldoInsuficiente` |

## 8. Qué NO hace la versión del Demo Day

[Lo que dejan fuera a propósito para llegar al 13 de noviembre: p. ej. "no hay votación; el admin decide", "un solo activo (XLM)".]

## 9. Pantallas (una línea por pantalla, qué función llama cada botón)

| Pantalla | Qué ve el usuario | Botón → función del contrato |
|---|---|---|
| [Inicio] | saldo del fondo y mi aporte | — (`ver_saldo`) |
| [Aportar] | formulario de monto | "Aportar" → `aportar` |
| [Admin] | lista de retiros | "Retirar" → `retirar` |

---

Revisado en office hours el [fecha] por [mentor]. Cambios pedidos: [ ].
