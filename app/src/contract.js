// Todo lo que habla con el contrato vive aquí.
//
// Dos formas de obtener un cliente del contrato:
//  A) contract.Client.from(...)  → lee la interfaz (spec) del contrato desde la red. Cero codegen.
//     Es la que usa este starter: sirve con cualquier Contract ID que pegues.
//  B) Bindings TypeScript generados con `npm run bindings` (stellar contract bindings typescript).
//     Generan un paquete en packages/hello_world con tipos para cada función. Para usarlos:
//       import { Client } from "../packages/hello_world/src/index.ts";
//       const client = new Client({ contractId, networkPassphrase, rpcUrl, publicKey, signTransaction });
//     Es el camino "de producción": autocompletado y errores en tiempo de compilación.
import { contract, Networks } from "@stellar/stellar-sdk";
import { requestAccess, getAddress, signTransaction } from "@stellar/freighter-api";

export const RPC_URL = "https://soroban-testnet.stellar.org";
export const NETWORK_PASSPHRASE = Networks.TESTNET;
export const EXPLORER = "https://stellar.expert/explorer/testnet";
export const CONTRACT_ID_DEFAULT = import.meta.env.VITE_CONTRACT_ID || "";

/** Pide permiso a Freighter y devuelve la dirección pública (G...). */
export async function conectarWallet() {
  const acceso = await requestAccess();
  if (acceso.error) throw new Error(acceso.error);
  const { address, error } = await getAddress();
  if (error) throw new Error(error);
  return address;
}

/**
 * Crea un cliente del contrato. Si pasas publicKey, el cliente podrá enviar
 * transacciones que cambian estado (count, decrement) firmadas por Freighter.
 */
export async function crearCliente({ contractId, publicKey }) {
  return contract.Client.from({
    contractId,
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: RPC_URL,
    publicKey,
    // Freighter firma el XDR; la llave secreta nunca sale de la extensión.
    signTransaction: async (xdr, opts) => {
      const r = await signTransaction(xdr, {
        networkPassphrase: opts?.networkPassphrase ?? NETWORK_PASSPHRASE,
        address: opts?.address ?? publicKey,
      });
      if (r.error) throw new Error(typeof r.error === "string" ? r.error : r.error.message);
      return { signedTxXdr: r.signedTxXdr, signerAddress: r.signerAddress };
    },
  });
}

/** hello es de solo lectura: basta con simular, no se envía nada a la red. */
export async function hello(client, to) {
  const tx = await client.hello({ to });
  return tx.result; // ["Hello", to]
}

/** count cambia estado: se simula, se firma en Freighter y se envía. Devuelve { valor, hash }. */
export async function count(client) {
  const tx = await client.count();
  const enviado = await tx.signAndSend();
  return { valor: enviado.result, hash: enviado.sendTransactionResponse?.hash };
}

/** decrement puede devolver un error tipado del contrato (Error(Contract, #1)). */
export async function decrement(client) {
  const tx = await client.decrement();
  const enviado = await tx.signAndSend();
  // Con errores tipados, result es un Result: Ok(valor) o Err(error).
  const r = enviado.result;
  if (r && typeof r === "object" && "unwrap" in r) return { valor: r.unwrap(), hash: enviado.sendTransactionResponse?.hash };
  return { valor: r, hash: enviado.sendTransactionResponse?.hash };
}
