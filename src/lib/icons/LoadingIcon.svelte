<script>
	export let lg = false;
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 24 24"
	aria-hidden="true"
	class:lg
	><path
		d="M0 10.996A12.042 12.042 0 0 1 10.996 0v2.009c-4.737.473-8.515 4.25-8.987 8.987H0zm13.004-8.987c4.737.473 8.515 4.25 8.987 8.987H24A12.042 12.042 0 0 0 13.004 0v2.009zm-2.008 19.982c-4.737-.473-8.515-4.25-8.987-8.987H0A12.042 12.042 0 0 0 10.996 24v-2.009zm10.995-8.987c-.473 4.737-4.25 8.514-8.987 8.987V24A12.042 12.042 0 0 0 24 13.004h-2.009z"
	/></svg
>

<style>
	svg {
		height: 1rem;
		width: 1rem;
		animation: spinner 2s linear infinite;
	}
	
	.lg {
		height: 5rem;
		width: 5rem;
	}

	@keyframes spinner {
		to {
			transform: rotate(360deg);
		}
	}
</style>
