document.getElementById('saborButton').addEventListener('click', function() {
    const saborInput = document.getElementById('saborInput').value;
    const mensaje = document.getElementById('mensaje');

    if (saborInput) {
        mensaje.textContent = `¡Genial! Tu sabor favorito es ${saborInput}!`;
        mensaje.style.color = 'green';
    } else {
        mensaje.textContent = 'Por favor, escribe un sabor.';
        mensaje.style.color = 'red';
    }
});