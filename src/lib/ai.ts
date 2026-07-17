import { generateText, streamText } from "ai";
import { openai } from "@ai-sdk/openai";

// Esta função simula o comportamento do Agente IA respondendo a uma mensagem
export async function responderMensagemAgente(mensagemUsuario: string, contextoImobiliaria: string) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: `Você é um Agente IA especialista em imóveis urbanos e rurais.
Aja como um assistente amigável da imobiliária. 
Contexto da Imobiliária: ${contextoImobiliaria}

Sua missão é responder às dúvidas, qualificar o lead (perguntando o que busca, região e orçamento) e ser cordial.`,
      prompt: mensagemUsuario,
    });
    
    return text;
  } catch (error) {
    console.error("Erro no Agente IA:", error);
    return "Desculpe, estou enfrentando instabilidades no momento.";
  }
}
