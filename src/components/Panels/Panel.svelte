<div class="container">

	<div class="title">
		<slot name="title">
			<span class="missing">Panel</span>
		</slot>
	</div>

	<div class="body">
		<slot name="body" />
	</div>
</div>

<style>
	.container {
		margin: 0.5rem;
	}
	.title {
		padding: 0.25rem 0.5rem;
		background-color: var(--background-3);
		font-weight: bold;
	}
	.body {
		padding: 0.25rem 0.5rem;
		background-color: var(--background-2);
	}
</style>
