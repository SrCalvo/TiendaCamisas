// Menú móvil
document.getElementById('menu-toggle').addEventListener('click', function() {
    document.getElementById('mobile-nav').classList.toggle('active');
});

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('#mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('mobile-nav').classList.remove('active');
    });
});