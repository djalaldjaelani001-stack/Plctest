const WebSocket = require('ws');

// Membuka port server (Render/Railway akan mendeteksi port ini secara otomatis)
const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

console.log(`Server Broker PLC Jaelani aktif di port ${PORT}`);

wss.on('connection', (ws, req) => {
    console.log(`PLC Baru Terhubung dari internet: ${req.socket.remoteAddress}`);

    // Logika Relay M2M otomatis saat menerima data dari salah satu PLC
    ws.on('message', (message) => {
        let msgString = message.toString();
        console.log(`Menerima Paket SCADA: ${msgString}`);

        // BROADCAST: Kirim data ini ke SEMUA PLC lain yang sedang online
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msgString);
            }
        });
    });

    ws.on('close', () => {
        console.log('Salah satu PLC terputus.');
    });
});
