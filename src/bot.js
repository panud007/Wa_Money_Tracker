import makeWASocket, {
    DisconnectReason,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import qrcodeTerminal from 'qrcode-terminal';
import QRCode from 'qrcode';
import { handleMessage } from './handlers/messageHandler.js';

/**
 * Start WhatsApp bot
 */
async function startBot() {
    console.log('🤖 Starting Money Flow Bot...\n');

    // Get latest Baileys version
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`Using WA v${version.join('.')}, isLatest: ${isLatest}`);

    // Load auth state
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    // Create socket connection
    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        getMessage: async (key) => {
            return { conversation: '' };
        },
    });

    // Handle connection updates
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        // Display QR code
        if (qr) {
            console.log('\n📱 Scan QR code di bawah ini dengan WhatsApp:\n');
            qrcodeTerminal.generate(qr, { small: true });

            try {
                await QRCode.toFile('qrcode.png', qr);
                console.log('\n📸 QR Code juga disimpan sebagai gambar: qrcode.png');
                console.log('Silakan buka file qrcode.png untuk scan lebih jelas.\n');
            } catch (err) {
                console.error('Gagal menyimpan QR code sebagai gambar:', err);
            }

            console.log('\nBuka WhatsApp > Perangkat Tertaut > Tautkan Perangkat\n');
        }

        // Handle connection status
        if (connection === 'close') {
            const shouldReconnect =
                (lastDisconnect?.error instanceof Boom &&
                    lastDisconnect.error.output?.statusCode !== DisconnectReason.loggedOut) ||
                true; // Force reconnect on most errors to keep bot alive

            console.log('❌ Connection closed. Reconnecting:', shouldReconnect);

            // Log the specific error for debugging
            if (lastDisconnect?.error) {
                console.error('Reason:', lastDisconnect.error);
            }

            if (shouldReconnect) {
                // Wait 3 seconds before reconnecting
                setTimeout(startBot, 3000);
            } else {
                console.log('🔒 Logged out. If this persists, delete auth_info_baileys and restart.');
                // Even on logout, sometimes it's better to just try again unless explicitly logged out by user
                // process.exit(0); 
                setTimeout(startBot, 5000);
            }
        } else if (connection === 'open') {
            console.log('✅ Bot connected successfully!');
            console.log('🎉 Money Flow Bot is ready to receive messages!\n');
            console.log('📝 Send a message to the bot to start tracking your money flow.\n');
        }
    });

    // Save credentials when updated
    sock.ev.on('creds.update', saveCreds);

    // Handle incoming messages
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;

        for (const message of messages) {
            // Ignore messages from self
            if (message.key.fromMe) continue;

            // Handle the message
            await handleMessage(sock, message);
        }
    });

    return sock;
}

// Start the bot
startBot().catch((error) => {
    console.error('❌ Error starting bot:', error);
    process.exit(1);
});
