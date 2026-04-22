// Variable global para almacenar los hábitos y cruzar datos después
let datosUsuario = {};

// Cuestionario MBI y opciones
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
    const contenedorPreguntas = document.getElementById("preguntas-container");
    const formRegistro = document.getElementById("registro-form");
    const formBurnout = document.getElementById("burnout-form");
    
    const pantallaRegistro = document.getElementById("pantalla-registro");
    const pantallaCuestionario = document.getElementById("pantalla-cuestionario");
    const modalResultados = document.getElementById("resultados-modal");
    const btnReiniciar = document.getElementById("btn-reiniciar");

    // Generar preguntas dinámicamente
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
        contenedorPreguntas.appendChild(item);
    });

    // Evento 1: Guardar Hábitos y pasar al Cuestionario
    formRegistro.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Capturar los datos del usuario (todas las variables sociodemográficas)
        datosUsuario = {
            tipoTrabajo: document.getElementById("tipo-trabajo").value,
            edad: document.getElementById("edad").value,
            genero: document.getElementById("genero").value,
            horasSueno: document.getElementById("horas-sueno").value,
            ansiedad: document.getElementById("ansiedad").value,
            dependientes: document.getElementById("dependientes").value,
            modalidad: document.getElementById("modalidad").value,
            horasTrabajo: document.getElementById("horas-trabajo").value,
            tiempoTraslado: document.getElementById("tiempo-traslado").value,
            desconexion: document.getElementById("desconexion").value
        };

        // Ocultar pantalla 1 y mostrar pantalla 2
        pantallaRegistro.classList.add("oculto");
        pantallaCuestionario.classList.remove("oculto");
        window.scrollTo(0, 0); // Subir la vista al inicio
    });

    // Evento 2: Calcular Burnout y mostrar Resultados
    formBurnout.addEventListener("submit", (e) => {
        e.preventDefault();
        
        let CE = 0, D = 0, RP = 0;
        const selects = formBurnout.querySelectorAll("select");

        selects.forEach(select => {
            let valor = parseInt(select.value) || 0;
            let subescala = select.getAttribute("data-subescala");

            if (subescala === "CE") CE += valor;
            if (subescala === "D") D += valor;
            if (subescala === "RP") RP += valor;
        });

        procesarResultados(CE, D, RP);
    });

    // Evento 3: Reiniciar todo el proceso
    btnReiniciar.addEventListener("click", () => {
        formRegistro.reset();
        formBurnout.reset();
        datosUsuario = {}; // Limpiar datos de memoria
        
        modalResultados.classList.add("oculto");
        pantallaCuestionario.classList.add("oculto");
        pantallaRegistro.classList.remove("oculto");
        window.scrollTo(0, 0);
    });
});

function procesarResultados(CE, D, RP) {
    let nivelRiesgo = "";
    let retroalimentacion = "";
    let claseCSS = "";

    // Lógica de evaluación basada en el documento
    if (CE >= 27 || D >= 10 || RP <= 33) {
        nivelRiesgo = "Riesgo Alto";
        retroalimentacion = "Alerta de agotamiento emocional severo. Te sugerimos acudir a las autoridades de tu institución y a un profesional de la salud mental. También es útil apoyarse en técnicas de mindfulness (por ejemplo, con autores como Paul Gilbert, Jon Kabat-Zinn, Kristin Neff y Daniel J. Siegel).";
        claseCSS = "riesgo-alto";
    } 
    else if ((CE >= 19 && CE <= 26) || (D >= 6 && D <= 9) || (RP >= 34 && RP <= 39)) {
        nivelRiesgo = "Riesgo Moderado";
        retroalimentacion = "Advertencia sobre un posible inicio de desgaste laboral. Te recomendamos hacer una pausa para la reflexión, practicar mindfulness y, de ser necesario, consultar con un profesional. Autores recomendados: Paul Gilbert, Jon Kabat-Zinn, Kristin Neff y Daniel J. Siegel.";
        claseCSS = "riesgo-medio";
    } 
    else {
        nivelRiesgo = "Nivel Sin Riesgo";
        retroalimentacion = "¡Felicidades! Mantienes un buen nivel de bienestar. Te invitamos a compartir tus estrategias y apoyar a tus compañeros.";
        claseCSS = "riesgo-bajo";
    }

    document.getElementById("res-ce").innerText = CE;
    document.getElementById("res-d").innerText = D;
    document.getElementById("res-rp").innerText = RP;
    
    document.getElementById("nivel-riesgo").innerText = `Nivel detectado: ${nivelRiesgo}`;
    
    // Preparación de datos para análisis de Ciencia de Datos
    console.log("=== DATOS CAPTURADOS PARA ANÁLISIS ===");
    console.log({
        habitos: datosUsuario,
        resultadosBurnout: { CE, D, RP, nivelRiesgo }
    });
    console.log("======================================");

    document.getElementById("mensaje-retroalimentacion").innerHTML = retroalimentacion + 
    "<br><br><small><i>Nota importante: Este cuestionario es una herramienta de tamizaje y no reemplaza un diagnóstico clínico profesional.</i></small>";

    const divDiagnostico = document.querySelector(".diagnostico");
    divDiagnostico.className = `diagnostico ${claseCSS}`;

    document.getElementById("pantalla-cuestionario").classList.add("oculto");
    document.getElementById("resultados-modal").classList.remove("oculto");
    window.scrollTo(0, 0); // Subir la vista para ver los resultados
}