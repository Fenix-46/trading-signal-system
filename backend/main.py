from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI(title="Trading Signal System API")


@app.get("/")
def read_root() -> JSONResponse:
    return JSONResponse({"status": "ok", "service": "trading-signal-system"})


@app.get("/health")
def health_check() -> JSONResponse:
    return JSONResponse({"status": "ok"})


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
