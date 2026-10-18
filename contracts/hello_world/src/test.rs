#![cfg(test)]
use super::*;
use soroban_sdk::{vec, Env, String};

#[test]
fn hello_devuelve_saludo() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let words = client.hello(&String::from_str(&env, "Javeriana"));
    assert_eq!(
        words,
        vec![
            &env,
            String::from_str(&env, "Hello"),
            String::from_str(&env, "Javeriana")
        ]
    );
}

#[test]
fn count_incrementa_en_cada_llamada() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    assert_eq!(client.count(), 1);
    assert_eq!(client.count(), 2);
    assert_eq!(client.count(), 3);
}

// Tarea: agrega una prueba de fallo esperado (#[should_panic] o un error tipado)
// cuando implementes validaciones en la sesión 4.
