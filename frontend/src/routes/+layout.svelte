<script lang="ts">
	let { children } = $props();
</script>

<style>
	#title {
		text-align: center;
		top: 0;
		font-family: 'Times New Roman', Times, serif;
		font-size: 50px;
	}
</style>

<div id='title'>Brew & Bolt</div>

{@render children()}
