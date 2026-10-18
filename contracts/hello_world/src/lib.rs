#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, vec, Env, String, Symbol, Vec};

const COUNTER: Symbol = symbol_short!("COUNTER");

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {
    /// Saluda a `to`. Ejemplo de función de solo lectura.
    pub fn hello(env: Env, to: String) -> Vec<String> {
        vec![&env, String::from_str(&env, "Hello"), to]
    }

    /// Reto de la sesión 2: contador en `instance` storage.
    /// Cada llamada incrementa y devuelve el nuevo valor.
    pub fn count(env: Env) -> u32 {
        let mut count: u32 = env.storage().instance().get(&COUNTER).unwrap_or(0);
        count += 1;
        env.storage().instance().set(&COUNTER, &count);
        // Extiende el TTL para que el estado no expire mientras se usa.
        env.storage().instance().extend_ttl(50, 100);
        count
    }
}

mod test;
