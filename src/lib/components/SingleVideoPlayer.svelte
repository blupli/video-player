<script lang="ts">
	import { formatSeconds } from '$lib/utils.js';
	import ProgressBar from './ProgressBar.svelte';
	import VolumeSlider from './VolumeSlider.svelte';

	type Props = {
		src: string;
		volumeSliderId?: string;
		width?: string | number;
		height?: string | number;
		loop?: boolean;
		onVideoReady?: (videoElement: HTMLVideoElement) => void;
	};

	let {
		src,
		volumeSliderId = 'default',
		width = '100%',
		height = '100%',
		loop = true,
		onVideoReady
	}: Props = $props();

	let videoElement: HTMLVideoElement | null = $state(null);

	let currentTime = $state(0);
	let duration = $state(0);
	let paused = $state(true);

	let volume = $state(0.5);

	let lastMouseMovedAt = $state(Date.now());

	let controlsHidden = $state(false);

	$effect(() => {
		currentTime;
		controlsHidden = Date.now() - lastMouseMovedAt > 2000;
	});

	$effect(() => {
		if (videoElement) {
			onVideoReady?.(videoElement);
		}
	});
</script>

<div
	class="video-player"
	style:--width={typeof width === 'number' ? `${width}px` : width}
	style:--height={typeof height === 'number' ? `${height}px` : height}
	onmousemove={() => (lastMouseMovedAt = Date.now())}
	onpointermove={() => (lastMouseMovedAt = Date.now())}
	onpointerdown={() => (lastMouseMovedAt = Date.now())}
	role="application"
>
	<video
		class="source-video"
		bind:this={videoElement}
		bind:currentTime
		bind:duration
		bind:paused
		{loop}
		{src}
		{volume}
		autoplay
		onclick={() => {
			paused = !paused;
		}}
	>
		<track kind="captions" src="captions.vtt" srclang="en" label="English" />
	</video>
	<div class="controls">
		<div class="content" class:hidden={controlsHidden}>
			<button
				class="play-pause"
				onclick={() => {
					paused = !paused;
				}}
			>
				{#if paused}
					<div class="play icon">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
							><path
								fill="currentColor"
								d="M19.376 12.4161L8.77735 19.4818C8.54759 19.635 8.23715 19.5729 8.08397 19.3432C8.02922 19.261 8 19.1645 8 19.0658V4.93433C8 4.65818 8.22386 4.43433 8.5 4.43433C8.59871 4.43433 8.69522 4.46355 8.77735 4.5183L19.376 11.584C19.6057 11.7372 19.6678 12.0477 19.5146 12.2774C19.478 12.3323 19.4309 12.3795 19.376 12.4161Z"
							></path></svg
						>
					</div>
				{:else}
					<div class="pause icon">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
							><path fill="currentColor" d="M6 5H8V19H6V5ZM16 5H18V19H16V5Z"></path></svg
						>
					</div>
				{/if}
			</button>
			<div class="volume-slider">
				<VolumeSlider
					id={volumeSliderId}
					onInput={(e) => {
						volume = e.muted ? 0 : e.volume;
					}}
				/>
			</div>
			<div class="progress-bar">
				<ProgressBar
					progress={currentTime / duration}
					maxWidth="100%"
					onSeek={(percentage) => {
						if (videoElement) videoElement.currentTime = videoElement.duration * percentage;
					}}
				/>
			</div>
			<div class="time">
				<div class="part">
					{formatSeconds(currentTime)}
				</div>
				<div class="slash">/</div>
				<div class="part">
					{formatSeconds(duration)}
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.video-player {
		position: relative;
		width: var(--width);
		height: var(--height);
		overflow: hidden;

		.source-video {
			position: absolute;
			z-index: 1;
			width: var(--width);
			height: var(--height);
			object-fit: cover;
			top: 0;
			left: 0;
		}

		.controls {
			position: absolute;
			z-index: 2;
			width: var(--width);
			height: var(--height);
			top: 0;
			left: 0;
			display: flex;
			align-items: flex-end;
			padding: 1rem;
			pointer-events: none;

			& > .content {
				width: 100%;
				display: flex;
				align-items: center;
				gap: 0.5rem;
				pointer-events: all;

				transition: opacity 100ms ease-in-out;

				&.hidden {
					opacity: 0;
					pointer-events: none;
				}

				& > .play-pause {
					display: flex;
					align-items: center;
					justify-content: center;
					cursor: pointer;
					width: 2rem;
					min-width: 2rem;
					height: 2rem;
					background-color: rgba(255, 255, 255, 0.05);
					border-radius: 0.25rem;
					border: none;
					color: white;
					transition: all 100ms ease-in-out;

					&:hover {
						background-color: rgba(255, 255, 255, 0.2);
					}

					&:hover {
						scale: 1.05;
					}

					&:active {
						scale: 0.95;
					}

					svg {
						width: 1.5rem;
					}
				}

				& > .progress-bar {
					display: flex;
					width: 100%;
				}

				& > .time {
					width: 8rem;
					color: whitesmoke;
					font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial,
						sans-serif;
					display: flex;
					gap: 0.25rem;
					justify-content: center;

					& > .slash {
						opacity: 0.75;
					}
				}
			}
		}
	}
</style>
