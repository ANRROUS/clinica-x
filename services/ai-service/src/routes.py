import json
from fastapi import APIRouter, HTTPException, Depends, Request
from src.models.chat import ChatRequest, ChatResponse
from src.agent.graph import build_graph
from src.agent.state import AgentState
from src.clients.clinical_client import ClinicalServiceClient
from src.auth import get_doctor_id_from_token, get_token_from_header
from src.config import settings
from src.logger import logger

router = APIRouter()
agent_graph = build_graph()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, http_request: Request, doctor_id: str = Depends(get_doctor_id_from_token)):
    try:
        jwt_token = get_token_from_header(http_request) or ""

        clinical_client = ClinicalServiceClient(settings.CLINICAL_SERVICE_URL, jwt_token)

        state: AgentState = {
            "patient_id": request.patientId,
            "consultation_id": request.consultationId,
            "doctor_id": doctor_id,
            "question": request.message,
            "intent": None,
            "tool_result": None,
            "response": None,
            "error": None,
            "clinical_client": clinical_client,
        }

        result = await agent_graph.ainvoke(state)

        reply = result.get("response", "Lo siento, no pude procesar tu consulta.")
        intent = result.get("intent", {})
        tool_name = intent.get("tool", "")

        await _save_chat_message(
            paciente_id=request.patientId,
            medico_id=doctor_id,
            consulta_id=request.consultationId,
            role="user",
            content=request.message,
        )
        await _save_chat_message(
            paciente_id=request.patientId,
            medico_id=doctor_id,
            consulta_id=request.consultationId,
            role="assistant",
            content=reply,
            tool_used=tool_name,
            metadata=json.dumps({"tool_result": result.get("tool_result", "")}),
        )

        return ChatResponse(success=True, data={"reply": reply, "toolUsed": tool_name})

    except Exception as e:
        logger.exception("Error en chat endpoint")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/chat/history/{patient_id}", response_model=ChatResponse)
async def chat_history(patient_id: str, doctor_id: str = Depends(get_doctor_id_from_token)):
    try:
        import asyncpg

        pool = await asyncpg.create_pool(
            settings.DIRECT_URL or settings.DATABASE_URL,
            min_size=1,
            max_size=2,
        )
        async with pool.acquire() as conn:
            rows = await conn.fetch(
                """
                SELECT id, paciente_id, medico_id, consulta_id, role, content, tool_used, creado_en
                FROM chat_service.chat_messages
                WHERE paciente_id = $1 AND medico_id = $2
                ORDER BY creado_en ASC
                """,
                patient_id,
                doctor_id,
            )
        await pool.close()

        messages = []
        for r in rows:
            messages.append({
                "id": str(r["id"]),
                "pacienteId": str(r["paciente_id"]),
                "medicoId": str(r["medico_id"]),
                "consultaId": str(r["consulta_id"]) if r["consulta_id"] else None,
                "role": r["role"],
                "content": r["content"],
                "toolUsed": r["tool_used"],
                "creadoEn": r["creado_en"].isoformat() if r["creado_en"] else None,
            })
        return ChatResponse(success=True, data={"messages": messages})

    except Exception as e:
        logger.exception("Error en chat history endpoint")
        raise HTTPException(status_code=500, detail=str(e))


async def _save_chat_message(
    paciente_id: str,
    medico_id: str,
    consulta_id: str | None,
    role: str,
    content: str,
    tool_used: str | None = None,
    metadata: str | None = None,
):
    import asyncpg

    pool = await asyncpg.create_pool(
        settings.DIRECT_URL or settings.DATABASE_URL,
        min_size=1,
        max_size=2,
    )
    async with pool.acquire() as conn:
        if metadata:
            await conn.execute(
                """
                INSERT INTO chat_service.chat_messages
                    (paciente_id, medico_id, consulta_id, role, content, tool_used, metadata)
                VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
                """,
                paciente_id, medico_id, consulta_id, role, content, tool_used, metadata,
            )
        else:
            await conn.execute(
                """
                INSERT INTO chat_service.chat_messages
                    (paciente_id, medico_id, consulta_id, role, content, tool_used)
                VALUES ($1, $2, $3, $4, $5, $6)
                """,
                paciente_id, medico_id, consulta_id, role, content, tool_used,
            )
    await pool.close()
