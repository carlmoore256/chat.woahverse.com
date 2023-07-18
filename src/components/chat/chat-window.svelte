<script lang="ts">
    import { writable } from "svelte/store";
    import ChatSelector from "./chat-selector.svelte";
    // import ChatMessage from "./chat-message.svelte";
    import ChatMessage from "./chat-message.svelte";
    import ChatInput from "./chat-input.svelte";

    const messages = writable<any>([]);

    let showSelector = false;

    function toggleChatSelector() {
        showSelector = !showSelector;
    }

    function handleNewMessage(event : any) {
        const messageWithId = {
            ...event.detail,
            id: `${new Date().getTime()}-${Math.random()}`,
        };
        messages.update((m) => [...m, messageWithId]);
    }

    function resetChat() {}
</script>

<div class="chat-container">
    <div class="chat-actions-top">
        <button id="btn-open" on:click={toggleChatSelector}>=</button>
        <button id="btn-reset" on:click={resetChat}>&#x21bb;</button>
    </div>

    {#if showSelector}
        <ChatSelector />
    {/if}

    <div class="chat-body" id="chat-body" style="padding: 10px">
        {#each $messages as message (message.id)}
            <ChatMessage {message} />
        {/each}
    </div>

    <ChatInput on:message={handleNewMessage} />
</div>

<style>
    .chat-container {
        position: relative;
        width: 100%;
        max-width: 500px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.286);
        font-family: "Roboto", sans-serif;
        background-color: #2e2f3f54;
        display: flex;
        height: 80vh;
        flex-direction: column;
    }
    .chat-body {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        padding: 10px;
        display: flex;
        flex-direction: column;
        /* gap: 5px; */
        justify-content: flex-end;
        box-sizing: border-box;
    }

    .chat-actions-top {
        display: flex;
        align-items: center;
        position: absolute;
        top: 10px;
        right: 10px;
        gap: 5px;
    }

    .chat-actions-top button {
        background: #585eb6;
        color: #ffffff;
        width: 30px;
        height: 30px;
        border: none;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        cursor: pointer;
        transition-duration: 300ms;
        outline: none;
        opacity: 20%;
    }

    .chat-actions-top button:hover {
        background: #767786;
        box-shadow: 0 15px 25px rgba(0, 0, 0, 0.1);
        width: 60px;
        border-radius: 10px;
        opacity: 100%;
    }

    .chat-actions-top button:active {
        box-shadow: 0 0 4px #585eb6;
    }
</style>
