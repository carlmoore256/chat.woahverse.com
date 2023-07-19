<script lang="ts">
    import { WalletConnection } from "../../services/wallet";

    // reactive statement to keep track of the connection status
    $: isConnected = $WalletConnection !== null;

    const handleConnect = async () => {
        await WalletConnection.connect();
    };
</script>

{#if !isConnected}
    <div id="connect-wallet-overlay">
        <div class="connect-wallet fancy">
            <button on:click={handleConnect}><span>Connect Wallet</span></button>
        </div>
    </div>
{/if}

<style>
    #connect-wallet-overlay {
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100vw;
        background-color: rgba(13, 16, 24, 0.705);
        z-index: 100;
        padding: 0;
        backdrop-filter: blur(3px);
    }

    .connect-wallet {
        max-width: 500px;
        border-radius: 10px;
        margin: 0;
        color: white;
        font-family: "Roboto", sans-serif;
        background-color: #2e2f3f54;
        display: flex;
        align-items: center;
        padding: 25px;
        flex-direction: column;
    }
</style>
