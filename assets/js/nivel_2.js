document.addEventListener('DOMContentLoaded', () => {
    
     // ================= Referencias =================
    const form = document.getElementById('form-chat');
    const input = document.getElementById('input-mensaje');
    const lista = document.getElementById('mensajes');
    const nombre = document.getElementById('nombre-usuario').textContent;
    const estado = document.getElementById('estado');
    const btnMic = document.getElementById('btn-mic');
    const btnCancelar = document.getElementById('btn-cancelar');
    const panelGrabando = document.getElementById('grabando');
    const tiempoRec = document.getElementById('tiempo-rec');

    const MAX_SEGUNDOS = 120;       // límite de cada nota de voz
    const BARRAS = 36;              // barras de la onda

    const ICONO_AVATAR = '<svg><use href="#icono-avatar"/></svg>';
    const ICONO_ALTAVOZ = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9z"/><path d="M15.5 8.5a5 5 0 010 7M18 6a8.5 8.5 0 010 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
    const ICONO_PAUSA = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';

    // ================= Botón volver =================
    document.getElementById('btn-atras').addEventListener('click', () => {
        cancelarGrabacion();
        window.history.back();
    });

    // ================= Utilidades =================
    function formatoTiempo(segundos) {
        const s = Math.max(0, Math.round(segundos));
        return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
    }

    function quitarVacio() {
        const vacio = document.getElementById('mensajes-vacio');
        if (vacio) vacio.remove();
    }

    // Crea la fila de un mensaje (avatar + nombre + contenido)
    function crearMensaje(contenido) {
        const item = document.createElement('li');
        item.className = 'mensaje';

        const avatar = document.createElement('span');
        avatar.className = 'avatar avatar-morado avatar-sm';
        avatar.innerHTML = ICONO_AVATAR;

        const cuerpo = document.createElement('div');
        cuerpo.className = 'mensaje-cuerpo';

        const autor = document.createElement('span');
        autor.className = 'autor autor-sm';
        autor.textContent = nombre;

        cuerpo.append(autor, contenido);
        item.append(avatar, cuerpo);

        quitarVacio();
        lista.appendChild(item);
        lista.scrollTop = lista.scrollHeight;
    }

    // ================= Mensajes de texto =================
    function enviarTexto() {
        const texto = input.value.trim();
        if (!texto) return;

        const burbuja = document.createElement('p');
        burbuja.className = 'mensaje-texto';
        burbuja.textContent = texto; // textContent evita que se ejecute HTML

        crearMensaje(burbuja);
        input.value = '';
        input.focus();
    }

    // ================= Mensajes de voz =================
    let audioActual = null; // para que solo suene uno a la vez

    // Calcula la forma de la onda a partir del audio grabado
    async function calcularPicos(blob, cantidad) {
        try {
            const Contexto = window.AudioContext || window.webkitAudioContext;
            const ctx = new Contexto();
            const buffer = await ctx.decodeAudioData(await blob.arrayBuffer());
            const datos = buffer.getChannelData(0);
            const paso = Math.max(1, Math.floor(datos.length / cantidad));
            const picos = [];

            for (let i = 0; i < cantidad; i++) {
                let suma = 0, n = 0;
                for (let j = i * paso; j < (i + 1) * paso && j < datos.length; j += 20) {
                    suma += Math.abs(datos[j]);
                    n++;
                }
                picos.push(n ? suma / n : 0);
            }
            ctx.close();

            const max = Math.max(...picos) || 1;
            return picos.map((p) => Math.max(0.12, p / max));
        } catch (error) {
            // Si el navegador no puede analizar el audio, se usa una onda aleatoria
            return Array.from({ length: cantidad }, () => 0.15 + Math.random() * 0.85);
        }
    }

    async function agregarAudio(blob, duracion) {
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        const picos = await calcularPicos(blob, BARRAS);

        const caja = document.createElement('div');
        caja.className = 'audio';

        const btnPlay = document.createElement('button');
        btnPlay.type = 'button';
        btnPlay.className = 'audio-play';
        btnPlay.setAttribute('aria-label', 'Reproducir nota de voz');
        btnPlay.innerHTML = ICONO_ALTAVOZ;

        const barras = document.createElement('div');
        barras.className = 'audio-barras';
        const spans = picos.map((p) => {
            const s = document.createElement('span');
            s.style.height = Math.round(p * 100) + '%';
            barras.appendChild(s);
            return s;
        });

        const tiempo = document.createElement('span');
        tiempo.className = 'audio-tiempo';
        tiempo.textContent = formatoTiempo(duracion);

        caja.append(btnPlay, barras, tiempo);

        const pintar = (progreso) => {
            const hasta = Math.floor(progreso * spans.length);
            spans.forEach((s, i) => s.classList.toggle('reproducida', i < hasta));
        };

        const reiniciarUI = () => {
            btnPlay.innerHTML = ICONO_ALTAVOZ;
            btnPlay.setAttribute('aria-label', 'Reproducir nota de voz');
            tiempo.textContent = formatoTiempo(duracion);
            pintar(0);
        };

        btnPlay.addEventListener('click', () => {
            if (audio.paused) {
                if (audioActual && audioActual !== audio) audioActual.pause();
                audioActual = audio;
                audio.play();
            } else {
                audio.pause();
            }
        });

        audio.addEventListener('play', () => {
            btnPlay.innerHTML = ICONO_PAUSA;
            btnPlay.setAttribute('aria-label', 'Pausar nota de voz');
        });

        audio.addEventListener('pause', () => {
            if (!audio.ended) {
                btnPlay.innerHTML = ICONO_ALTAVOZ;
                btnPlay.setAttribute('aria-label', 'Reproducir nota de voz');
            }
        });

        audio.addEventListener('timeupdate', () => {
            pintar(Math.min(1, audio.currentTime / duracion));
            tiempo.textContent = formatoTiempo(audio.currentTime);
        });

        audio.addEventListener('ended', reiniciarUI);

        crearMensaje(caja);
    }

    // ================= Grabación =================
    let recorder = null;
    let flujo = null;
    let trozos = [];
    let temporizador = null;
    let inicio = 0;
    let duracion = 0;
    let cancelado = false;
    let solicitando = false;

    function elegirFormato() {
        const opciones = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
        return opciones.find((tipo) => MediaRecorder.isTypeSupported(tipo)) || '';
    }

    function mostrarModoGrabacion(activo) {
        panelGrabando.hidden = !activo;
        input.hidden = activo;
        btnMic.hidden = activo;
        form.classList.toggle('esta-grabando', activo);
        btnEnviar().setAttribute('aria-label', activo ? 'Enviar nota de voz' : 'Enviar mensaje');
    }

    function btnEnviar() {
        return document.getElementById('btn-enviar');
    }

    async function iniciarGrabacion() {
        if (solicitando || recorder) return;

        if (!navigator.mediaDevices || !window.MediaRecorder) {
            estado.textContent = 'Tu navegador no permite grabar audio.';
            return;
        }

        solicitando = true;
        try {
            flujo = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (error) {
            const mensajes = {
                NotAllowedError: 'No diste permiso para usar el micrófono.',
                NotFoundError: 'No se encontró ningún micrófono.',
                NotReadableError: 'Otra aplicación está usando el micrófono.'
            };
            estado.textContent = mensajes[error.name] || 'No se pudo acceder al micrófono.';
            solicitando = false;
            return;
        }
        solicitando = false;
        estado.textContent = '';

        const formato = elegirFormato();
        recorder = formato ? new MediaRecorder(flujo, { mimeType: formato }) : new MediaRecorder(flujo);
        trozos = [];
        cancelado = false;

        recorder.addEventListener('dataavailable', (e) => {
            if (e.data.size > 0) trozos.push(e.data);
        });

        recorder.addEventListener('stop', async () => {
            const tipo = recorder.mimeType || formato || 'audio/webm';
            flujo.getTracks().forEach((t) => t.stop());
            flujo = null;
            recorder = null;
            clearInterval(temporizador);
            mostrarModoGrabacion(false);

            if (cancelado || !trozos.length) return;
            await agregarAudio(new Blob(trozos, { type: tipo }), Math.max(1, duracion));
        });

        recorder.start();
        inicio = Date.now();
        tiempoRec.textContent = '0:00';
        mostrarModoGrabacion(true);

        temporizador = setInterval(() => {
            const seg = (Date.now() - inicio) / 1000;
            tiempoRec.textContent = formatoTiempo(seg);
            if (seg >= MAX_SEGUNDOS) detenerYEnviar();
        }, 250);
    }

    function detenerYEnviar() {
        if (recorder && recorder.state === 'recording') {
            duracion = (Date.now() - inicio) / 1000;
            recorder.stop();
        }
    }

    function cancelarGrabacion() {
        if (recorder && recorder.state === 'recording') {
            cancelado = true;
            recorder.stop();
        }
    }

    // ================= Eventos =================
    btnMic.addEventListener('click', iniciarGrabacion);
    btnCancelar.addEventListener('click', cancelarGrabacion);

    // Enviar: si se está grabando, envía el audio; si no, el texto
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (recorder) {
            detenerYEnviar();
        } else {
            enviarTexto();
        }
    });

    // Apaga el micrófono si se sale de la página
    window.addEventListener('pagehide', cancelarGrabacion);
});
