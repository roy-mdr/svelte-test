<script>

	/* imports */
	import './css/theme.css';
	import Datenav from './views/view1/Datenav.svelte';
	import Table from './views/view1/Table.svelte';
	import Usuarios from './views/view1/Usuarios.svelte';
	import DateFunc from './js/DateFunc.js';



	/* theme */
	let darkTheme = false;

	function toggleTheme() {
		darkTheme = !darkTheme;
	}



	function saveUsuarios(event) {
		getPersonal.then( (res) => {
			res.staff = event.detail;
			getPersonal = Promise.resolve(res);
		} )
	}



	/* modal usuarios */
	let modalEditDay = false;
	let editingDate = '';

	function openEditDay(ev) {
		editingDate = ev.detail.date;
		modalEditDay = true;
	}

	function closeEditDay() {
		modalEditDay = false;
	}



	/* Date / fecha */
	const today = DateFunc.formatDate( new Date(Date.now() + 0*(24 * 60 * 60 * 1000)) );
	// const today = new Date(1609473219000);
	// console.log(today.getTimezoneOffset() * 60 * 1000);
	let dateSelected = '';

</script>

<div id="app" class={darkTheme ? "dark-theme" : "light-theme"}>

	<button on:click={toggleTheme}>
		{#if darkTheme}
		Light Theme
		{:else}
		Dark Theme
		{/if}
	</button>
	<button>Agregar personal</button>

	<Datenav
		{today}
		on:dateSelect={(ev) => dateSelected = ev.detail.date}
	/>

	<Table
		{today}
		{dateSelected}
		on:editDay={openEditDay}
	/>

	{#if modalEditDay}
	<Usuarios
		{editingDate}
		on:save={saveUsuarios}
		on:close={closeEditDay}
	/>
	{/if}
</div>

<style>

	:global(#app) {
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: var(--bg_main);
		padding: 1em;
		transition: background-color 0.25s cubic-bezier(.08,.82,.17,1) 0s;
	}

	button {
		color: var(--emphasis);
	}
</style>