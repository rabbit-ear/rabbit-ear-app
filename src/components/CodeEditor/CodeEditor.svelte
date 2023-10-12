<div class="container">
	<div class="row">
		<button>run</button>
	</div>
	<textarea></textarea>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}
	.row {
		flex: 0 0 2rem;
		background-color: var(--background-1);
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	textarea {
		flex: 1 1 auto;
		width: 100%;
		height: 100%;
		resize: none;
		border: none;
		color: var(--text);
		outline: none;
		outline-color: transparent;
		background-color: var(--background-0);
	}
</style>
