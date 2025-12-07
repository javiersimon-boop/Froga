// Función para cargar componentes HTML
async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`No se pudo cargar ${filePath}`);
        
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;

        // Si es el header, activamos el enlace correspondiente
        if (elementId === 'header-placeholder') {
            setActiveMenuItem();
        }
    } catch (error) {
        console.error(error);
    }
}

// Función para marcar el enlace activo según la URL
function setActiveMenuItem() {
    // Obtenemos el nombre del archivo actual (ej: "index.html" o "nor-gara.html")
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    // Buscamos todos los enlaces dentro del menú
    const links = document.querySelectorAll('#nav-links a');
    
    links.forEach(link => {
        // Obtenemos el href del enlace (ej: "nor-gara.html")
        const linkPath = link.getAttribute('href');
        
        // Si coinciden, añadimos la clase 'active'
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });
}

// Iniciar la carga
// Asegúrate de que la ruta a los archivos .html sea correcta relativa a tu estructura
// Si los metes en una carpeta 'components', usa 'components/header.html'
loadComponent('header-placeholder', 'components/header.html');
loadComponent('footer-placeholder', 'components/footer.html');
