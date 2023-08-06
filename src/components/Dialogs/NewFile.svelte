<script>
	let dialog;

	setTimeout(() => {
		// dialog.showModal();
		// dialog.show()
	}, 1000);
</script>

<dialog bind:this={dialog}>
	<h1>new</h1>
	<hr />
	<button>square</button>
	<button>NxN square</button>
	<button>rectangle</button>
	<button>regular polygon</button>
</dialog>

<style>
h1 {
	font-size: 2rem;
}
dialog::backdrop {
	background: linear-gradient(rgba(0,0,0,0.0), rgba(0,0,0,1));
}
</style>