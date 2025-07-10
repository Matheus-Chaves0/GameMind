// Animação de digitação para o título
function typeWriter(elemento, texto, velocidade) {
    let i = 0;
    elemento.textContent = "";
    
    function digitar() {
        if (i < texto.length) {
            elemento.textContent += texto.charAt(i);
            i++;
            setTimeout(digitar, velocidade);
        } else {
          
            elemento.style.borderRight = "2px solid #000";
        }
    }
    
    digitar();
}

document.addEventListener('DOMContentLoaded', function() {
    const titulo = document.getElementById('tituloPag');
    const textoCompleto = titulo.textContent;
    
    // Inicia a animação
    typeWriter(titulo, textoCompleto, 100);
});
//AIzaSyAI5itLQEh58PFThNHNpmn3TKmEZYyj5kk