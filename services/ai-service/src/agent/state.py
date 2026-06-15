from typing import TypedDict, Any


class AgentState(TypedDict):
    patient_id: str
    consultation_id: str | None
    doctor_id: str
    question: str
    intent: dict | None
    tool_result: str | None
    response: str | None
    error: str | None
    clinical_client: Any  # ClinicalServiceClient instance
