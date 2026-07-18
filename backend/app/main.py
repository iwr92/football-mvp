from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.fixtures import router as fixtures_router


app = FastAPI(title="EdgeMatch API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(fixtures_router)


@app.get("/")
def root():
    return {
        "status": "running",
        "service": "EdgeMatch API",
    }