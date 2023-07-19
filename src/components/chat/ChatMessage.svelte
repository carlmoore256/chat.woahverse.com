<script lang="ts">

    import type { IChatMessage } from "../../models/chat-types";

    export let chatMessage : IChatMessage;

    let messageClass = chatMessage.role === "human" ? "sent" : "received";

    if (chatMessage.code) {
        console.log("Message has code")
        // messageClass += " code-block";
    }
</script>

<div class="message {messageClass}">
    {chatMessage.message}
</div>


<style>
    .message {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: left;
        gap: 10px;
        margin-bottom: 10px;
        word-wrap: break-word;
        box-sizing: border-box;
    }

    .message code {
        font-size: 14px;
        font-family: "Roboto Mono", monospace;
    }

    .code-block {
        background-color: #000000ad;
        border-radius: 4px;
        max-width: 100%;
        padding: 10px;
        overflow: scroll;
    }

    .sent {
        background-color: #474747;
        border-radius: 4px 4px 0 4px;
        padding: 10px;
        color: #fff;
        font-size: 16px;
    }

    .received {
        /* background-color: #585eb6; */
        background: radial-gradient(circle at 0% 100%, #585eb6, #637b96);

        border-radius: 4px 4px 4px 0;
        padding: 10px;
        color: #fff;
        font-size: 16px;
    }
</style>
