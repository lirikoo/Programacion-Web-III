document.addEventListener('DOMContentLoaded', () => {

    const API_BASE = 'https://digimon-api.vercel.app/api/digimon';
    const API_NOMBRE = `${API_BASE}/name/`;
    const API_NIVEL = `${API_BASE}/level/`;

    const nombreInput = document.getElementById('nombreInput');
    const nivelInput = document.getElementById('nivelInput');
    
    const buscarNombreBtn = document.getElementById('buscarNombreBtn');
    const buscarNivelBtn = document.getElementById('buscarNivelBtn');
    const todosBtn = document.getElementById('todosBtn');
    
    const tableBody = document.getElementById('tableBody');

    function renderizarTabla(digimones) {
        tableBody.innerHTML = '';

        if (!Array.isArray(digimones) || digimones.length === 0) {
            let mensaje = 'No se encontraron resultados.';
            if (digimones.ErrorMsg) {
                mensaje = `Error: ${digimones.ErrorMsg}`;
            }
            tableBody.innerHTML = `<tr><td colspan="2">${mensaje}</td></tr>`;
            return;
        }

        digimones.forEach(digimon => {
            const tr = document.createElement('tr');
            
            const tdNombre = document.createElement('td');
            tdNombre.textContent = digimon.name;
            tr.appendChild(tdNombre);
            
            const tdNivel = document.createElement('td');
            tdNivel.textContent = digimon.level;
            tr.appendChild(tdNivel);
            
            tableBody.appendChild(tr);
        });
    }

    async function fetchData(url) {
        tableBody.innerHTML = `<tr><td colspan="2">Cargando...</td></tr>`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            renderizarTabla(data);
        } catch (error) {
            console.error('Error en el fetch:', error);
            tableBody.innerHTML = `<tr><td colspan="2">Error al conectar con la API.</td></tr>`;
        }
    }

    buscarNombreBtn.addEventListener('click', () => {
        const nombre = nombreInput.value.trim();
        if (nombre) {
            fetchData(API_NOMBRE + nombre);
            nivelInput.value = '';
        } else {
            alert('Ingresa un nombre.');
        }
    });

    buscarNivelBtn.addEventListener('click', () => {
        const nivel = nivelInput.value.trim();
        if (nivel) {
            fetchData(API_NIVEL + nivel);
            nombreInput.value = '';
        } else {
            alert('Ingresa un nivel.');
        }
    });

    todosBtn.addEventListener('click', () => {
        fetchData(API_BASE);
        nombreInput.value = '';
        nivelInput.value = '';
    });

});