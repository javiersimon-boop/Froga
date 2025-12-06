// URL de tu Hoja de Cálculo (Publicada como CSV)
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRH7yAF9u3eguKbDSemxaDviakRJMDMGNxTSe6U86ZO8poS6wZAIpN3JJhSvOxTBnyYWeif1ZhY6x33/pub?output=csv'; 

const container = document.getElementById('news-container');

// Función principal para cargar noticias
async function loadNews() {
    try {
        const response = await fetch(SHEET_URL);
        
        if (!response.ok) {
            throw new Error("No se pudo conectar con la hoja de cálculo");
        }
        
        const data = await response.text();
        const newsItems = parseCSV(data);
        
        // Limpiar el contenedor (quitar el loader)
        container.innerHTML = '';

        if (newsItems.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500">No hay noticias recientes.</p>';
            return;
        }

        // Mostrar solo las 3 primeras noticias
        newsItems.slice(0, 3).forEach(news => {
            const html = createNewsHTML(news);
            container.insertAdjacentHTML('beforeend', html);
        });

    } catch (error) {
        console.error(error);
        container.innerHTML = '<p class="text-center text-red-500 text-sm">Error cargando noticias. Verifica la conexión.</p>';
    }
}

// Función para convertir el texto CSV a objetos usables
function parseCSV(str) {
    const rows = str.trim().split('\n');
    
    // Saltamos la fila 0 (encabezados) y procesamos el resto
    return rows.slice(1).map(row => {
        // Separa por comas, respetando las comillas si las hubiera
        const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        
        // Limpia comillas extra
        const cleanCols = cols.map(col => col.replace(/^"|"$/g, '').trim());

        // Verificamos que la fila tenga datos suficientes
        if (cleanCols.length < 5) return null;

        return {
            mes: cleanCols[0],
            dia: cleanCols[1],
            titulo_eu: cleanCols[2],
            resumen_eu: cleanCols[3],
            titulo_es: cleanCols[4],
            resumen_es: cleanCols[5],
            enlace: cleanCols[6] || '#'
        };
    }).filter(n => n); // Filtramos filas vacías o nulas
}

// Función que crea el HTML de cada tarjeta de noticia
function createNewsHTML(news) {
    return `
    <div class="flex flex-col md:flex-row gap-6 border-b border-gray-100 pb-8 last:border-0 fade-in">
        <!-- Fecha -->
        <div class="flex-shrink-0 text-center md:text-left pt-2 md:w-24">
            <p class="text-sv-accent-1 font-bold text-xs uppercase tracking-widest">${news.mes}</p>
            <p class="text-sv-primary font-bold text-5xl">${news.dia}</p>
        </div>
        
        <!-- Contenido -->
        <div class="flex-grow space-y-4">
            <!-- Bloque Euskera -->
            <div>
                <h3 class="text-xl font-bold text-sv-primary mb-1">${news.titulo_eu}</h3>
                <p class="text-gray-600 text-sm mb-2 leading-relaxed">${news.resumen_eu}</p>
                <a href="${news.enlace}" target="_top" class="text-xs font-bold text-sv-accent-2 hover:text-sv-primary uppercase tracking-wide transition-colors">
                    Gehiago irakurri &rarr;
                </a>
            </div>
            
            <!-- Separador punteado -->
            <div class="border-t border-dashed border-gray-200 w-full"></div>
            
            <!-- Bloque Castellano -->
            <div>
                <h3 class="text-xl font-bold text-sv-primary mb-1">${news.titulo_es}</h3>
                <p class="text-gray-600 text-sm mb-2 leading-relaxed">${news.resumen_es}</p>
                <a href="${news.enlace}" target="_top" class="text-xs font-bold text-sv-accent-1 hover:text-sv-primary uppercase tracking-wide transition-colors">
                    Leer más &rarr;
                </a>
            </div>
        </div>
    </div>`;
}

// Ejecutar la carga al inicio
loadNews();
