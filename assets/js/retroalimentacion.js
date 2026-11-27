document.addEventListener('DOMContentLoaded', () => {
    // Botón volver
    btnAtras.addEventListener('click', () => {
        detenerCamara();
        window.history.back();
    });
    document.getElementById('btn-atras').addEventListener('click', () => {
        window.history.back();
    });
});