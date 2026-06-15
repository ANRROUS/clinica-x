import json
from src.clients.clinical_client import ClinicalServiceClient


async def obtenerResumenConsultas(
    paciente_id: str,
    limite_meses: int,
    clinical_client: ClinicalServiceClient,
) -> str:
    from datetime import datetime, timedelta, timezone

    hasta = datetime.now(timezone.utc)
    desde = hasta - timedelta(days=limite_meses * 30)
    result = await clinical_client.get_patient_history(
        paciente_id,
        desde=desde.strftime("%Y-%m-%d"),
        hasta=hasta.strftime("%Y-%m-%d"),
    )
    return json.dumps(result.get("consultations", []), ensure_ascii=False, default=str)


async def obtenerEvolucionBiomarcador(
    paciente_id: str,
    nombre_biomarcador: str,
    clinical_client: ClinicalServiceClient,
) -> str:
    result = await clinical_client.get_analysis_results(paciente_id, nombre_biomarcador or None)
    return json.dumps(result.get("results", []), ensure_ascii=False, default=str)


async def obtenerMedicacionActiva(
    paciente_id: str,
    clinical_client: ClinicalServiceClient,
) -> str:
    result = await clinical_client.get_patient_medications(paciente_id)
    return json.dumps(result.get("medications", []), ensure_ascii=False, default=str)


TOOL_REGISTRY = {
    "obtenerResumenConsultas": obtenerResumenConsultas,
    "obtenerEvolucionBiomarcador": obtenerEvolucionBiomarcador,
    "obtenerMedicacionActiva": obtenerMedicacionActiva,
}


async def ejecutar_tool(tool_name: str, params: dict, clinical_client: ClinicalServiceClient) -> str:
    tool_fn = TOOL_REGISTRY.get(tool_name)
    if not tool_fn:
        return json.dumps({"error": f"Herramienta '{tool_name}' no encontrada"})
    return await tool_fn(**params, clinical_client=clinical_client)
