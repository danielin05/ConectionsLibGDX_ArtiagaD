const fs = require('fs');
const webSockets = require('./utilsWebSockets.js').default;
'use strict';

class GameLogic {
    constructor() {
        this.players = new Map();
    }

    // Se conecta un cliente/jugador
    addClient(id, socket) {
        this.players.set(id, { socket });

        console.log(`[INFO] Cliente conectado con ID: ${id}`);
        return this.players.get(id);
    }

    // Se desconecta un cliente/jugador
    removeClient(id) {
        if (this.players.has(id)) {
            this.players.delete(id);
            console.log(`[INFO] Cliente con ID ${id} desconectado y eliminado del sistema.`);
        } else {
            console.warn(`[WARN] Se intentó eliminar al cliente con ID ${id}, pero no estaba registrado.`);
        }
    }

    // Procesar un mensaje recibido de un cliente/jugador
    handleMessage(id, msg, socket) {
        try {
            const obj = JSON.parse(msg);

            if (!obj.type) {
                console.warn(`[WARN] Mensaje recibido sin tipo especificado del cliente ${id}.`);
                return;
            }

            console.log(`[INFO] Mensaje recibido del cliente ${id}: tipo = "${obj.type}"`);

            switch (obj.type) {
                case "touch":
                    if (typeof obj.x === 'number' && typeof obj.y === 'number') {
                        console.log(`[INFO] Cliente ${id} tocó la posición X=${obj.x}, Y=${obj.y}`);
                        socket.send(JSON.stringify({
                            type: "touch",
                            x: obj.x,
                            y: obj.y,
                        }));
                    } else {
                        console.warn(`[WARN] Datos inválidos en mensaje "touch" del cliente ${id}.`);
                    }
                    break;

                default:
                    console.warn(`[WARN] Tipo de mensaje desconocido "${obj.type}" recibido del cliente ${id}.`);
                    break;
            }

        } catch (error) {
            console.error(`[ERROR] Fallo al procesar mensaje del cliente ${id}:`, error.message);
        }
    }
}

module.exports = GameLogic;
