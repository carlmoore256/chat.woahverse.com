<script lang="ts">
    import { WalletConnection, signMessage } from "../../services/wallet";
    import { get } from "svelte/store";
    import APIClient from "../../services/api";
    import { isAuthenticated } from "../../stores/isAuthenticated";

    $: isConnected = $WalletConnection !== null;

    let error = null;

    const authenticate = async () => {
        const walletAddress = get(WalletConnection);
        if (!walletAddress) {
            error = "Wallet not connected";
        }
        const result = await APIClient.authenticate(walletAddress);
        if (result.success) {
            console.log("Authenticated!");
            isAuthenticated.set(true);
            error = null;
        } else {
            error = result.error;
        }
    };
</script>

{#if isConnected && !$isAuthenticated}
    <div id="overlay">
        <div class="container fancy">
            <h3>Authentication</h3>
            <p>
                In order to <strong>chat with Woah</strong>, you must be a
                tokenholder.<br />
                Sign the message to authenticate your ownership.
            </p>
            <button on:click={authenticate}><span>Sign Message</span></button>

            {#if error}
                <div class="error">
                    <p>{error}</p>
                </div>
            {/if}
        </div>
    </div>
{/if}

<style>
    #overlay {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        background-color: rgba(13, 16, 24, 0.705);
        z-index: 100;
        padding: 0;
        backdrop-filter: blur(3px);
    }

    .error {
        background-color: #ff0000;
        padding: 10px;
        border-radius: 6px;
        margin-top: 10px;
    }

    .container {
        background-color: rgba(255, 255, 255, 0.096);
        padding: 8% 5%;
        border-radius: 6px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    h3 {
        color: white;
        font-family: "Roboto", sans-serif;
        font-size: 1rem;
        margin: 0;
    }

    p {
        color: white;
        font-family: "Roboto", sans-serif;
        font-size: 0.8rem;
        margin: 0;
        line-height: 1.4;
    }
</style>
