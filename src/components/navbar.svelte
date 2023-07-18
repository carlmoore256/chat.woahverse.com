<script lang="ts">
</script>

<nav class="top-bar">
    <div class="box left">
        <h3 id="page-title">NFT Chat</h3>
    </div>
    <div class="box right">
        <div class="connection-status">
            <div id="wallet-status" class="wallet-status">
                <div class="status-indicator not-connected" />
                <div class="status-text">Wallet Not Connected</div>
            </div>
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
    }

    .top-bar h3 {
        margin-right: 1em; /* Add some space to the right of the heading */
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
