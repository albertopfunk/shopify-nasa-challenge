<script context="module">
	export const prerender = true;
</script>

<script>
	import { onMount } from "svelte";

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

	// INITAL
	// need to reverse array and add isLiked to each
	// add to local storage

	// LOAD MORE
	// load next page
	// remove last index
	// reverse
	// add isLiked
	// update local sorage
	// update page

	// LOCAL STORAGE
	// do not need to reverse array or add isLiked
	// need to split array to only show page 1

	// LOAD MORE
	// check if next page is available
	// if not then LOAD MORE INITIAL
	// if yes, then split based on page
	// update page

	//

	// local storages - page, feedCards

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
		const key = import.meta.env.VITE_NASA_KEY;
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

		// add 0 to dates for API
		let normalizedStartMonth = startMonth;
		if (startMonth < 10) {
			normalizedStartMonth = `0${startMonth}`;
		}

		let normalizedEndMonth = endMonth;
		if (endMonth < 10) {
			normalizedEndMonth = `0${endMonth}`;
		}

		const key = import.meta.env.VITE_NASA_KEY;
		const response = await fetch(
			`https://api.nasa.gov/planetary/apod?start_date=${startYear}-${normalizedStartMonth}-01&end_date=${endYear}-${normalizedEndMonth}-01&api_key=${key}`
		);
		const updatedResponse = await response.json();

		// normalize cards
		updatedResponse.pop();
		updatedResponse.forEach((card) => {
			card.isLiked = false;
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
	}
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

			<!-- inital loading or map -->

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

		<button type="button" on:click={loadMoreCards}> Load More </button>
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
