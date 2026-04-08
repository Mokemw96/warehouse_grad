from sqlmodel import SQLModel, Field
from sqlalchemy import create_engine

class Inventory(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    item_name: str
    sport: str
    quantity: int = Field(default=0)
    price: float
    supplier: str | None = None

# Create the database engine
engine = create_engine("sqlite:///sports_warehouse.db")