<script lang="ts">
    import Chat from "./components/chat/ChatWindow.svelte";
    import Navbar from "./components/Navbar.svelte";
    import { onMount } from "svelte";
    import ConnectWalletOverlay from "./components/wallet/ConnectWalletOverlay.svelte";
    import APIClient from "./services/api";
    import { initializeAuthentication } from "./utils/isAuthenticated";

    onMount(async() => {
        await initializeAuthentication();
    });

</script>

<body>
    <ConnectWalletOverlay />
    <!-- <SignMessageOverlay /> -->
    <Navbar pageTitle={"Woahverse Chat"}/>
    <Chat />
</body>

<style>
    /* * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    } */
</style>
