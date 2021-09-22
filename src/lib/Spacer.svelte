<script>
	export let size = "xsm";
</script>

<span
	class:xsm={size === "xsm"}
	class:sm={size === "sm"}
	class:md={size === "md"}
	class:lg={size === "lg"}
	class:xlg={size === "xlg"}
/>

<style lang="scss">
	span {
		display: block;
	}

	.xsm {
		height: 5px;
		min-height: 5px;
	}

	.sm {
		height: 10px;
		min-height: 10px;
	}

	.md {
		height: 15px;
		min-height: 15px;
	}

	.lg {
		height: 20px;
		min-height: 20px;
	}

	.xlg {
		height: 30px;
		min-height: 30px;
	}
</style>
