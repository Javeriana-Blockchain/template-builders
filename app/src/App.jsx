import { useState } from "react";
import { conectarWallet, crearCliente, hello, count, decrement, CONTRACT_ID_DEFAULT, EXPLORER } from "./contract.js";

export default function App() {
  const [address, setAddress] = useState("");
  const [contractId, setContractId] = useState(CONTRACT_ID_DEFAULT);
  const [client, setClient] = useState(null);
  const [nombre, setNombre] = useState("Javeriana");
  const [saludo, setSaludo] = useState("");
  const [contador, setContador] = useState(null);
  const [hash, setHash] = useState("");
  const [estado, setEstado] = useState("");

  async function conectar() {
    try {
      setEstado("Conectando con Freighter…");
      const a = await conectarWallet();
      setAddress(a);
      setEstado("");
    } catch (e) {
      setEstado(`Error: ${e.message}`);
    }
  }

  async function cargarContrato() {
    try {
      setEstado("Leyendo la interfaz del contrato desde la red…");
      const c = await crearCliente({ contractId: contractId.trim(), publicKey: address });
      setClient(c);
      setEstado("Contrato listo. Funciones disponibles: hello, count, decrement.");
    } catch (e) {
      setEstado(`Error: ${e.message}`);
    }
  }

  async function llamar(fn) {
    try {
      setHash("");
      if (fn === "hello") {
        setEstado("Simulando hello (solo lectura, no se firma nada)…");
        const r = await hello(client, nombre);
        setSaludo(r.join(" "));
        setEstado("");
      } else {
        setEstado(`Simulando, firmando en Freighter y enviando ${fn}…`);
        const t0 = performance.now();
        const { valor, hash: h } = fn === "count" ? await count(client) : await decrement(client);
        setContador(valor);
        setHash(h ?? "");
        setEstado(`Confirmada en ${((performance.now() - t0) / 1000).toFixed(1)} s`);
      }
    } catch (e) {
      // Un error tipado del contrato llega aquí como "Error(Contract, #1)": es tu CounterIsZero.
      setEstado(`Error: ${e.message}`);
    }
  }

  return (
    <main style={{ fontFamily: "system-ui", maxWidth: 640, margin: "40px auto", padding: 16 }}>
      <h1>jave-contract-starter</h1>
      <p style={{ color: "#555" }}>Testnet · tu contrato hello_world hablando con Freighter.</p>

      {!address ? (
        <button onClick={conectar}>1. Conectar wallet (Freighter)</button>
      ) : (
        <p><b>Wallet:</b> <code>{address}</code></p>
      )}

      {address && (
        <div style={{ display: "grid", gap: 8, marginTop: 16 }}>
          <input placeholder="Contract ID (C...)" value={contractId} onChange={(e) => setContractId(e.target.value)} />
          <button onClick={cargarContrato} disabled={!contractId}>2. Cargar contrato</button>
        </div>
      )}

      {client && (
        <div style={{ display: "grid", gap: 16, marginTop: 24 }}>
          <section style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
            <h3>hello(to) · solo lectura</h3>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
              <button onClick={() => llamar("hello")}>Llamar</button>
            </div>
            {saludo && <p>Respuesta: <code>{saludo}</code></p>}
          </section>

          <section style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
            <h3>count() / decrement() · cambian estado</h3>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => llamar("count")}>count +1</button>
              <button onClick={() => llamar("decrement")}>decrement −1</button>
            </div>
            {contador !== null && <p>Contador en la cadena: <b>{String(contador)}</b></p>}
            {hash && (
              <p>
                Hash: <a href={`${EXPLORER}/tx/${hash}`} target="_blank" rel="noreferrer"><code>{hash}</code></a>
              </p>
            )}
          </section>
        </div>
      )}

      {estado && <p style={{ marginTop: 16 }}>{estado}</p>}
    </main>
  );
}
