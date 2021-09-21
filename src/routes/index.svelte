<script context="module">
	export const prerender = true;
</script>

<script>
	import { onMount } from "svelte";

	onMount(() => {
		// check local storage
		// initial data
		console.log("HELLO");
	});
</script>

<svelte:head>
	<title>NASA Images</title>
</svelte:head>

<div class="main-container">
	<main>
		<h1>NASA to the Moon!</h1>

		<div
			class="nasa-cards-feed"
			role="feed"
			aria-busy="ISLOADING"
			aria-labelledby="cards-heading"
		>
			<h2 id="cards-heading">Cards Title</h2>

			<article
				id="nasa-card-INDEX"
				class="nasa-card"
				tabIndex="0"
				aria-posinset="INDEX+1"
				aria-setsize="TOTAL_CARDS"
				aria-labelledby="card-INDEX-heading"
				aria-describedby="IMG_ALT"
			>
				<h3 id="card-INDEX-heading">Card Title</h3>
				<p>Card subtitle</p>

				<img src="SRC" alt="ALT" />

				<h4>Description Title</h4>

				<p>Date</p>

				<p>Description</p>

				<button type="button">
					<span>visually hidden "like image"</span>
					<span>like icon</span>
				</button>
			</article>
		</div>
	</main>

	<footer>
		<p>Built with NASA by Alberto Preciado</p>
	</footer>
</div>

<style>
	.main-container {
		min-height: 100vh;
		padding: 0 0.5rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: stretch;
	}

	main {
		padding: 0.5rem 0;
	}

	footer {
		flex-shrink: 0;
		width: 100%;
		height: 75px;
		border-top: 1px solid #eaeaea;
		display: flex;
		justify-content: center;
		align-items: center;
	}

  .nasa-card {
    border: 1px solid #eaeaea;
    border-radius: 10px;
  }
</style>
