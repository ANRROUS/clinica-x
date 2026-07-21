import asyncio
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from src.routes import router as ai_router, get_pool, close_pool
from src.config import settings
from src.logger import logger


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"ai-service iniciando en puerto {settings.PORT}")
    logger.info(f"   Modelo Gemini: {settings.GEMINI_MODEL}")
    logger.info(f"   Clinical Service: {settings.CLINICAL_SERVICE_URL}")
    logger.info(f"   Auth Service: {settings.AUTH_SERVICE_URL}")
    if not settings.GEMINI_API_KEY:
        logger.warning("   ⚠ GEMINI_API_KEY no configurada — el chat usará respuestas simuladas")

    async def _connect_db():
        try:
            await get_pool()
            logger.info("   Conexión a BD de chat establecida")
        except asyncio.TimeoutError:
            logger.warning("   ⚠ Timeout conectando a BD de chat — continuando sin BD")
        except Exception as e:
            logger.warning(f"   ⚠ No se pudo conectar a la BD de chat: {e}")

    db_task = asyncio.create_task(_connect_db())
    yield
    db_task.cancel()
    try:
        await db_task
    except asyncio.CancelledError:
        pass
    await close_pool()
    logger.info("ai-service detenido correctamente")


app = FastAPI(
    title="Clínica X — AI Service (Agente X)",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"{request.method} {request.url.path}")
    response = await call_next(request)
    return response


@app.get("/health")
async def health():
    return {
        "success": True,
        "data": {
            "service": "ai-service",
            "status": "ok",
            "gemini_enabled": bool(settings.GEMINI_API_KEY),
            "timestamp": __import__("datetime").datetime.now().isoformat(),
        },
    }


app.include_router(ai_router, prefix="/api/ai")
