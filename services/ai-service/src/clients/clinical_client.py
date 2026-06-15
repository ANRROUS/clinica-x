import httpx
from src.logger import logger


class ClinicalServiceClient:
    def __init__(self, base_url: str, jwt_token: str):
        self.base_url = base_url.rstrip("/")
        self.headers = {
            "Authorization": f"Bearer {jwt_token}",
            "Content-Type": "application/json",
        }

    async def get_patient_history(self, patient_id: str, desde: str | None = None, hasta: str | None = None) -> dict:
        url = f"{self.base_url}/api/medical/doctor/patient/{patient_id}/history"
        params = {}
        if desde:
            params["desde"] = desde
        if hasta:
            params["hasta"] = hasta

        async with httpx.AsyncClient() as client:
            resp = await client.get(url, headers=self.headers, params=params, timeout=30)
            if resp.status_code != 200:
                logger.error(f"Clinical service error {resp.status_code}: {resp.text}")
                return {"consultations": []}
            return resp.json().get("data", {"consultations": []})

    async def get_analysis_results(self, patient_id: str, biomarcador: str | None = None) -> dict:
        url = f"{self.base_url}/api/medical/doctor/patient/{patient_id}/analysis-results"
        params = {}
        if biomarcador:
            params["biomarcador"] = biomarcador

        async with httpx.AsyncClient() as client:
            resp = await client.get(url, headers=self.headers, params=params, timeout=30)
            if resp.status_code != 200:
                logger.error(f"Clinical service error {resp.status_code}: {resp.text}")
                return {"results": []}
            return resp.json().get("data", {"results": []})

    async def get_patient_medications(self, patient_id: str) -> dict:
        url = f"{self.base_url}/api/medical/doctor/patient/{patient_id}/medications"

        async with httpx.AsyncClient() as client:
            resp = await client.get(url, headers=self.headers, timeout=30)
            if resp.status_code != 200:
                logger.error(f"Clinical service error {resp.status_code}: {resp.text}")
                return {"medications": []}
            return resp.json().get("data", {"medications": []})
