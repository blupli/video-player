<script>
	import VideoContainer from '$lib/components/VideoContainer.svelte';

	const videos = [
		{
			title: 'Interactive Installations',
			src: 'https://blupli.com/content/videos/home/1.mp4',
			description: 'Live Interactive Style transfer'
		},
		{
			title: 'Raves',
			src: 'https://blupli.com/content/videos/home/2.mp4',
			description: 'DJ Performance-Driven Visuals Based on Music Analysis'
		},
		{
			title: 'Concerts',
			src: 'https://blupli.com/content/videos/home/3.mp4',
			description: 'Live Lyric detection to Generative Visuals'
		},
		{
			title: 'Interactive Installations',
			src: 'https://blupli.com/content/videos/home/4.mp4',
			description: 'Live Interactive Style transfer'
		},
		{
			title: 'Concerts',
			src: 'https://blupli.com/content/videos/home/5.mp4',
			description: 'Live Lyric detection to Visuals'
		},
		{
			title: 'Conferences',
			src: 'https://blupli.com/content/videos/home/6.mp4',
			description: 'Speech Detection to Storytelling Visuals'
		}
	];
</script>

<VideoContainer width="100%" height="75vh" {videos} background="purple" volume={0} />
