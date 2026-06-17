from datetime import datetime
from pydantic import BaseModel, Field


class ChatMessageDTO(BaseModel):
    id: str
    pacienteId: str
    medicoId: str
    consultaId: str | None = None
    role: str
    content: str
    toolUsed: str | None = None
    creadoEn: datetime


class ChatRequest(BaseModel):
    patientId: str = Field(..., description="UUID del paciente")
    consultationId: str | None = Field(None, description="UUID de la consulta activa")
    message: str = Field(..., min_length=1, description="Mensaje del médico")


class ChatResponse(BaseModel):
    success: bool
    data: dict


class ChatHistoryResponse(BaseModel):
    success: bool
    data: list[ChatMessageDTO]
