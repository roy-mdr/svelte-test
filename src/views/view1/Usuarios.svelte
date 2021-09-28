<script>

	/* imports */
	import { createEventDispatcher } from 'svelte';
	import Modal from '../../components/Modal.svelte';

	let emphasisColor = "var(--emphasis)";
	


	/* emitters */
	const dispatch = createEventDispatcher();

	function emitSave() {
		dispatch('save', apiDataStaff);
	}
	
	function emitClose() {
		dispatch('close');
	}

	function emitSaveAndClose() {
		emitSave();
		emitClose();
	}



	/* props */
	export let editingDate;
	export let apiDataStaff;



	/* computed */
	$: date = editingDate.date;
	$: staff = apiDataStaff[date]?.staff || {};



	function toggleStaffAttendance(staffInfo) {

		const member = apiDataStaff[staffInfo.date]?.staff[staffInfo.name];

		if (member === undefined) {

			// register day and member
			
			if (apiDataStaff[staffInfo.date] === undefined) {
				apiDataStaff[staffInfo.date] = {
					date_registered: true,
					date_rest: false,
					staff: {}
				}
			}

			if (apiDataStaff[staffInfo.date].staff[staffInfo.name] === undefined) {
				apiDataStaff[staffInfo.date].staff[staffInfo.name] = {
					type: apiDataStaff.last.staff[staffInfo.name].type,
					active: true,
					attended: true,
					details: {}
				}
			}
			
		} else {
			switch (member.attended) {
				case true:
					member.attended = false;
					break;
			
				case false:
					member.attended = null;
					break;
					
				default:
					member.attended = true;
					break;
			}
		}
		

		apiDataStaff = apiDataStaff;

		emitSave();

	}

</script>

<Modal
	modalColor="{emphasisColor}"
	on:closeModal={emitSaveAndClose}
>
	
	<div class="card-editor" style="color: {emphasisColor}">
		Asistencias: {date}
	</div>

        <div class="card-seccion">
            <button>Marcar dia de descanso</button>
            <button>Importar personal activo</button>
            <button>Reactivar personal registrado</button>
        </div>
		{#each Object.entries(staff) as [memberName, member], memberIndex }
			<div class="card-seccion">
				<div
					class="customito"
					class:did="{member.attended === true}"
					class:didnot="{member.attended === false}"
				>
					<div
					class="customito_identity noselect"
					on:click="{ () => { toggleStaffAttendance({date: date, name: memberName}); }}"
					>
						<img src="a" alt="a" class="" />
						<div class="customito_name">
							<span class="contenido">{memberName}{memberIndex}</span>
							<span class="nota">
								{#if member.attended === true}
									Asistencia
								{:else if member.attended === false}
									Falta
								{:else}
									INDICAR
								{/if}
							</span>
						</div>
					</div>
					{#if member.attended === true || member.attended === false}
						<button type="button">Detail</button>
					{/if}
				</div>
			</div>
		{/each}

	<div class="card-action_buttons">
		<button type="button" class="aceptar" on:click={emitSaveAndClose}>ACEPTAR</button>
	</div>
</Modal>

<style>
	.customito {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.2);
		padding: 0.5em;
		transition: all 0.25s;
		cursor: pointer;
		border-left: 0 solid transparent;
	}
	.customito:hover {
		box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.2);
	}
	
	.customito.did {
		border-left: 5px solid var(--emphasis);
	}
	
	.customito.didnot {
		border-left: 5px solid var(--red);
	}
	
	.customito .customito_identity {
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-grow: 1;
	}
	
	.customito .customito_identity * {
		cursor: pointer;
	}

	.customito .customito_identity img {
		width: 20px;
		height: 20px;
	}

	.customito .customito_identity > * {
		margin-right: 0.5em;
	}

	.customito .customito_identity .customito_name {
		display: flex;
		flex-direction: column;
	}

	.customito > button {
		margin: 0.5em;
	}
</style>