<script lang="ts">
	import { onMount, type Snippet } from 'svelte';

	type Props = {
		videos: {
			src: string;
			title: string;
			description: string;
		}[];
		selectedVideoIndex?: number;
		volume?: number;

		onVideoReady?: (videoElement: HTMLVideoElement) => void;
		children?: Snippet<[]>;

		width: string | number;
		height: string | number;
		background?: string;
	};

	let {
		videos,
		selectedVideoIndex = $bindable(0),
		volume = $bindable(0.5),
		onVideoReady,
		children,
		width,
		height,
		background = 'black'
	}: Props = $props();

	let selectedVideo = $derived(videos[selectedVideoIndex]);

	let videoElement: HTMLVideoElement | null = $state(null);

	function modifyVideoIndex(offset: number) {
		selectedVideoIndex = (selectedVideoIndex + offset) % videos.length;
	}

	function onVideoEnded() {
		modifyVideoIndex(1);
	}

	onMount(() => {
		if (videoElement && onVideoReady) onVideoReady(videoElement);
	});
</script>

<div
	class="video-container"
	style:--width={typeof width === 'number' ? `${width}px` : width}
	style:--height={typeof height === 'number' ? `${height}px` : height}
	style:background
>
	{#if selectedVideo}
		<video
			class="source-video"
			bind:this={videoElement}
			src={selectedVideo.src}
			{volume}
			onended={onVideoEnded}
			autoplay
		>
			<track kind="captions" src="captions.vtt" srclang="en" label="English" />
		</video>
	{/if}
	<div class="gradient-overlay">
    <div class="content">
      {#if children}
        {@render children()}
      {:else}
        <h1>{selectedVideo.title}</h1>
      {/if}
    </div>
    <div class="controls">

    </div>
  </div>
</div>

<style lang="scss">
	.video-container {
		position: relative;
		width: var(--width);
		height: var(--height);
		background-color: black;

		& > .source-video,
		& > .gradient-overlay {
			position: absolute;
			width: var(--width);
			height: var(--height);
			inset: 0;
		}

		& > .source-video {
			z-index: 1;
			object-fit: contain;
		}

		& > .gradient-overlay {
			z-index: 2;
			background: linear-gradient(
				180deg,
				rgba(0, 0, 0, 0.75),
				rgba(0, 0, 0, 0.25),
				rgba(0, 0, 0, 0),
				rgba(0, 0, 0, 0.25),
				rgba(0, 0, 0, 0.75)
			);
		}
	}
</style>
