import httpx
from src.logger import logger


class AuthServiceClient:
    def __init__(self, base_url: str, internal_api_key: str):
        self.base_url = base_url.rstrip("/")
        self.headers = {
            "X-Internal-Api-Key": internal_api_key,
            "Content-Type": "application/json",
        }

    async def get_users_by_ids(self, user_ids: list[str]) -> list[dict]:
        if not user_ids:
            return []
        ids_param = ",".join(user_ids)
        url = f"{self.base_url}/api/auth/internal/users?ids={ids_param}"

        async with httpx.AsyncClient() as client:
            resp = await client.get(url, headers=self.headers, timeout=10)
            if resp.status_code != 200:
                logger.error(f"Auth service error {resp.status_code}: {resp.text}")
                return []
            return resp.json().get("data", {}).get("usuarios", [])
