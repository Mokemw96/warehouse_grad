# warehouse_grad

This project contains a simple SQLite database for a sports warehouse.

## Database Schema

The database `sports_warehouse.db` contains an `inventory` table with the following columns:

- `id`: Auto-incrementing primary key (INTEGER)
- `item_name`: Name of the item (TEXT, NOT NULL)
- `sport`: Sport category (TEXT, NOT NULL)
- `quantity`: Available quantity (INTEGER, NOT NULL, DEFAULT 0)
- `price`: Price per item (REAL, NOT NULL)
- `supplier`: Supplier name (TEXT)

## Setup

To create the database, run the following command:

```bash
python3 create_database.py
```

This will create the `sports_warehouse.db` file with the table structure and insert some sample data.

## Sample Data

The database is pre-populated with sample items including basketballs, baseball bats, hockey masks, and other sports equipment.