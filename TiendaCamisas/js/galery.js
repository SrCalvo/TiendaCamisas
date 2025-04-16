// Configura Firebase (usa la misma configuración que en admin.js)
const firebaseConfig = {
    apiKey: "AIzaSyAiJsLkdTme8GfzbioJb048RanRuiKvAAs",
    authDomain: "camiseton-6cf50.firebaseapp.com",
    projectId: "camiseton-6cf50",
    storageBucket: "camiseton-6cf50.appspot.com",
    messagingSenderId: "966664643301",
    appId: "1:966664643301:web:a58ecc31245ddae16baa0c",
    measurementId: "G-4F7HM8F302"
  };
  
  // Inicializa Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // Función para cargar y mostrar camisetas
  async function cargarCamisetas() {
    try {
      const galeria = document.getElementById('galeria-grid'); // Contenedor HTML
      galeria.innerHTML = ''; // Limpiar galería antes de cargar
  
      // Obtener todos los documentos de la colección "camisetas"
      const querySnapshot = await db.collection("camisetas").get();
  
      // Si no hay camisetas
      if (querySnapshot.empty) {
        galeria.innerHTML = '<p>No hay camisetas disponibles.</p>';
        return;
      }
  
      // Recorrer cada documento y crear tarjetas
      querySnapshot.forEach((doc) => {
        const camiseta = doc.data();
        const card = `
          <div class="camiseta-card">
            <img src="${camiseta.imagen}" alt="${camiseta.nombre}">
            <div class="info">
              <h3>${camiseta.nombre}</h3>
              <p>${camiseta.descripcion}</p>
              <p class="precio">$${camiseta.precio.toFixed(2)}</p>
              <button class="btn-whatsapp" onclick="pedirPorWhatsapp('${doc.id}')">
                <i class="fab fa-whatsapp"></i> Pedir
              </button>
            </div>
          </div>
        `;
        galeria.innerHTML += card;
      });
  
    } catch (error) {
      console.error("Error al cargar camisetas:", error);
      document.getElementById('galeria-grid').innerHTML = '<p>Error al cargar las camisetas. Recarga la página.</p>';
    }
  }
  
  // Función para redirigir a WhatsApp (opcional)
  function pedirPorWhatsapp(id) {
    const url = `https://wa.me/5211234567890?text=¡Hola! Quiero comprar la camiseta con ID: ${id}`;
    window.open(url, '_blank');
  }
  
  // Cargar camisetas al iniciar la página
  window.addEventListener('DOMContentLoaded', cargarCamisetas);

// En galeria.js
db.collection("camisetas").onSnapshot((querySnapshot) => {
  const galeria = document.getElementById('galeria-grid');
  galeria.innerHTML = '';
  
  querySnapshot.forEach((doc) => {
    const camiseta = doc.data();
    galeria.innerHTML += `
      <div class="camiseta-card">
        <img src="${camiseta.imagen}" alt="${camiseta.nombre}">
        <h3>${camiseta.nombre}</h3>
        <p>$${camiseta.precio}</p>
      </div>
    `;
  });
});
