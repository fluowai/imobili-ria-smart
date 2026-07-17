import { Client, LocalAuth, type Message } from "whatsapp-web.js";

// Estendemos o global para evitar reinstanciar no Hot Reload do Vite
declare global {
  var __whatsappClient: Client | undefined;
  var __whatsappQr: string | null;
  var __whatsappStatus: "disconnected" | "connecting" | "connected";
}

let client: Client;

if (globalThis.__whatsappClient) {
  client = globalThis.__whatsappClient;
} else {
  client = new Client({
    authStrategy: new LocalAuth({
      dataPath: "./whatsapp-sessions", // Salva na pasta raiz do projeto
    }),
    puppeteer: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Necessário para rodar no Docker/Linux
    },
  });

  globalThis.__whatsappStatus = "disconnected";
  globalThis.__whatsappQr = null;

  client.on("qr", (qr) => {
    console.log("QR Code recebido. Escaneie para conectar.");
    globalThis.__whatsappQr = qr;
    globalThis.__whatsappStatus = "connecting";
  });

  client.on("ready", () => {
    console.log("WhatsApp conectado e pronto!");
    globalThis.__whatsappQr = null;
    globalThis.__whatsappStatus = "connected";
  });

  client.on("disconnected", (reason) => {
    console.log("WhatsApp desconectado:", reason);
    globalThis.__whatsappStatus = "disconnected";
    globalThis.__whatsappQr = null;
  });

  client.on("message_create", async (msg: Message) => {
    // Processa apenas mensagens recebidas (se quiser processar as enviadas pelo celular, tire o if)
    if (msg.fromMe) return;

    console.log(`Mensagem de ${msg.from}: ${msg.body}`);
    
    // Aqui integraremos a gravação no banco de dados (tabela mensagens)
    // e o envio para a IA (Agente IA)
  });

  client.initialize().catch(console.error);

  globalThis.__whatsappClient = client;
}

export const getWhatsAppStatus = () => {
  return {
    status: globalThis.__whatsappStatus || "disconnected",
    qr: globalThis.__whatsappQr,
  };
};

export const getWhatsAppClient = () => client;
