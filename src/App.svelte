<script>

	/* imports */
	import { onMount } from 'svelte';
	import './css/theme.css';
	import Table from './views/view1/Table.svelte';
	import Usuarios from './views/view1/Usuarios.svelte';

	import vigente from './data_fake.js';



	/* life cycle */
	onMount(fetchData);



	/* theme */
	let darkTheme = false;

	function toggleTheme() {
		darkTheme = !darkTheme;
	}
	
	

	/* fetch data */
	let getPersonal = new Promise( ()=>{} );

	function fetchData() {
		setTimeout( () => {
			getPersonal = Promise.resolve(vigente);
		} , 1500);
	}


	function saveUsuarios(event) {
		getPersonal.then( (res) => {
			res.staff = event.detail;
			getPersonal = Promise.resolve(res);
		} )
	}



	/* modal usuarios */
	let modalUsuarios = false;

	function openUsuarios() {
		modalUsuarios = true;
	}

	function closeUsuarios() {
		modalUsuarios = false;
	}

</script>

<div id="app" class={darkTheme ? "dark-theme" : "light-theme"}>

	<button on:click={toggleTheme}>
		{#if darkTheme}
		Light Theme
		{:else}
		Dark Theme
		{/if}
	</button>
	<button disabled="disabled">Marcar dia de descanso</button>
	<button on:click={openUsuarios}>Open Usuarios</button>

	<Table {getPersonal}/>

	{#if modalUsuarios}
	<Usuarios
		{getPersonal}
		on:save={saveUsuarios}
		on:close={closeUsuarios}
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