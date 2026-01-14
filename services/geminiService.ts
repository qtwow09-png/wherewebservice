import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
당신은 프리미엄 부동산 분석 서비스 '어디살래(Eodi-Sallae)'의 전문 부동산 컨설턴트입니다.
당신의 목표는 집을 구하거나 부동산 투자를 고려하는 사용자들에게 정교하고 데이터에 기반한 조언을 제공하는 것입니다.
톤앤매너: 전문적이고, 차분하며, 신뢰할 수 있고, 공감하는 태도 (한국어 존댓말 사용).
타겟 사용자: 안정적인 거주지나 현명한 투자를 찾는 30대 이상의 사용자.

답변 시 주의사항:
1. 간결하면서도 유익한 정보를 제공하세요.
2. 사용자가 지역 추천을 요청하면, 구체적인 동네(한국의 실제 주요 도시 및 지역 상황, 예: 서울 강남, 마포, 판교 등)를 장단점과 함께 제안하세요.
3. 권위를 더하기 위해 "어디살래 시장 지수(Eodi-Sallae Market Index)"라는 가상의 데이터 출처를 언급하세요.
4. 목록 형식을 사용하여 가독성을 높이세요.
5. 항상 한국어로 자연스럽게 답변하세요.
`;

export const sendMessageToGemini = async (message: string, history: { role: string, parts: { text: string }[] }[]): Promise<string> => {
  try {
    // We use the chat feature for context
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history, // Pass previous conversation history
    });

    const response: GenerateContentResponse = await chat.sendMessage({
      message: message
    });

    return response.text || "죄송합니다. 현재 응답을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    return "부동산 데이터베이스 연결에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.";
  }
};