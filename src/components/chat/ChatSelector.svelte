<script lang="ts">
    export let foo = "bar";
</script>

<div>
    <h1>YO</h1>
    <h2>{foo}</h2>
    <div id="chat-selection-overlay">
        <div id="selection-container" />
    </div>

</div>

<style>
    #chat-selection-overlay {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center; /* Added this */
        gap: 5px;
        color: #fff;
        backdrop-filter: blur(3px);
        display: none;
    }

    #selection-container {
        width: 90%;
        height: 90%;
        background-color: #474747;
        border-radius: 4px;
        /* padding: 10px; */
        display: flex;
        gap: 2px;
        flex-direction: column;
    }

    .chat-selection-item {
        width: 100%;
        height: 60px;
        background-color: #585eb6;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
        cursor: pointer;
        transition-duration: 300ms;
    }
</style>
