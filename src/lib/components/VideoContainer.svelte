<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import VolumeSlider from './VolumeSlider.svelte';

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
	let progressBarElement: HTMLButtonElement | null = $state(null);

	let currentTime = $state(0);
	let duration = $state(0);

	function modifyVideoIndex(offset: number) {
		selectedVideoIndex = (selectedVideoIndex + offset) % videos.length;

		if (offset > 0) {
			const nextContentButton = document.querySelector('.next-content');
			if (nextContentButton) {
				nextContentButton.classList.add('active');
				setTimeout(() => {
					nextContentButton.classList.remove('active');
				}, 100);
			}
		} else {
			const prevContentButton = document.querySelector('.prev-content');
			if (prevContentButton) {
				prevContentButton.classList.add('active');
				setTimeout(() => {
					prevContentButton.classList.remove('active');
				}, 100);
			}
		}
	}

	function onVideoEnded() {
		modifyVideoIndex(1);
	}

	function onProgressBarClick(e: MouseEvent) {
		if (!videoElement || !progressBarElement) return;
		const rect = progressBarElement.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const width = rect.width;
		const percentage = x / width;
		videoElement.currentTime = videoElement.duration * percentage;
	}

	async function tryToPlay() {
		if (videoElement && selectedVideo) {
			await videoElement.play().catch(() => {});
			setTimeout(() => {
				if (!videoElement?.paused) return;
				tryToPlay();
			}, 100);
		}
	}

	$effect(() => {
		if (videoElement) {
			onVideoReady?.(videoElement);
			tryToPlay();
		}
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
			bind:currentTime
			bind:duration
			src={selectedVideo.src}
			{volume}
			onended={onVideoEnded}
			autoplay
		>
			<track kind="captions" src="captions.vtt" srclang="en" label="English" />
		</video>
		<div class="gradient-overlay">
			<div class="content">
				{#if children}
					{@render children()}
				{:else}
					<h1 class="title">{selectedVideo.title}</h1>
				{/if}
			</div>
			<div class="controls">
				<div class="start buttons">
					<button
						class="button prev-content"
						onclick={() => {
							modifyVideoIndex(-1);
						}}
						aria-label="Previous video"
						tabindex="-1"
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
							><path
								fill="currentColor"
								d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"
							></path></svg
						>
					</button>
					<button
						class="button next-content"
						onclick={() => {
							modifyVideoIndex(1);
						}}
						aria-label="Next video"
						tabindex="-2"
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
							><path
								fill="currentColor"
								d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"
							></path></svg
						>
					</button>
				</div>
				<div class="center">
					<VolumeSlider
						onInput={(e) => {
							volume = e.muted ? 0 : e.volume;
						}}
					/>
					<button
						class="progress-bar"
						bind:this={progressBarElement}
						onclick={onProgressBarClick}
						aria-label="Seek video"
					>
						<div
							class="progress"
							style:width="{((currentTime / duration) * 100).toFixed(2)}%"
						></div>
					</button>
				</div>
				<div class="info">
					{selectedVideo.description}
				</div>
			</div>
		</div>
	{/if}
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
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding: 1rem;

			& > .content {
				display: flex;
				width: 100%;
				& > .title {
					font-size: 2rem;
					margin: 0;
					color: white;
					font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial,
						sans-serif;

					@media (max-width: 768px) {
						font-size: 1.5rem;
					}
				}
			}

			& > .controls {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 1rem;

				& > .buttons {
					display: flex;
					gap: 0.5rem;

					& > .button {
						display: flex;
						align-items: center;
						justify-content: center;
						cursor: pointer;
						width: 3rem;
						height: 3rem;
						background-color: rgba(255, 255, 255, 0.05);
						border-radius: 0.25rem;
						border: none;
						color: white;
						transition: all 100ms ease-in-out;

						&:hover {
							background-color: rgba(255, 255, 255, 0.2);
						}

						&:hover,
						&.hovered {
							scale: 1.05;
						}

						&:active,
						&.active {
							scale: 0.95;
						}

						svg {
							width: 2rem;
						}
					}
				}

				& > .center {
					display: flex;
					width: 100%;
					justify-content: center;
					align-items: center;
					gap: 1rem;

					& > .progress-bar {
						display: flex;
						border-radius: 9999px;
						height: 0.75rem;
						background-color: rgba(255, 255, 255, 0.25);
						max-width: 300px;
						width: 100%;
						border: none;

						& > .progress {
							height: 0.75rem;
							border-radius: 9999px;
							background-color: rgba(255, 255, 255, 0.95);
						}
					}
				}

				& > .info {
					display: flex;
					align-items: center;
					justify-content: flex-end;
					text-align: right;
					gap: 1rem;
					color: rgba(255, 255, 255, 0.75);
					font-size: 1rem;
					font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial,
						sans-serif;
				}
			}

			@media (max-width: 768px) {
				& > .content {
					& > .title {
						font-size: 24px;
					}
				}

				& > .controls {
					& > .buttons {
						gap: 8px;
						.button {
							width: 2rem;
							height: 2rem;

							svg {
								width: 20px;
							}
						}
					}

					& > .center {
						gap: 8px;
						& > .progress-bar {
							height: 8px;
							max-width: 200px;

							& > .progress {
								height: 8px;
							}
						}
					}

					& > .info {
						font-size: 0.75rem;
					}
				}
			}
		}
	}
</style>
