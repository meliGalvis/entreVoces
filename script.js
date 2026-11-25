document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll suave al hacer clic en el botón "INICIAR"
    const btnIniciar = document.getElementById('btn-iniciar');
    const seccionNiveles = document.getElementById('seccion-niveles');

    btnIniciar.addEventListener('click', () => {
        seccionNiveles.scrollIntoView({ behavior: 'smooth' });
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

    // Cerrar modal con la X
    btnCerrar.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Cerrar modal si hacen clic fuera de la cajita
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    // Acción del botón dentro del modal (puedes cambiarlo luego por window.location.href = 'nivel0.html')
    btnEntrar.addEventListener('click', () => {
        alert(`¡Abriendo ${modalTitulo.textContent}! Aquí puedes enlazar a la siguiente página.`);
    });
});