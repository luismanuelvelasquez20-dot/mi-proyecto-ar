// =======================================================
// data.js - MOTOR DE IDENTIDAD, PUNTOS Y SEGURIDAD
// =======================================================

document.addEventListener("DOMContentLoaded", () => {
    inicializarBaseDeDatos();
});

function inicializarBaseDeDatos() {
    if (!localStorage.getItem("usuarios_registrados")) {
        // Usuarios iniciales en hibernación (Todo en false/cero)
        const dbInicial = {
            "aura": { 
                contrasena: "2026", rol: "estudiante", puntos: 0, 
                progreso: { intro: false, prueba: false, desafio: false, nucleo: false },
                logros: { relic1: false, relic2: false, relic3: false },
                descubrimientos: [] 
            },
            "visitante": { 
                contrasena: "0000", rol: "invitado", puntos: 0, 
                progreso: { intro: false, prueba: false, desafio: false, nucleo: false },
                logros: { relic1: false, relic2: false, relic3: false },
                descubrimientos: [] 
            }
        };
        localStorage.setItem("usuarios_registrados", JSON.stringify(dbInicial));
    }
}

function getUsuarioActivo() {
    return localStorage.getItem("usuarioActivo");
}

// FUNCIÓN PARA GUARDAR AVANCES (Puntos, Reliquias, Frases)
function registrarAvanceGlobal(nivelKey, relicKey, puntos, frase) {
    const user = getUsuarioActivo();
    if (!user) return;

    let usuarios = JSON.parse(localStorage.getItem("usuarios_registrados"));
    let d = usuarios[user];

    if (nivelKey) d.progreso[nivelKey] = true;
    if (relicKey) d.logros[relicKey] = true;
    
    // Sumar puntos
    if (puntos) d.puntos += puntos;
    
    // Añadir a bitácora sin duplicar
    if (frase && !d.descubrimientos.includes(frase)) {
        d.descubrimientos.push(frase);
    }

    localStorage.setItem("usuarios_registrados", JSON.stringify(usuarios));
    console.log(`[Sistema] Datos guardados exitosamente para ${user}`);
}

// FUNCIÓN DE REINICIO (Para el botón del Perfil)
function reiniciarTodoElProgreso() {
    const user = getUsuarioActivo();
    if (!user) return;

    if (confirm(`¿${user.toUpperCase()}, estás seguro de borrar todas las reliquias y puntos?`)) {
        let usuarios = JSON.parse(localStorage.getItem("usuarios_registrados"));
        
        // Formatear todo a 0 y false
        usuarios[user].puntos = 0;
        usuarios[user].progreso = { intro: false, prueba: false, desafio: false, nucleo: false };
        usuarios[user].logros = { relic1: false, relic2: false, relic3: false };
        usuarios[user].descubrimientos = [];

        localStorage.setItem("usuarios_registrados", JSON.stringify(usuarios));
        alert("Sistema reiniciado. Volviendo al estado de hibernación.");
        
        // Recargar la página para ver los cambios
        window.location.reload();
    }
}

// FUNCIÓN DE CIERRE DE SESIÓN
function cerrarSesion() {
    localStorage.removeItem("usuarioActivo");
    localStorage.removeItem("rolActivo");
    window.location.href = "index.html";
}