<script lang="ts">
    import Chat from "./components/chat/ChatWindow.svelte";
    import Navbar from "./components/Navbar.svelte";
    import { onMount } from "svelte";
    import ConnectWalletOverlay from "./components/ConnectWalletOverlay.svelte";

    onMount(() => {
        // const api = new APIClient("https://api.woahverse.com:3002/v1");
    });
</script>

<body>
    <ConnectWalletOverlay />
    <Navbar />
    <Chat />
</body>

<style>
    /* * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    } */
</style>
