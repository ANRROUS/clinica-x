import json
from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from src.agent.state import AgentState
from src.agent.prompts import ROUTER_SYSTEM_PROMPT, SYNTHESIZER_SYSTEM_PROMPT
from src.agent.tools import ejecutar_tool
from src.clients.clinical_client import ClinicalServiceClient
from src.config import settings

router_llm = ChatGoogleGenerativeAI(
    model=settings.GEMINI_MODEL,
    api_key=settings.GEMINI_API_KEY,
    temperature=0.1,
    timeout=settings.AI_TIMEOUT_MS / 1000,
)

synthesizer_llm = ChatGoogleGenerativeAI(
    model=settings.GEMINI_MODEL,
    api_key=settings.GEMINI_API_KEY,
    temperature=0.3,
    timeout=settings.AI_TIMEOUT_MS / 1000,
)


def router_node(state: AgentState) -> dict:
    messages = [
        {"role": "system", "content": ROUTER_SYSTEM_PROMPT},
        {"role": "user", "content": f"Pregunta del médico: {state['question']}\n\nContexto: paciente_id={state['patient_id']}"},
    ]
    response = router_llm.invoke(messages)
    content = response.content.strip()

    if content.startswith("```"):
        content = content.strip("```json").strip("```").strip()

    try:
        intent = json.loads(content)
    except json.JSONDecodeError:
        intent = {"tool": "ninguna", "params": {}, "reason": "No se pudo interpretar la pregunta"}

    return {"intent": intent}


async def tool_executor_node(state: AgentState) -> dict:
    intent = state.get("intent", {})
    tool_name = intent.get("tool", "ninguna")
    clinical_client: ClinicalServiceClient = state.get("clinical_client")

    if tool_name == "ninguna":
        return {"tool_result": json.dumps({"data": [], "message": intent.get("reason", "No se puede responder")})}

    if not clinical_client:
        return {"tool_result": json.dumps({"error": "Cliente clínico no disponible"})}

    params = intent.get("params", {})
    params["paciente_id"] = state["patient_id"]

    try:
        result = await ejecutar_tool(tool_name, params, clinical_client)
        return {"tool_result": result}
    except Exception as e:
        return {"tool_result": json.dumps({"error": str(e), "message": "Error al obtener datos"})}


def synthesizer_node(state: AgentState) -> dict:
    intent = state.get("intent", {})
    tool_name = intent.get("tool", "ninguna")
    tool_result_str = state.get("tool_result", "{}")
    question = state["question"]

    try:
        tool_result_obj = json.loads(tool_result_str)
        if isinstance(tool_result_obj, list):
            data_preview = json.dumps(tool_result_obj, indent=2, ensure_ascii=False)[:3000]
        else:
            data_preview = json.dumps(tool_result_obj, indent=2, ensure_ascii=False)[:3000]
    except json.JSONDecodeError:
        data_preview = tool_result_str[:3000]

    messages = [
        {"role": "system", "content": SYNTHESIZER_SYSTEM_PROMPT},
        {
            "role": "user",
            "content": f"""
Pregunta original del médico: {question}
Herramienta utilizada: {tool_name}
Datos obtenidos:
```json
{data_preview}
```

Redacta una respuesta clara y concisa para el médico basada en estos datos.
""",
        },
    ]

    response = synthesizer_llm.invoke(messages)
    return {"response": response.content.strip()}


def build_graph() -> StateGraph:
    graph = StateGraph(AgentState)

    graph.add_node("router", router_node)
    graph.add_node("tool_executor", tool_executor_node)
    graph.add_node("synthesizer", synthesizer_node)

    graph.set_entry_point("router")
    graph.add_edge("router", "tool_executor")
    graph.add_edge("tool_executor", "synthesizer")
    graph.add_edge("synthesizer", END)

    return graph.compile()
