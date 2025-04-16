// Configuración de Firebase
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
const storage = firebase.storage();

// Login (contraseña: "admin123")
document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const password = document.getElementById('admin-password').value;
  
  if (password === "admin123") {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('management-section').style.display = 'block';
    alert("¡Bienvenido, Admin!");
  } else {
    alert("Contraseña incorrecta");
  }
});

// Función para agregar camisetas
document.getElementById('add-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const nombre = document.getElementById('product-name').value;
  const precio = parseFloat(document.getElementById('product-price').value);
  const categoria = document.getElementById('product-category').value;
  const descripcion = document.getElementById('product-description').value;
  const imagen = document.getElementById('product-image').files[0];

  if (!imagen) {
    alert("⚠️ Sube una imagen");
    return;
  }

  try {
    // 1. Subir imagen a Firebase Storage
    const storageRef = storage.ref(`camisetas/${imagen.name}`);
    await storageRef.put(imagen);
    const imagenUrl = await storageRef.getDownloadURL();

    // 2. Guardar datos en Firestore
    await db.collection("camisetas").add({
      nombre,
      precio,
      categoria,
      descripcion,
      imagen: imagenUrl,
      fecha: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("✅ Camiseta agregada con éxito!");
    document.getElementById('add-form').reset();
  } catch (error) {
    console.error("Error:", error);
    alert("❌ Error al subir la camiseta");
  }
});

// Buscar camisetas
document.getElementById('search-btn').addEventListener('click', async function() {
  const query = document.getElementById('product-code').value.toLowerCase();
  const snapshot = await db.collection("camisetas").get();
  const resultados = snapshot.docs.filter(doc => {
    const data = doc.data();
    return (
      data.nombre.toLowerCase().includes(query) ||
      doc.id.includes(query)
    );
  });

  const resultadosHTML = resultados.map(doc => {
    const data = doc.data();
    return `
      <div class="result-item">
        <h4>${data.nombre} (ID: ${doc.id})</h4>
        <p>$${data.precio} | ${data.categoria}</p>
        <img src="${data.imagen}" width="100">
      </div>
    `;
  }).join('');

  document.getElementById('search-results').innerHTML = resultadosHTML || "<p>No hay resultados.</p>";
});

// Eliminar camiseta
document.getElementById('delete-btn').addEventListener('click', async function() {
  const query = document.getElementById('product-code').value;
  if (!query) {
    alert("⚠️ Ingresa un ID o nombre para buscar primero");
    return;
  }

  const snapshot = await db.collection("camisetas").get();
  const docToDelete = snapshot.docs.find(doc => 
    doc.id === query || doc.data().nombre.toLowerCase().includes(query.toLowerCase())
  );

  if (!docToDelete) {
    alert("No se encontró la camiseta");
    return;
  }

  if (confirm("¿Eliminar esta camiseta permanentemente?")) {
    try {
      await db.collection("camisetas").doc(docToDelete.id).delete();
      alert("🗑️ Camiseta eliminada");
      document.getElementById('product-code').value = "";
      document.getElementById('search-results').innerHTML = "";
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error al eliminar");
    }
  }
});
document.getElementById('add-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const nombre = document.getElementById('product-name').value;
  const precio = parseFloat(document.getElementById('product-price').value);
  const imagen = document.getElementById('product-image').files[0];

  if (!imagen) {
    alert("⚠️ Sube una imagen");
    return;
  }

  try {
    // 1. Subir imagen
    const storageRef = storage.ref(`camisetas/${imagen.name}`);
    await storageRef.put(imagen);
    const imagenUrl = await storageRef.getDownloadURL();
    console.log("Imagen subida. URL:", imagenUrl); // Debug

    // 2. Guardar en Firestore
    const docRef = await db.collection("camisetas").add({
      nombre,
      precio,
      imagen: imagenUrl,
      fecha: firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log("Documento guardado con ID:", docRef.id); // Debug

    alert("✅ ¡Guardado exitoso!");
    document.getElementById('add-form').reset();
  } catch (error) {
    console.error("Error completo:", error); // Debug detallado
    alert(`❌ Error: ${error.message}`);
  }
});
