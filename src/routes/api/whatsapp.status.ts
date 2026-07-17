import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";
import { getWhatsAppStatus } from "../../lib/whatsapp";

export const APIRoute = createAPIFileRoute("/api/whatsapp/status")({
  GET: async () => {
    const status = getWhatsAppStatus();
    return json(status);
  },
});
