document.addEventListener('DOMContentLoaded', () => {

    const A_URL = 'https://pokeapi.co/api/v2/pokemon'; 
    const L = 20; 

    let o = 0; 

    const g = document.getElementById('gal'); 
    const bAnt = document.getElementById('ant'); 
    const bSig = document.getElementById('sig'); 
    const pagTxt = document.getElementById('p'); 
    
    const iBusq = document.getElementById('busq'); 
    const bBusq = document.getElementById('b'); 
    const bLimpiar = document.getElementById('limpiar'); 


    /**
     * @param {Array} poks - Lista de objetos Pokémon completos
     */
    function mostrarPoks(poks) {
        g.innerHTML = ''; 

        if (!poks || poks.length === 0) {
            g.innerHTML = '<p>No se encontró ningún Pokémon.</p>';
            return;
        }

        poks.forEach(p => { 
            const t = document.createElement('div'); 
            t.classList.add('tarjeta-pokemon'); 

            const imgUrl = p.sprites.front_default || 'https://via.placeholder.com/100';

            t.innerHTML = `
                <img src="${imgUrl}" alt="${p.name}">
                <p>${p.name}</p>
            `;
            g.appendChild(t);
        });
    }

    /**
     * @param {number} offset 
     */
    async function cargarP(offset) { 
        g.innerHTML = '<p>Cargando Pokémon, espera un momento...</p>'; 
        
        try {
            const resLista = await fetch(`${A_URL}?limit=${L}&offset=${offset}`);
            const datosLista = await resLista.json();

            const promesasDetalles = datosLista.results.map(pd => { 
                return fetch(pd.url).then(r => r.json()); 
            });

            const poksConDetalles = await Promise.all(promesasDetalles);

    
            mostrarPoks(poksConDetalles);

            bAnt.disabled = !datosLista.previous; 
            bSig.disabled = !datosLista.next; 

            pagTxt.textContent = `Página: ${Math.floor(offset / L) + 1}`;

        } catch (error) {
            console.error('Problema al cargar Pokémon:', error);
            g.innerHTML = `<p>¡Oops! No pudimos cargar los Pokémon. Intenta de nuevo.</p>`;
        }
    }

    /**
     * @param {string} nombre 
     */
    async function buscarP(nombre) { 
        const n = nombre.toLowerCase().trim(); 
        if (!n) {
            alert('¡Escribe un nombre para buscar!');
            return;
        }

        g.innerHTML = `<p>Buscando a ${n}...</p>`;
        
        try {
            const res = await fetch(`${A_URL}/${n}`);
            if (!res.ok) { 
                throw new Error('No encontré ese Pokémon.');
            }
            const data = await res.json(); 

            mostrarPoks([data]); 
            

            bAnt.disabled = true;
            bSig.disabled = true;
            pagTxt.textContent = `Resultado de búsqueda`;

        } catch (error) {
            console.error('Error al buscar:', error);
            g.innerHTML = `<p>¡Ay! No se encontró el Pokémon "${n}". Prueba con otro nombre.</p>`;
        }
    }



    bSig.addEventListener('click', () => {
        o += L; 
        cargarP(o);
    });

    bAnt.addEventListener('click', () => {
        if (o >= L) { 
            o -= L; 
            cargarP(o);
        }
    });

    bBusq.addEventListener('click', () => {
        buscarP(iBusq.value); 
    });
    
    iBusq.addEventListener('keypress', (e) => { 
        if (e.key === 'Enter') {
            buscarP(iBusq.value);
        }
    });

    bLimpiar.addEventListener('click', () => {
        o = 0; 
        cargarP(o);
        iBusq.value = ''; 
    });
    cargarP(o);

});