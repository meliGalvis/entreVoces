document.addEventListener('DOMContentLoaded', () => {

    //ATRAS
    const btnAtras = document.getElementById('btn-atras');
    btnAtras.addEventListener('click', () => {
        window.location.href = 'menu.html';
    });

    // Chat de vista (los mensajes solo se muestran en pantalla)
    const form = document.getElementById('form-chat');
    const input = document.getElementById('input-mensaje');
    const lista = document.getElementById('mensajes');
    const vacio = document.getElementById('mensajes-vacio');
    const nombre = document.getElementById('nombre-usuario').textContent;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const texto = input.value.trim();
        if (!texto) return;

        if (vacio) vacio.remove();

        const item = document.createElement('li');
        item.className = 'mensaje';

        const avatar = document.createElement('span');
        avatar.className = 'avatar avatar-amarillo avatar-sm';
        avatar.innerHTML = '<svg><use href="#icono-avatar"/></svg>';

        const cuerpo = document.createElement('div');

        const autor = document.createElement('span');
        autor.className = 'autor autor-sm';
        autor.textContent = nombre;

        const burbuja = document.createElement('p');
        burbuja.className = 'mensaje-texto';
        burbuja.textContent = texto; // textContent evita que se ejecute HTML

        cuerpo.append(autor, burbuja);
        item.append(avatar, cuerpo);
        lista.appendChild(item);

        lista.scrollTop = lista.scrollHeight;
        input.value = '';
        input.focus();
    });
});