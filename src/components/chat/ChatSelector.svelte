<script lang="ts">
    import APIClient from "../../services/api";
    import { currentSession } from "../../stores/sessionStore"; // highlight this in the list
    import type { IChatSession } from "../../models/chat-types";
    import { getTimeAgo } from "../../utils/dateHelpers";

    export let showSelector = false;
    export let toggleChatSelector  = () => {};

    let sessions : IChatSession[] = [];

    if (showSelector) {
        APIClient.listSessions().then(s => sessions = s);
    }

</script>

{#if showSelector}
    <div id="overlay">
        <div class="top-right circular-button">
            <button on:click={toggleChatSelector}>x</button>
        </div>
        <div class="header">
            <h3>Chat Sessions</h3>
        </div>
        <div class="container">
            {#each sessions as session}
                <button 
                    class="session-item {session.id == $currentSession ? "current" : ""}"
                    on:click={() => {
                        currentSession.set(session.id);
                        toggleChatSelector();
                    }}    
                >
                    <h4>{session.title || 'Untitled'}</h4>
                    <p>{session.numMessages} Messages</p>
                    <p>{getTimeAgo(session.createdAt)}</p>
                    <p>{session.id == $currentSession ? "(Current)" : ""}</p>
                </button>
            {/each}
        </div>
    </div>
{/if}

<style>
    #overlay {
        position: absolute;
        display: flex;
        flex-direction: column;
        /* justify-content: center; */
        align-items: center;
        height: 100%;
        width: 100%;
        background-color: rgba(13, 16, 24, 0.705);
        z-index: 100;
        padding: 0;
        backdrop-filter: blur(3px);
    }

    .header {
        margin-top: 20px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .container {
        width: 85%;
        height: 80%;
        background-color: #111111;
        margin-top: 10px;
        border-radius: 8px;
        padding: 10px;
        display: flex;
        gap: 2px;
        flex-direction: column;
        align-items: center;
        gap: 5px;
    }

    .session-item {
        box-sizing: border-box;
        width: 100%;
        height: 60px;
        /* background-color: #585eb6; */
        background: radial-gradient(circle at 0% 100%, #585eb6, #637b96);
        border-radius: 4px;
        padding: 0 10px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        align-items: center;
        cursor: pointer;
        transition-duration: 300ms;
        color:white;
        border: none;
        /* add drop shadow */
        filter: drop-shadow(0px 0px 3px rgb(0, 0, 0));
        font-size: 15px;
    }

    .session-item p {
        font-size: small;
    }

    .session-item:hover {
        background: radial-gradient(circle at 0% 100%, #7e82c2, #637b96);
        /* background-color: #585eb6a0; */
    }
    
    .current {
        background: radial-gradient(circle at 0% 100%, #80c27e, #63966a);
        /* background-color: hsla(115, 39%, 53%, 0.627); */
    }

    .top-right {
        display: flex;
        align-items: center;
        position: absolute;
        top: 10px;
        right: 10px;
        gap: 5px;
    }
</style>
