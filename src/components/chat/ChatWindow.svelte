<script lang="ts">
    import { writable } from "svelte/store";
    import ChatSelector from "./ChatSelector.svelte";
    import ChatMessage from "./ChatMessage.svelte";
    import ChatInput from "./ChatInput.svelte";
    import SignMessageOverlay from "../wallet/AuthenticationOverlay.svelte";
    import APIClient from "../../services/api";
    import { currentSession } from "../../stores/sessionStore";
    import { isAuthenticated } from "../../stores/isAuthenticated";
    import type { IChatMessage } from "../../models/chat-types";
    import { createNewChatMessage } from "../../utils/chatMessages";
    import { formatLLMMessage, messageHasCode } from "../../utils/chatMessages";

    const messages = writable<Map<string, IChatMessage>>(
        new Map<string, IChatMessage>()
    );

    function clearMessages() {
        if ($messages.size > 0) {
            messages.update((m) => {
                m.clear();
                return m;
            });
        }
    }

    let chatBody;
    const scrollToBottom = async (node : Element) => {
        node.scroll({ top: node.scrollHeight, behavior: "instant" });
    };

    $: {
        if ($currentSession !== null) {
            clearMessages();
            console.log(`Loading session: ${$currentSession}`);
            loadSessionMessages();
        }
    }

    async function loadSessionMessages() {
        let messages = await APIClient.loadSession($currentSession);
        console.log(`Loaded ${messages.length} messages`);
        messages = messages.sort((a, b) => {
            return a.createdAt.getTime() - b.createdAt.getTime(); // sort messages by date
        });
        messages = messages.map((m) => {
            if (m.role == "ai" && messageHasCode(m.message)) {
                m.code = m.message;
            }
            return m;
        });
        messages.forEach((message) => {
            insertMessage(message);
        });
        setTimeout(() => {
            scrollToBottom(chatBody);

        }, 0)
    }

    function insertMessage(message: IChatMessage) {
        messages.update((m) => {
            m.set(message.id, message);
            return m;
        });
    }

    async function handleSendMessage(event: any) {
        const sendMessage = event.detail as IChatMessage;
        insertMessage(sendMessage);
        if ($currentSession == null) {
            const newSession = await APIClient.newSession();
            console.log(`Got new session: ${newSession}`);
            currentSession.set(newSession);
        }

        if ($currentSession === null) {
            throw new Error("Session not initialized");
        }

        const replyMessage = createNewChatMessage("ai");
        insertMessage(replyMessage);

        APIClient.sendMessage(
            $currentSession,
            sendMessage.message,
            (data: any) => {
                console.log("Got response: ", data);
                messages.update((map) => {
                    const message = map.get(replyMessage.id);
                    message.message = formatLLMMessage(message.message + data);
                    return map;
                });
            }
        );
    }

    async function resetChat(event: any) {
        $currentSession = null;
        clearMessages();
    }

    let showChatSelector = false;

    function toggleChatSelector() {
        showChatSelector = !showChatSelector;
    }
</script>

<div class="chat-container">
    <SignMessageOverlay />

    <div class="top-right circular-button">
        <button id="btn-open" on:click={toggleChatSelector}>=</button>
        <button id="btn-reset" on:click={resetChat}>&#x21bb;</button>
    </div>

    {#if showChatSelector}
        <ChatSelector showSelector={showChatSelector} {toggleChatSelector} />
    {/if}

    <div class="chat-body" id="chat-body" bind:this={chatBody}>
        <div class="spacer" />
        {#each $messages.values() as message (message.id)}
            <ChatMessage chatMessage={message} />
        {/each}
    </div>
    <!-- must be authenticated to try to send a message -->
    <ChatInput on:message={handleSendMessage} enableSubmit={$isAuthenticated} />
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
        overflow: hidden;
    }
    .chat-body {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        padding: 10px;
        display: flex;
        flex-direction: column;
        /* gap: 5px; */
        /* justify-content: flex-end; */
        box-sizing: border-box;
    }

    .top-right {
        display: flex;
        align-items: center;
        position: absolute;
        top: 10px;
        right: 10px;
        gap: 5px;
    }

    .spacer {
        flex-grow: 1;
    }
</style>
