<script lang="ts">
    import Chat from "./components/chat/chat-window.svelte";
    import Navbar from "./components/navbar.svelte";
    import APIClient from "./services/api";
    import { onMount } from "svelte";

    onMount(() => {
        const api = new APIClient("https://api.woahverse.com:3002/v1");
        // api.getMessages().then((messages) => {
        //     console.log(messages);
        // });
    })

    
</script>

<body>
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
