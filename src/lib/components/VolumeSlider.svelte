<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	type Props = {
		volume?: number;
		muted?: boolean;
		id?: string;
		small?: boolean;
		onInput?({ volume, muted }: { volume: number; muted: boolean }): void;
	};

	let {
		volume = $bindable(0.5),
		muted = $bindable(false),
		id = 'default',
		small = false,
		onInput
	}: Props = $props();

	let containerElm: HTMLDivElement;

	let visible = $state(false);

	function toggleMute() {
		muted = !muted;
		emitOnInput();
	}

	function emitOnInput() {
		localStorage.setItem(`BlupliVolumeSlider:${id}`, JSON.stringify({ volume, muted }));
		onInput?.({ volume, muted });
	}

	function onDocumentMove(e: MouseEvent) {
		if (!containerElm.contains(e.target as Node)) {
			visible = false;
		}
	}

	onMount(() => {
		if (browser) {
			const saved = localStorage.getItem(`BlupliVolumeSlider:${id}`);
			if (saved) {
				const { volume: savedVolume, muted: savedMuted } = JSON.parse(saved);
				volume = savedVolume;
				muted = savedMuted;
			}
			emitOnInput();
		}
	});
</script>

<svelte:document onmousemove={onDocumentMove} />

<div bind:this={containerElm} class="container" class:hovered={visible} class:small>
	<div class="volume-bar" class:visible>
		<input
			type="range"
			min="0"
			max="1"
			step="0.01"
			bind:value={volume}
			oninput={() => {
				muted = volume === 0;
				emitOnInput();
			}}
		/>
	</div>
	<button
		class="icon"
		onclick={() => toggleMute()}
		onmouseenter={() => {
			visible = true;
		}}
	>
		<!-- All used icons from: https://remixicon.com/ -->
		{#if !muted}
			{#if volume >= 0.5}
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
					><path
						fill="currentColor"
						d="M2 16.0001H5.88889L11.1834 20.3319C11.2727 20.405 11.3846 20.4449 11.5 20.4449C11.7761 20.4449 12 20.2211 12 19.9449V4.05519C12 3.93977 11.9601 3.8279 11.887 3.73857C11.7121 3.52485 11.3971 3.49335 11.1834 3.66821L5.88889 8.00007H2C1.44772 8.00007 1 8.44778 1 9.00007V15.0001C1 15.5524 1.44772 16.0001 2 16.0001ZM23 12C23 15.292 21.5539 18.2463 19.2622 20.2622L17.8445 18.8444C19.7758 17.1937 21 14.7398 21 12C21 9.26016 19.7758 6.80629 17.8445 5.15557L19.2622 3.73779C21.5539 5.75368 23 8.70795 23 12ZM18 12C18 10.0883 17.106 8.38548 15.7133 7.28673L14.2842 8.71584C15.3213 9.43855 16 10.64 16 12C16 13.36 15.3213 14.5614 14.2842 15.2841L15.7133 16.7132C17.106 15.6145 18 13.9116 18 12Z"
					></path></svg
				>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
					><path
						fill="currentColor"
						d="M8.88889 16.0001H5C4.44772 16.0001 4 15.5524 4 15.0001V9.00007C4 8.44778 4.44772 8.00007 5 8.00007H8.88889L14.1834 3.66821C14.3971 3.49335 14.7121 3.52485 14.887 3.73857C14.9601 3.8279 15 3.93977 15 4.05519V19.9449C15 20.2211 14.7761 20.4449 14.5 20.4449C14.3846 20.4449 14.2727 20.405 14.1834 20.3319L8.88889 16.0001ZM18.8631 16.5911L17.4411 15.1691C18.3892 14.4376 19 13.2902 19 12.0001C19 10.5697 18.2493 9.31476 17.1203 8.60766L18.5589 7.16906C20.0396 8.26166 21 10.0187 21 12.0001C21 13.8422 20.1698 15.4905 18.8631 16.5911Z"
					></path></svg
				>
			{/if}
		{:else}
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
				><path
					fill="currentColor"
					d="M5.88889 16.0001H2C1.44772 16.0001 1 15.5524 1 15.0001V9.00007C1 8.44778 1.44772 8.00007 2 8.00007H5.88889L11.1834 3.66821C11.3971 3.49335 11.7121 3.52485 11.887 3.73857C11.9601 3.8279 12 3.93977 12 4.05519V19.9449C12 20.2211 11.7761 20.4449 11.5 20.4449C11.3846 20.4449 11.2727 20.405 11.1834 20.3319L5.88889 16.0001ZM20.4142 12.0001L23.9497 15.5356L22.5355 16.9498L19 13.4143L15.4645 16.9498L14.0503 15.5356L17.5858 12.0001L14.0503 8.46454L15.4645 7.05032L19 10.5859L22.5355 7.05032L23.9497 8.46454L20.4142 12.0001Z"
				></path></svg
			>
		{/if}
	</button>
</div>

<style lang="scss">
	.container {
		display: flex;
		position: relative;

		& > .icon {
			font-size: 1rem;
			cursor: pointer;
			width: 2rem;
			height: 2rem;
			border-radius: 50%;
			background-color: rgba(255, 255, 255, 0.1);
			display: flex;
			align-items: center;
			justify-content: center;
			border: none;
			color: white;
			transition: border-radius 100ms ease-in-out;

			&:hover {
				background-color: rgba(255, 255, 255, 0.2);
			}
		}

		& > .volume-bar {
			position: absolute;
			bottom: 2rem;
			writing-mode: vertical-rl;
			left: 50%;
			translate: -50% 50%;
			opacity: 0;
			pointer-events: none;
			transition: all 100ms ease-in-out;
			background-color: rgba(255, 255, 255, 0.1);
			padding: 0.5rem 0;
			width: 2rem;
			display: flex;
			align-items: center;
			justify-content: center;

			border-radius: 999px;

			&.visible {
				opacity: 1;
				pointer-events: all;
				translate: -50% 0%;
			}

			input[type='range'] {
				height: 6rem;
				rotate: 180deg;
				accent-color: white;
				cursor: grab;
			}
		}

		&.small {
			& > .icon {
				width: 1.5rem;
				height: 1.5rem;

				svg {
					width: 0.75rem;
					height: 0.75rem;
				}
			}

			& > .volume-bar {
				bottom: 1.5rem;
				padding: 0.25rem 0;
				width: 1.5rem;

				input[type='range'] {
					height: 4rem;
				}
			}
		}

		&.hovered {
			& > .icon {
				border-top-left-radius: 0px;
				border-top-right-radius: 0px;
			}

			& > .volume-bar {
				border-bottom-left-radius: 0px;
				border-bottom-right-radius: 0px;
			}
		}

		@media (max-width: 768px) {
			& > .volume-bar {
				display: none;
			}

			& > .icon {
				border-radius: 50% !important;
				width: 30px;
				height: 30px;

				svg {
					width: 14px;
					height: 14px;
				}
			}
		}
	}
</style>
