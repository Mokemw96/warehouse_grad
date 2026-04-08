from models import Inventory, engine
from sqlmodel import Session, select

print('Models imported successfully')

with Session(engine) as session:
    statement = select(Inventory)
    results = session.exec(statement)
    items = results.all()
    print(f'Found {len(items)} items in database')
    if items:
        print(f'First item: {items[0].item_name} - {items[0].sport}')