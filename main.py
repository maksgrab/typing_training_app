from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import os

app = FastAPI()

# Mount static files for CSS and JS
app.mount("/static", StaticFiles(directory="static"), name="static")

# Setup templates
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/api/text")
async def get_text():
    """Load text from a text file"""
    try:
        with open("sample_text.txt", "r", encoding="utf-8") as file:
            content = file.read().strip()
        return {"text": content}
    except FileNotFoundError:
        # Default text if file doesn't exist
        default_text = "The quick brown fox jumps over the lazy dog. This is a sample text for typing practice."
        return {"text": default_text}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
