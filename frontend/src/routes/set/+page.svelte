<script>
	import { onMount } from "svelte";

    let value = 0;

    async function sendValue() {
        const response = await fetch('http://localhost:3000/set', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ value })
        });

        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
        }

        const data = await response.json();
        console.log(data);
    }

    onMount(async () => {
        const response = await fetch('http://localhost:3000/check');
        const data = await response.json();
        value = data.value;
    });
</script>

<div class="parent">
    <input type="range" class="slider" min="0" max="100" bind:value on:touchend={sendValue} on:click={sendValue} />
    <p>Value: {value}</p>
</div>

<style>

    .parent {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .slider {
        appearance: slider-vertical;
        min-height: 25rem;
    }


</style>