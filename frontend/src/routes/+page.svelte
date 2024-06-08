<script>
	import { onMount, onDestroy } from 'svelte';
	let canvas;
	let data = [];
	let currentValue = 50; // Starting at 50%
	let frameId;
	let lastValue = 50; // Last generated value for smooth transitions

	// linear interpolation
	function lerp(start, end, t) {
		return start * (1 - t) + end * t;
	}

	const getWinLossRenderObj = () => {
		if (currentValue < 50) {
			return { text: 'LOSS!', color: '#3d0002' };
		} else {
			return { text: 'WIN!', color: '#014000' };
		}
	};

	function updateGraph() {
		// Update current value towards the last value with smoothing
		currentValue = lerp(currentValue, lastValue, 0.1);

		// Push the smoothed value into the data array
		data = [...data, currentValue].slice(-500); // Keep the last 500 data points in the chart

		if (canvas) {
			const context = canvas.getContext('2d');
			const width = canvas.clientWidth;
			const height = canvas.clientHeight;

			canvas.width = width;
			canvas.height = height;

			context.clearRect(0, 0, width, height); // Clear canvas

			// Set background color based on current smoothed value
			context.fillStyle = currentValue < 50 ? '#FF6347' : '#32CD32';
			context.fillRect(0, 0, width, height);

			// Draw the win/loss text in the upper left corner
			const { text, color } = getWinLossRenderObj();
			context.fillStyle = color;
			context.font = 'bold 20px Comic Sans MS';
			context.fillText(`real-time AI win/loss prediction: ${text}`, 10, 30);

			// Draw the graph line
			context.lineWidth = 3; // Thicker line
			context.beginPath();
			context.moveTo(0, height - (data[0] / 100) * height);
			data.forEach((value, index) => {
				context.lineTo((index / data.length) * width, height - (value / 100) * height);
			});
			context.strokeStyle = '#FFFFFF';
			context.stroke();

			// Draw current value text
			const lastY = height - (data[data.length - 1] / 100) * height;
			context.fillStyle = '#08193b';
			context.font = 'bold 24px Comic Sans MS';
			context.fillText(`${currentValue.toFixed(2)}% chance`, width - 180, lastY); // Text follows the last data point on Y
		}

		frameId = requestAnimationFrame(updateGraph);
	}

	onMount(() => {
		frameId = requestAnimationFrame(updateGraph);

		// Update the target value every frame for smooth transitions
		const updateInterval = setInterval(async () => {
			// lastValue = generateNewTarget(); // Update last value using the random walk method
			const res = await fetch(`http://localhost:3000/check`);
			const data = await res.json();
			lastValue = data.value;
		}, 1000);

		return () => {
			cancelAnimationFrame(frameId);
			clearInterval(updateInterval);
		};
	});
</script>

<div class="parent">
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	canvas {
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 0;
		display: block;
	}

	.parent {
		width: 100vw;
		height: 100vh;
		margin: 0%;
		padding: 0;
	}
</style>
