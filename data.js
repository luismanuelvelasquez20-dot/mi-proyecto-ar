// =======================================================
// data.js - MOTOR DE IDENTIDAD Y AUTO-REPARACIÓN
// =======================================================

document.addEventListener("DOMContentLoaded", () => {
    inicializarBaseDeDatos();
});

function inicializarBaseDeDatos() {
    if (!localStorage.getItem("usuarios_registrados")) {
        const dbInicial = {
            "aura": { 
                contrasena: "2026", rol: "estudiante", puntos: 0, 
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

function registrarAvanceGlobal(nivelKey, relicKey, puntos, frase) {
    const user = getUsuarioActivo();
    if (!user) return;

    let usuarios = JSON.parse(localStorage.getItem("usuarios_registrados")) || {};
    let d = usuarios[user];

    if (!d) return;

    // --- AUTO-REPARACIÓN DE ESTRUCTURA ---
    if (!d.logros) d.logros = { relic1: false, relic2: false, relic3: false };
    if (!d.progreso) d.progreso = { intro: false, prueba: false, desafio: false, nucleo: false };
    if (!d.descubrimientos) d.descubrimientos = [];
    if (d.puntos === undefined) d.puntos = 0;

    // Guardar Avances
    if (nivelKey) d.progreso[nivelKey] = true;
    if (relicKey) d.logros[relicKey] = true;
    if (puntos) d.puntos += puntos;
    if (frase && !d.descubrimientos.includes(frase)) {
        d.descubrimientos.push(frase);
    }

    localStorage.setItem("usuarios_registrados", JSON.stringify(usuarios));
    console.log("Datos sincronizados para:", user);
}

function reiniciarTodoElProgreso() {
    const user = getUsuarioActivo();
    if (!user) return;
    if (confirm("¿Seguro que quieres borrar todas tus reliquias y puntos?")) {
        let usuarios = JSON.parse(localStorage.getItem("usuarios_registrados"));
        usuarios[user].puntos = 0;
        usuarios[user].progreso = { intro: false, prueba: false, desafio: false, nucleo: false };
        usuarios[user].logros = { relic1: false, relic2: false, relic3: false };
        usuarios[user].descubrimientos = [];
        localStorage.setItem("usuarios_registrados", JSON.stringify(usuarios));
        window.location.reload();
    }
}
