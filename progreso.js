// ====================================================================
//    BASE DE DATOS Y SISTEMA DE CONTROL DE PROGRESO - "RESTAURADORES"
// ====================================================================

/**
 * 1. INICIALIZACIÓN DE LA BASE DE DATOS
 * Crea usuarios por defecto en el almacenamiento local si el juego se abre por primera vez.
 */
function inicializarBaseDatos() {
    if (!localStorage.getItem("usuarios_registrados")) {
        const usuariosIniciales = {
            "caperuza": { contrasena: "0000" },
            "usuario": { contrasena: "usuario" }
        };
        localStorage.setItem("usuarios_registrados", JSON.stringify(usuariosIniciales));
        console.log("[Base de Datos] Inicializada con usuarios por defecto.");
    }
}

/**
 * 2. REGISTRO Y AUTENTICACIÓN
 * Comprueba las credenciales del usuario o registra uno nuevo.
 */
function verificarCredenciales(usuario, contrasena) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios_registrados")) || {};
    const userClean = usuario.trim().toLowerCase();

    if (usuarios[userClean] && usuarios[userClean].contrasena === contrasena) {
        return { exito: true, mensaje: "ACCESO PERMITIDO" };
    } else if (usuarios[userClean]) {
        return { exito: false, mensaje: "CÓDIGO DE ENTRADA INCORRECTO" };
    } else {
        return { exito: false, mensaje: "EL HÉROE NO ESTÁ REGISTRADO" };
    }
}

function registrarNuevoUsuario(usuario, contrasena) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios_registrados")) || {};
    const userClean = usuario.trim().toLowerCase();

    if (!userClean || !contrasena) {
        return { exito: false, mensaje: "CAMPOS INCOMPLETOS" };
    }

    if (usuarios[userClean]) {
        return { exito: false, mensaje: "EL NOMBRE DE HÉROE YA EXISTE" };
    }

    // Registrar nuevo usuario en las credenciales globales
    usuarios[userClean] = { contrasena: contrasena };
    localStorage.setItem("usuarios_registrados", JSON.stringify(usuarios));

    // Inicializar partida vacía para este nuevo usuario
    const nuevoProgreso = {
        usuario: userClean,
        logros: {
            nivel3: false, // Prueba del Oráculo (Acertijo)
            nivel5: false, // El Laberinto de la Motivación
            nivel6: false  // Buscador de Evidencias
        },
        descubrimientos: []
    };
    localStorage.setItem(`progreso_${userClean}`, JSON.stringify(nuevoProgreso));

    return { exito: true, mensaje: "¡HÉROE REGISTRADO CON ÉXITO!" };
}

/**
 * 3. CONTROL DE PROGRESO Y PARTIDAS
 * Carga, actualiza logros y almacena evidencias de manera independiente por usuario.
 */
function obtenerProgresoActual() {
    const usuarioActivo = localStorage.getItem("usuarioActivo") || "invitado";
    const partidaGuardada = localStorage.getItem(`progreso_${usuarioActivo}`);
    
    if (partidaGuardada) {
        return JSON.parse(partidaGuardada);
    } else {
        // Estructura de respaldo si no se encuentra partida
        return {
            usuario: usuarioActivo,
            logros: {
                nivel3: false,
                nivel5: false,
                nivel6: false
            },
            descubrimientos: []
        };
    }
}

function guardarNivelCompletado(nivelId) {
    const progreso = obtenerProgresoActual();
    const usuarioActivo = localStorage.getItem("usuarioActivo") || "invitado";

    if (nivelId === 'nivel3') progreso.logros.nivel3 = true;
    if (nivelId === 'nivel5') progreso.logros.nivel5 = true;
    if (nivelId === 'nivel6') progreso.logros.nivel6 = true;

    // Guardar cambios en la partida del usuario actual
    localStorage.setItem(`progreso_${usuarioActivo}`, JSON.stringify(progreso));
    
    // Guardar copia rápida para lectura rápida del HUD del menú
    localStorage.setItem("logros", JSON.stringify(progreso.logros));
    console.log(`[BD] Progreso actualizado: ${nivelId} completado para ${usuarioActivo}.`);
}

function registrarDescubrimiento(textoDescubrimiento) {
    const progreso = obtenerProgresoActual();
    const usuarioActivo = localStorage.getItem("usuarioActivo") || "invitado";
    
    if (!progreso.descubrimientos.includes(textoDescubrimiento)) {
        progreso.descubrimientos.push(textoDescubrimiento);
        localStorage.setItem(`progreso_${usuarioActivo}`, JSON.stringify(progreso));
        console.log(`[BD] Descubrimiento guardado: "${textoDescubrimiento}"`);
    }
}

// Inicializar base de datos automáticamente al enlazar este archivo
inicializarBaseDatos();
