<script context="module">
	export const prerender = true;
</script>

<script>
	import { onMount } from "svelte";
	import { VITE_NASA_KEY } from "$lib/Env.js";
	import LikeIcon from "$lib/icons/LikeIcon.svelte";
	import UnlikeIcon from "$lib/icons/UnlikeIcon.svelte";
	import LoadingIcon from "$lib/icons/LoadingIcon.svelte";
	import Spacer from "$lib/Spacer.svelte";

	let initialLoading = true;
	let feedLoading = false;

	let page = 1;

	let startDate = {
		year: 2021,
		month: 8
	};

	let endDate = {
		year: 2021,
		month: 9
	};

	let feedCards;

	onMount(async () => {
		// set initial cards with local storage if available
		if (localStorage.getItem("feedCards")) {
			const initialFeedCards = JSON.parse(localStorage.getItem("feedCards"))[
				"1"
			];
			feedCards = initialFeedCards;
			initialLoading = false;
			return;
		}

		// fetch initial cards
		const InitialFeedCards = await initialFetch();

		// normalize cards
		InitialFeedCards.forEach((card) => {
			card.isLiked = false;
			card.page = 1;
		});
		InitialFeedCards.reverse();

		// set up cards and add local storage
		const normalizedFeedCards = {
			"1": InitialFeedCards
		};
		localStorage.setItem("feedCards", JSON.stringify(normalizedFeedCards));

		// set state
		feedCards = InitialFeedCards;
		initialLoading = false;
	});

	async function initialFetch() {
		const key = VITE_NASA_KEY;
		const response = await fetch(
			`https://api.nasa.gov/planetary/apod?start_date=2021-08-01&end_date=2021-09-01&api_key=${key}`
		);

		return await response.json();
	}

	async function loadMoreCards() {
		// update page and dates to fetch next cards
		let newPage = page + 1;
		let startYear = startDate.year;
		let startMonth = startDate.month;
		let endYear = endDate.year;
		let endMonth = endDate.month;

		if (startDate.month === 1) {
			startYear = startDate.year - 1;
			startMonth = 12;
		} else {
			startYear = startDate.year;
			startMonth = startMonth - 1;
		}

		if (endDate.month === 1) {
			endYear = endDate.year - 1;
			endMonth = 12;
		} else {
			endYear = endDate.year;
			endMonth = endMonth - 1;
		}

		// set with local storage if available
		if (localStorage.getItem("feedCards")) {
			const localFeedCards = JSON.parse(localStorage.getItem("feedCards"));
			if (localFeedCards[newPage]) {
				// update state
				feedCards = [...feedCards, ...localFeedCards[newPage]];
				page = newPage;
				startDate = {
					year: startYear,
					month: startMonth
				};
				endDate = {
					year: endYear,
					month: endMonth
				};
				return;
			}
		}

		// set loading
		feedLoading = true;

		// add 0 to dates for API
		let normalizedStartMonth = startMonth;
		if (startMonth < 10) {
			normalizedStartMonth = `0${startMonth}`;
		}

		let normalizedEndMonth = endMonth;
		if (endMonth < 10) {
			normalizedEndMonth = `0${endMonth}`;
		}

		const key = VITE_NASA_KEY;
		const response = await fetch(
			`https://api.nasa.gov/planetary/apod?start_date=${startYear}-${normalizedStartMonth}-01&end_date=${endYear}-${normalizedEndMonth}-01&api_key=${key}`
		);
		const updatedResponse = await response.json();

		// normalize cards
		updatedResponse.pop();
		updatedResponse.forEach((card) => {
			card.isLiked = false;
			card.page = newPage;
		});
		updatedResponse.reverse();

		// set up and update localstorage
		const localFeedCards = JSON.parse(localStorage.getItem("feedCards"));
		const updatedFeedCards = {
			...localFeedCards,
			...{ [newPage]: updatedResponse }
		};
		localStorage.setItem("feedCards", JSON.stringify(updatedFeedCards));

		// set state
		page = newPage;
		startDate = {
			year: startYear,
			month: startMonth
		};
		endDate = {
			year: endYear,
			month: endMonth
		};
		feedCards = [...feedCards, ...updatedResponse];
		feedLoading = false;
	}

	function likeCard(index, card) {
		// update state
		const newFeedCards = [...feedCards];
		newFeedCards[index].isLiked = !newFeedCards[index].isLiked;
		feedCards = newFeedCards;

		// update local storage
		const localFeedCards = JSON.parse(localStorage.getItem("feedCards"));

		localFeedCards[card.page].forEach((item) => {
			if (newFeedCards[index].date === item.date) {
				item.isLiked = !item.isLiked;
			}
		});

		const updatedFeedCards = {
			...localFeedCards,
			...{ [card.page]: localFeedCards[card.page] }
		};

		localStorage.setItem("feedCards", JSON.stringify(updatedFeedCards));
	}
</script>

<svelte:head>
	<title>NASA Images</title>
</svelte:head>

<div class="main-container">
	<main>
		<h1>NASA Photography</h1>
		<Spacer size="xlg" />
		<div
			class="nasa-cards-feed"
			role="feed"
			aria-busy={initialLoading || feedLoading}
			aria-labelledby="cards-heading"
		>
			<h2 id="cards-heading">NASA's Astronomy Photos of the Day</h2>
			<Spacer size="md" />
			<div class="nasa-cards-grid">
				{#if initialLoading}
					<p class="visually-hidden">loading</p>
					<LoadingIcon lg />
				{:else}
					{#each feedCards as feedCard, index}
						<article
							id={`nasa-card-${index}`}
							class="nasa-card"
							tabIndex="0"
							aria-posinset={`${index + 1}`}
							aria-setsize={feedCards.length}
							aria-labelledby={`card-${index}-heading`}
							aria-describedby={`card-${index}-description`}
						>
							<div class="nasa-card-image">
								<img id={`card-${index}-image`} src={feedCard.url} alt="" />
							</div>

							<div class="nasa-card-content">
								<Spacer size="md" />
								<h3 id={`card-${index}-heading`}>
									{feedCard.title}
								</h3>
								<Spacer size="xsm" />
								<p>{feedCard.date}</p>
								<Spacer size="sm" />
								<p id={`card-${index}-description`}>{feedCard.explanation}</p>
								<Spacer size="md" />
								<button
									type="button"
									on:click={() => likeCard(index, feedCard)}
								>
									{#if feedCard.isLiked}
										<span class="visually-hidden">unlike photo</span>
										<LikeIcon />
									{:else}
										<span class="visually-hidden">like photo</span>
										<UnlikeIcon />
									{/if}
								</button>
							</div>
						</article>
					{/each}
				{/if}
			</div>
			<Spacer size="xlg" />
			<button
				class="load-more-button"
				disabled={initialLoading || feedLoading}
				type="button"
				on:click={loadMoreCards}
			>
				{#if feedLoading}
					<span> Loading </span>
					<span>
						<LoadingIcon />
					</span>
				{:else}
					Load More
				{/if}
			</button>
			<Spacer size="xlg" />
		</div>
	</main>

	<footer>
		<p>Built by Alberto Preciado</p>

		<a
			href="https://github.com/albertopfunk/shopify-nasa-challenge"
			target="_blank"
			rel="noreferrer"
			>Visit Project Repo <span class="visually-hidden">opens in new tab</span
			></a
		>
	</footer>
</div>

<style>
	.main-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: stretch;
		text-align: center;
	}

	main {
		padding: 0.5rem 0;
	}

	footer {
		flex-shrink: 0;
		width: 100%;
		height: 75px;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		border-top: 1px solid #eaeaea;
	}

	.load-more-button {
		width: 100%;
		max-width: 200px;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 5px;
		background-color: transparent;
		padding: 7px;
		margin: 0 auto;
		border: 3px solid black;
	}

	.nasa-cards-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(600px, 100%), 1fr));
		justify-items: center;
		align-items: start;
		grid-gap: 50px;
	}

	.nasa-card {
		max-width: 850px;
		border-radius: 10px;
	}

	.nasa-card-image {
		display: flex;
		justify-content: center;
	}

	.nasa-card-content {
		padding: 0 10px;
		border: 1px solid #eaeaea;
		border-top: none;
	}

	.nasa-card-content p {
		max-width: 750px;
		margin: 0 auto;
		line-height: 1.5;
	}

	.nasa-card-content button {
		height: 45px;
		width: 45px;
		display: flex;
		background-color: transparent;
		padding: 3px;
		border: none;
		border-radius: 10px;
	}
</style>
