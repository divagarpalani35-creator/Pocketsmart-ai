from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

from .database import (
    Base,
    engine
)

from .routes import (
    pages,
    auth,
    planners,
    api
)


BASE_DIR = Path(
    __file__
).resolve().parent.parent


app = FastAPI(
    title="PocketSmart AI",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


app.mount(
    "/static",
    StaticFiles(
        directory=BASE_DIR / "static"
    ),
    name="static"
)


app.state.templates = (
    Jinja2Templates(
        directory=BASE_DIR / "templates"
    )
)


app.include_router(
    pages.router
)

app.include_router(
    auth.router
)

app.include_router(
    planners.router
)

app.include_router(
    api.router,
    prefix="/api"
)


@app.on_event("startup")
def startup():

    Base.metadata.create_all(
        bind=engine
    )


@app.get("/health")
def health():

    return {
        "status": "ok",
        "service":
            "PocketSmart AI"
    }


@app.get("/startup")
def startup_status():

    return {
        "status": "ready",
        "message":
            "PocketSmart AI services initialized"
    }


if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )