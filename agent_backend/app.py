from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.agent import router as AgentRouter
from routes.auth import router as AuthRouter
from routes.credit import router as CreditRouter
from routes.utils import router as UtilsRouter
import config

# Initialize FastAPI app
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.on_event("startup")
async def start_database():
    import core.database


# Include routers
app.include_router(AgentRouter, tags=['Agent'], prefix='/api/agent') # Include the agent router
app.include_router(AuthRouter, tags=['Auth'], prefix='/api/auth') # Include the auth router
app.include_router(CreditRouter, tags=['Credit'], prefix='/api/credit') # Include the credit router
app.include_router(UtilsRouter, tags=['Utils'], prefix='/api') # Include the utils router