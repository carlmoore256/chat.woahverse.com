<script lang="ts">
    import { WalletConnection } from "../services/wallet";

    export let pageTitle = "NFT Chat";

    $: isConnected = $WalletConnection !== null;

    function handleConnect() {
        if (!isConnected) 
        {
            WalletConnection.connect();
        } else {
            WalletConnection.disconnect();
        }
    }

</script>

<nav class="top-bar {isConnected ? "bar-connected" : ""}">
    <div class="box left">
        <h3 id="page-title">{pageTitle}</h3>
    </div>
    <div class="box right">
        <div class="connection-status">
            <button id="wallet-status" on:click={handleConnect} class="wallet-status prevent-select">
                {#if isConnected}
                    <div class="status-indicator connected" />
                    <div class="status-text">Wallet Connected</div>
                {:else}
                    <div class="status-indicator not-connected" />
                    <div class="status-text">Wallet Not Connected</div>
                {/if}
            </button>
        </div>
    </div>
</nav>

<style>
    .top-bar {
        width: calc(
            100% - 2 * 10px
        ); /* subtract double the desired padding from width */
        padding: 10 20px;
        font-size: 1em;
        color: #fff;
        height: 60px;
        background-color: #ffffff15;
        border-radius: 4px;
        display: flex;
        align-items: center;
        position: absolute;
        top: 10px;
        z-index: 101;
        backdrop-filter: blur(3px);
        transition-duration: 500ms;
    }

    .bar-connected {
        background-color: rgba(221, 224, 228, 0);
    }

    .top-bar h3 {
        margin-right: 1em; /* Add some space to the right of the heading */
    }

    #page-title {
        padding: 8px;
    }

    .box {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .left {
        display: flex;
        align-items: center;
        justify-content: left;
        padding: 15px;
    }

    .right {
        display: flex;
        align-items: center;
        justify-content: right;
        padding: 15px;
    }

    .connection-status {
        display: flex;
        align-items: center;
        margin-left: auto; /* Push the user-info to the right */
    }

    .wallet-status {
        display: flex;
        align-items: center;
        background-color: transparent;
        border: none;
        color: #fff;
        padding: 10px;
        border-radius: 4px;
        transition-duration: 300ms;
    }

    .wallet-status:hover {
        cursor: pointer;
        background-color: #ffffff15;
    }

    .status-indicator {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 5px;
    }

    .status-text {
        font-size: 12px;
    }

    .not-connected {
        background-color: red;
    }

    .connected {
        background-color: green;
    }
</style>
