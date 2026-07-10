from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.analyze import router as analyze_router
from app.api.fixtures import router as fixtures_router

app = FastAPI(
    title="Football Analytics MVP",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_router)
app.include_router(fixtures_router)


@app.get("/")
def root():
    return {
        "project": "Football Analytics MVP",
        "status": "running",
    }