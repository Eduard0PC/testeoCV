document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("cvForm");

  // Manejo de eventos para los botones
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    generarCV(1, "download"); // Genera el PDF en Estilo 1 y lo descarga
  });

  form.querySelector('[type="submit2"]').addEventListener("click", function (e) {
    e.preventDefault();
    generarCV(2, "download"); // Genera el PDF en Estilo 2 y lo descarga
  });

  // Evento para compartir el PDF
  document.getElementById("shareButton").addEventListener("click", function (e) {
    e.preventDefault();
    generarCV(1, "share"); // Genera el PDF en Estilo 1 y lo comparte
  });
});

// Función principal para generar el CV en diferentes estilos y acciones (descargar o compartir)
function generarCV(estilo, accion = "download") {
  if (!window.jspdf) {
    console.error("jsPDF no está cargado.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "mm", "a4");

  const azul = "#0B5394";
  const gris = "#333";

  const nombre = document.getElementById("nombre").value || "Nombre Apellido";
  const profesion = document.getElementById("profesion").value || "Profesión";
  const resumen = document.getElementById("resumen").value || "Resumen de experiencia...";
  const experiencia = document.getElementById("experiencia").value || "Experiencia laboral...";
  const educacion = document.getElementById("educacion").value || "Educación obtenida...";
  const habilidades = document.getElementById("habilidades").value || "Habilidades clave...";

  if (estilo === 1) {
    generarCVEstilo1(doc, nombre, profesion, resumen, experiencia, educacion, habilidades);
  } else {
    generarCVEstilo2(doc, nombre, profesion, resumen, experiencia, educacion, habilidades);
  }

  if (accion === "download") {
    doc.save(`${nombre.replace(/\s+/g, "_")}_CV.pdf`);
  } else if (accion === "share") {
    sharePDF(doc, nombre);
  }
}

// Función para compartir el PDF usando el Web Share API
function sharePDF(doc, nombre) {
  const pdfBlob = doc.output("blob");
  const file = new File([pdfBlob], `${nombre.replace(/\s+/g, "_")}_CV.pdf`, { type: "application/pdf" });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    navigator.share({
      files: [file],
      title: "Mi CV PDF",
      text: "Aquí está mi CV generado."
    })
    .then(() => console.log("Compartido con éxito"))
    .catch((err) => console.error("Error al compartir", err));
  } else {
    alert("La función de compartir no está soportada en este dispositivo.");
  }
}

// Estilo 1 (Diseño clásico sin sidebar)
function generarCVEstilo1(doc, nombre, profesion, resumen, experiencia, educacion, habilidades) {
  let y = 20;

  const azul = "#0B5394";
  const gris = "#555";

  // Nombre
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(azul);
  doc.text(nombre, 105, y, { align: "center" });

  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(gris);
  doc.text(profesion, 105, y, { align: "center" });

  y += 10;
  doc.setDrawColor(azul);
  doc.setLineWidth(0.5);
  doc.line(20, y, 190, y);
  y += 10;

  // Secciones
  y = agregarSeccion(doc, "Resumen Profesional", resumen, y);
  y = agregarSeccion(doc, "Experiencia Laboral", experiencia, y);
  y = agregarSeccion(doc, "Educación", educacion, y);
  y = agregarSeccion(doc, "Habilidades", habilidades, y);
}

// Estilo 2 (Con Sidebar y Foto de Perfil)
function generarCVEstilo2(doc, nombre, profesion, resumen, experiencia, educacion, habilidades) {
  const azul = "#0B5394";
  const gris = "#333";

  // SIDEBAR
  doc.setFillColor(azul);
  doc.rect(0, 0, 60, 297, "F");

  // FOTO DE PERFIL
  doc.setFillColor("#ffffff");
  doc.circle(30, 30, 20, "F");

  // Nombre y Profesión
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFontSize(22);
  doc.setTextColor(azul);
  doc.setFont("helvetica", "bold");
  doc.text(nombre, pageWidth / 2, 30, { align: "center" });

  doc.setFontSize(14);
  doc.setTextColor(gris);
  doc.setFont("helvetica", "normal");
  doc.text(profesion, pageWidth / 2, 38, { align: "center" });

  // DATOS PERSONALES
  doc.setTextColor("#ffffff");
  doc.setFontSize(11);
  doc.text("Datos Personales", 10, 65);
  doc.setFontSize(10);
  doc.text("Correo: ejemplo@email.com", 10, 75);
  doc.text("Tel: +123 456 789", 10, 82);
  doc.text("Ciudad: Ciudad XYZ", 10, 89);

  // Secciones
  let y = 60;
  y = agregarBloque(doc, "Resumen Profesional", resumen, y + 30);
  y = agregarBloque(doc, "Experiencia Laboral", experiencia, y + 5);
  y = agregarBloque(doc, "Educación", educacion, y + 5);
  y = agregarBloque(doc, "Habilidades", habilidades, y + 5);
}

// Función para agregar una sección en Estilo 1
function agregarSeccion(doc, titulo, contenido, y) {
  const azul = "#0B5394";

  if (y > 270) {
    doc.addPage();
    y = 20;
  }

  doc.setFontSize(16);
  doc.setTextColor(azul);
  doc.setFont("helvetica", "bold");
  doc.text(titulo, 20, y);
  y += 6;

  doc.setDrawColor(azul);
  doc.setLineWidth(0.3);
  doc.line(20, y, 190, y);
  y += 5;

  doc.setFontSize(12);
  doc.setTextColor(50);
  doc.setFont("helvetica", "normal");

  const lineas = doc.splitTextToSize(contenido, 170);
  doc.text(lineas, 20, y);
  y += lineas.length * 6 + 5;

  return y;
}

// Función para agregar una sección en Estilo 2
function agregarBloque(doc, titulo, contenido, y) {
  const azul = "#0B5394";

  if (y > 270) {
    doc.addPage();
    y = 20;
  }

  doc.setFontSize(13);
  doc.setTextColor(azul);
  doc.setFont("helvetica", "bold");
  doc.text(titulo, 70, y);

  y += 6;
  doc.setDrawColor(azul);
  doc.setLineWidth(0.3);
  doc.line(70, y, 200, y);

  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(50);

  const lines = doc.splitTextToSize(contenido, 120);
  doc.text(lines, 70, y);

  return y + lines.length * 5;
}
