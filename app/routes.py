from fastapi import APIRouter
from types import SimpleNamespace


pages = SimpleNamespace(
    router=APIRouter()
)

auth = SimpleNamespace(
    router=APIRouter()
)

planners = SimpleNamespace(
    router=APIRouter()
)

api = SimpleNamespace(
    router=APIRouter()
)


@pages.router.get("/")
def home():
    return {
        "message": "Welcome to PocketSmart AI"
    }


@api.router.get("/test")
def test():
    return {
        "status": "ok"
    }