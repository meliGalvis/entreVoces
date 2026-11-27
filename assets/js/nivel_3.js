document.addEventListener('DOMContentLoaded', () => {
    
    const btnAtras = document.getElementById('btn-atras');
    const btnMic = document.getElementById('btn-mic');
    const btnCamara = document.getElementById('btn-camara');
    const btnColgar = document.getElementById('btn-colgar');
    const miCamara = document.getElementById('mi-camara');
    const videoLocal = document.getElementById('video-local');
    const estado = document.getElementById('estado-camara');

    let stream = null;

    // Botón volver
    btnAtras.addEventListener('click', () => {
        detenerCamara();
        window.history.back();
    });

    // Micrófono (solo visual: alterna el ícono tachado)
    btnMic.addEventListener('click', () => {
        const silenciado = btnMic.getAttribute('aria-pressed') !== 'true';
        btnMic.setAttribute('aria-pressed', silenciado);
        btnMic.classList.toggle('apagado', silenciado);
        btnMic.setAttribute('aria-label', silenciado ? 'Activar micrófono' : 'Silenciar micrófono');
    });

    // Cámara real del equipo (solo se pide al hacer clic)
    async function encenderCamara() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            videoLocal.srcObject = stream;
            miCamara.hidden = false;
            btnCamara.classList.add('activo');
            btnCamara.setAttribute('aria-pressed', 'true');
            btnCamara.setAttribute('aria-label', 'Apagar cámara');
            estado.textContent = '';
        } catch (error) {
            const mensajes = {
                NotAllowedError: 'No diste permiso para usar la cámara.',
                NotFoundError: 'No se encontró ninguna cámara.',
                NotReadableError: 'Otra aplicación está usando la cámara.'
            };
            estado.textContent = mensajes[error.name] || 'No se pudo acceder a la cámara.';
        }
    }

    function detenerCamara() {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            stream = null;
        }
        videoLocal.srcObject = null;
        miCamara.hidden = true;
        btnCamara.classList.remove('activo');
        btnCamara.setAttribute('aria-pressed', 'false');
        btnCamara.setAttribute('aria-label', 'Activar cámara');
    }

    btnCamara.addEventListener('click', () => {
        if (stream) {
            detenerCamara();
        } else {
            encenderCamara();
        }
    });

    // Colgar: apaga la cámara y regresa
    btnColgar.addEventListener('click', () => {
        detenerCamara();
        window.open('retroalimentacion.html', '_self');
    });

    // Apaga la cámara si se cierra o se sale de la página
    window.addEventListener('pagehide', detenerCamara);
});
