// Paso 1 - Carga de preguntas [cite: 65]
const cuestionarioBurnout = [
    { id: 1, texto: "Me siento emocionalmente agotado por mi trabajo.", subescala: "CE" },
    { id: 2, texto: "Me siento cansado al final de la jornada de trabajo.", subescala: "CE" },
    { id: 3, texto: "Me fatiga levantarme por la mañana para ir a trabajar.", subescala: "CE" },
    { id: 4, texto: "Comprendo fácilmente cómo se sienten mis alumnos.", subescala: "RP" },
    { id: 5, texto: "Creo que trato a algunos alumnos como si fueran objetos impersonales.", subescala: "D" },
    { id: 6, texto: "Trabajar todo el día con gente me supone un gran esfuerzo.", subescala: "CE" },
    { id: 7, texto: "Trato muy eficazmente los problemas de mis alumnos.", subescala: "RP" },
    { id: 8, texto: "Siento que mi trabajo me está desgastando.", subescala: "CE" },
    { id: 9, texto: "Siento que estoy influyendo positivamente en la vida de otras personas.", subescala: "RP" },
    { id: 10, texto: "Me he vuelto más insensible con la gente desde que ejerzo esta profesión.", subescala: "D" },
    { id: 11, texto: "Me preocupa el hecho de que este trabajo me esté endureciendo emocionalmente.", subescala: "D" },
    { id: 12, texto: "Me siento muy enérgico en mi trabajo.", subescala: "RP" },
    { id: 13, texto: "Me siento frustrado en mi trabajo.", subescala: "CE" },
    { id: 14, texto: "Siento que estoy haciendo un esfuerzo excesivo en mi trabajo.", subescala: "CE" },
    { id: 15, texto: "Realmente no me importa lo que les ocurra a mis alumnos.", subescala: "D" },
    { id: 16, texto: "Siento que trabajar directamente con la gente me produce estrés.", subescala: "CE" },
    { id: 17, texto: "Puedo crear fácilmente una atmósfera relajada con mis alumnos.", subescala: "RP" },
    { id: 18, texto: "Me siento estimulado después de trabajar en contacto con mis alumnos.", subescala: "RP" },
    { id: 19, texto: "He conseguido muchas cosas útiles en mi profesión.", subescala: "RP" },
    { id: 20, texto: "Siento que estoy al límite de mis posibilidades.", subescala: "CE" },
    { id: 21, texto: "En mi trabajo manejo los problemas emocionales con mucha calma.", subescala: "RP" },
    { id: 22, texto: "Siento que los alumnos me culpan por algunos de sus problemas.", subescala: "D" }
];

const opcionesRespuesta = [
    { valor: 0, etiqueta: "Nunca" },
    { valor: 1, etiqueta: "Pocas veces al año o menos" },
    { valor: 2, etiqueta: "Una vez al mes o menos" },
    { valor: 3, etiqueta: "Unas pocas veces al mes" },
    { valor: 4, etiqueta: "Una vez a la semana" },
    { valor: 5, etiqueta: "Unas pocas veces a la semana" },
    { valor: 6, etiqueta: "Todos los días" }
];

document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("preguntas-container");
    const formulario = document.getElementById("burnout-form");
    const modalResultados = document.getElementById("resultados-modal");
    const btnReiniciar = document.getElementById("btn-reiniciar");

    // Al cargar la página, se genera dinámicamente los 22 items con sus menús desplegables de selección [cite: 66]
    cuestionarioBurnout.forEach((pregunta, index) => {
        const item = document.createElement("div");
        item.classList.add("pregunta-item");

        let opcionesHTML = `<option value="" disabled selected>Selecciona una opción...</option>`;
        opcionesRespuesta.forEach(op => {
            opcionesHTML += `<option value="${op.valor}">${op.etiqueta} (${op.valor})</option>`;
        });

        item.innerHTML = `
            <label class="pregunta-texto">${index + 1}. ${pregunta.texto}</label>
            <select name="q${pregunta.id}" data-subescala="${pregunta.subescala}" required>
                ${opcionesHTML}
            </select>
        `;
        contenedor.appendChild(item);
    });

    // Paso 2 - Captura de respuestas [cite: 67] y Paso 3 - Cálculo automático [cite: 68]
    formulario.addEventListener("submit", (e) => {
        e.preventDefault();
        
        let CE = 0, D = 0, RP = 0;
        const selects = formulario.querySelectorAll("select");

        // Al enviar el formulario, se itera sobre cada subescala, se suman los valores correspondientes y calcula el total de cada dimensión [cite: 69]
        selects.forEach(select => {
            let valor = parseInt(select.value) || 0; // Se asigna automáticamente el valor 0 para evitar errores de cálculo [cite: 40]
            let subescala = select.getAttribute("data-subescala");

            if (subescala === "CE") CE += valor;
            if (subescala === "D") D += valor;
            if (subescala === "RP") RP += valor;
        });

        procesarResultados(CE, D, RP);
    });

    btnReiniciar.addEventListener("click", () => {
        formulario.reset();
        formulario.style.display = "block";
        modalResultados.classList.add("oculto");
        window.scrollTo(0, 0);
    });
});

// Paso 4 - Clasificación
function procesarResultados(CE, D, RP) {
    let nivelRiesgo = "";
    let retroalimentacion = "";
    let claseCSS = "";

    // Criterios de Interpretación basados en el documento
    // Nivel de Riesgo Alto
    if (CE >= 27 || D >= 10 || RP <= 33) {
        nivelRiesgo = "Riesgo Alto";
        retroalimentacion = "Se alerta sobre agotamiento emocional severo. Se recomienda canalización con autoridades institucionales y profesional de salud mental. Puedes buscar apoyo en recursos de mindfulness (ej. Paul Gilbert, Jon Kabat-Zinn, Kristin Neff y Daniel J. Siegel).";
        claseCSS = "riesgo-alto";
    } 
    // Nivel de Riesgo Moderado
    else if ((CE >= 19 && CE <= 26) || (D >= 6 && D <= 9) || (RP >= 34 && RP <= 39)) {
        nivelRiesgo = "Riesgo Moderado";
        retroalimentacion = "Se advierte sobre el posible inicio de desgaste laboral. Se recomienda reflexión, prácticas de mindfulness y, si es necesario, consulta con profesional de salud mental. Autores de referencia: Paul Gilbert, Jon Kabat-Zinn, Kristin Neff y Daniel J. Siegel.";
        claseCSS = "riesgo-medio";
    } 
    // Nivel Sin Riesgo
    else {
        nivelRiesgo = "Nivel Sin Riesgo";
        retroalimentacion = "Felicidades. Se reconoce tu bienestar. Te invitamos a apoyar a tus compañeros.";
        claseCSS = "riesgo-bajo";
    }

    // Paso 5 - Visualización de resultados
    document.getElementById("res-ce").innerText = CE;
    document.getElementById("res-d").innerText = D;
    document.getElementById("res-rp").innerText = RP;
    
    document.getElementById("nivel-riesgo").innerText = `Nivel detectado: ${nivelRiesgo}`;
    document.getElementById("mensaje-retroalimentacion").innerText = retroalimentacion;

    const divDiagnostico = document.querySelector(".diagnostico");
    divDiagnostico.className = `diagnostico ${claseCSS}`;

    document.getElementById("burnout-form").style.display = "none";
    document.getElementById("resultados-modal").classList.remove("oculto");
    
    // Nota de limitación
    document.getElementById("mensaje-retroalimentacion").innerHTML += "<br><br><small><i>Nota: El instrumento no sustituye una evaluación clínica profesional; es una herramienta de tamizaje.</i></small>";
}