import { writable } from "svelte/store";

declare global {
    interface Window {
        ethereum: any;
    }
}

function createWallet() {
    const initialAddress = window.ethereum?.selectedAddress || null;
    const { subscribe, set } = writable(initialAddress);

    return {
        subscribe,
        connect: async () => {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const newAddress = accounts[0]; // The first account in MetaMask
            set(newAddress.toLowerCase());
        },
        disconnect: () => {
            set(null);
        },
    };
}

export async function signMessage(message: string, address: string) {
    console.log("signMessage");
    const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, address],
    });
    return signature;
}

export const WalletConnection = createWallet();
