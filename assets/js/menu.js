document.addEventListener('DOMContentLoaded', () => {

    //ATRAS
    const btnAtras = document.getElementById('btn-atras');
    btnAtras.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    const nivel_0 = document.getElementById('nivel_0');
    nivel_0.addEventListener('click', () => {
        window.location.href = 'nivel_0.html';
    });

    const nivel_1 = document.getElementById('nivel_1');
    nivel_1.addEventListener('click', () => {
        window.location.href = 'nivel_1.html';
    });

    const nivel_2 = document.getElementById('nivel_2');
    nivel_2.addEventListener('click', () => {
        window.location.href = 'nivel_2.html';
    });

    const nivel_3 = document.getElementById('nivel_3');
    nivel_3.addEventListener('click', () => {
        window.location.href = 'nivel_3.html';
    });

    const retroalimentacion = document.getElementById('retroalimentacion');
    retroalimentacion.addEventListener('click', () => {
        window.location.href = 'retroalimentacion.html';
    });

    // 2. Interacción al hacer clic en cada nivel/personaje
    const tarjetasNivel = document.querySelectorAll('.node-card');
    const modal = document.getElementById('modal-nivel');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalDescripcion = document.getElementById('modal-descripcion');
    const btnCerrar = document.getElementById('cerrar-modal');
    const btnEntrar = document.getElementById('btn-entrar-nivel');

    tarjetasNivel.forEach(tarjeta => {
        tarjeta.addEventListener('click', () => {
            // Toma la info guardada en el HTML de cada tarjeta
            const titulo = tarjeta.getAttribute('data-titulo');
            const descripcion = tarjeta.getAttribute('data-desc');

            modalTitulo.textContent = titulo;
            modalDescripcion.textContent = descripcion;
            modal.classList.remove('hidden');
        });
    });

});