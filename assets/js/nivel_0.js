document.addEventListener('DOMContentLoaded', () => {

    //ATRAS
    const btnAtras = document.getElementById('btn-atras');
    btnAtras.addEventListener('click', () => {
        window.location.href = 'menu.html';
    });

    // Botón volver
    document.getElementById('btn-atras').addEventListener('click', () => {
        window.history.back();
    });

    // Modales
    const abrirModal = (modal) => {
        modal.classList.remove('hidden');
        document.body.classList.add('modal-abierto');
    };

    const cerrarModal = (modal) => {
        modal.classList.add('hidden');
        document.body.classList.remove('modal-abierto');
    };

    // Abrir: cada tarjeta apunta a su modal con data-modal
    document.querySelectorAll('.tema-card').forEach((card) => {
        card.addEventListener('click', () => {
            abrirModal(document.getElementById(card.dataset.modal));
        });
    });

    document.querySelectorAll('.modal').forEach((modal) => {
        // Cerrar con la X
        modal.querySelector('.close-btn').addEventListener('click', () => cerrarModal(modal));
        // Cerrar al hacer clic en el fondo oscuro
        modal.addEventListener('click', (e) => {
            if (e.target === modal) cerrarModal(modal);
        });
    });

    // Cerrar con la tecla Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal:not(.hidden)').forEach(cerrarModal);
        }
    });

});