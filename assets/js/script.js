var nome;
var cognome;
var addBtn;
var elencoHTML;
var errore;
var erroreElenco;
var elenco = [];
var sovrascrivi;


window.addEventListener('DOMContentLoaded', init);

function init() {
	nome = document.getElementById('nome');
	cognome = document.getElementById('cognome');
	addBtn = document.getElementById('scrivi');
	elencoHTML = document.getElementById('elenco');
	errore = document.getElementById('errore');
	erroreElenco = document.getElementById('erroreElenco');
	printData();
	eventHandler();
}

function eventHandler() {
	addBtn.addEventListener('click', function () {
		if (sovrascrivi) {
			overwrite(sovrascrivi);
		} else {
			controlla();
		}
	});
}

function printData() {
	fetch('http://localhost:3000/elenco')
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			elenco = data;
			if (elenco.length > 0) {
				errore.innerHTML = '';
				elencoHTML.innerHTML = '';
				elenco.map(function (element) {
					elencoHTML.innerHTML += `<li><button type="button" class="btn btn-danger me-1" onClick="elimina(${element.id})">X</button>${element.nome} ${element.cognome}<button type="button" class="btn btn-outline-success ms-1 me-2" onClick="modifica(${element.id})"><i class="bi bi-pencil-fill"></i>Modifica</button></li>`;
				});
			} else {
				erroreElenco.innerHTML = 'Nessun elemento presente in elenco';
			}
		});
}

async function elimina(i) {
	richiesta = window.confirm('Sei sicuro di voler cancellare? Questa azione è irreversibile!');
	if (richiesta) {
		return fetch('http://localhost:3000/elenco/' + i, {
			method: 'DELETE'
		});
	}
}


function controlla() {
	if (nome.value != '' && cognome.value != '') {
		var data = {
			nome: nome.value,
			cognome: cognome.value,
		};
		addData(data);
	} else {
		errore.innerHTML = 'Compilare correttamente i campi!';
		return;
	}
}

async function addData(data) {
	let response = await fetch('http://localhost:3000/elenco', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify(data),
	});
	clearForm();
}

function clearForm() {
	nome.value = '';
	cognome.value = '';
}
//------------------------------------------------------------

function modifica(i) {
	fetch('http://localhost:3000/elenco/' + i)
	.then((response) => {
		return response.json();
	})
	.then((data) => {
		nome.value = data.nome;
		cognome.value = data.cognome;
		date.value = data.date;
	});
	
	return sovrascrivi = i;
}

function overwrite(i) {
	if (nome.value && cognome.value) {
	fetch('http://localhost:3000/elenco/' + i, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({
			"nome": nome.value,
			"cognome": cognome.value,

		}),
	});
	clearForm();
	} else {
		errore.innerHTML = 'Compilare correttamente i campi!';
		return;
	}
}