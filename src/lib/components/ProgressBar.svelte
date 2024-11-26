<script lang="ts">
	type Props = {
		progress: number;
		seekable?: boolean;
		onSeek?: (percentage: number) => void;
		maxWidth?: string | number;
	};

	let { progress = $bindable(0), seekable = true, onSeek, maxWidth = '100%' }: Props = $props();

	let progressBarElement: HTMLButtonElement | null = $state(null);

	function onProgressBarClick(e: MouseEvent) {
		if (!progressBarElement || !seekable) return;
		const rect = progressBarElement.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const width = rect.width;
		const percentage = x / width;
		progress = percentage;
		onSeek?.(percentage);
	}
</script>

<button
	class="progress-bar"
	bind:this={progressBarElement}
	onclick={onProgressBarClick}
	aria-label="Seek video"
	style="max-width: {typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth}"
>
	<div class="progress" style:width="{(progress * 100).toFixed(2)}%"></div>
</button>

<style lang="scss">
	.progress-bar {
		display: flex;
		border-radius: 9999px;
		height: 0.75rem;
		background-color: rgba(255, 255, 255, 0.25);
		width: 100%;
		border: none;

		& > .progress {
			height: 0.75rem;
			border-radius: 9999px;
			background-color: rgba(255, 255, 255, 0.95);
		}
	}
</style>
