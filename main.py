from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, HTTPException, status
from sqlmodel import Session, select

from models import Inventory, engine

app = FastAPI()

@app.get("/inventory", response_model=list[Inventory])
def get_inventory():
    with Session(engine) as session:
        statement = select(Inventory)
        results = session.exec(statement)
        return results.all()

@app.delete("/inventory /{id}")  
def delete_item(id: int):
    with Session(engine) as session:
        item = session.get(Inventory, id)
        if not item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inventory item not found")
        session.delete(item)
        session.commit()
        return

@app.post("/inventory", response_model=Inventory, status_code=status.HTTP_201_CREATED)
def add_item(item: Inventory):
    with Session(engine) as session:
        session.add(item)
        session.commit()
        session.refresh(item)
        return item

@app.put("/inventory/{id}", response_model=Inventory)
def update_item(id: int, updated_item: Inventory):
    with Session(engine) as session:
        item = session.get(Inventory, id)
        if not item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inventory item not found")
        item.item_name = updated_item.item_name
        item.sport = updated_item.sport
        item.quantity = updated_item.quantity
        item.price = updated_item.price
        item.supplier = updated_item.supplier
        session.add(item)
        session.commit()
        session.refresh(item)
        return item

app.mount("/", StaticFiles(directory="static", html=True), name="static")