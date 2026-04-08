import sqlite3

# Connect to SQLite database (creates it if it doesn't exist)
conn = sqlite3.connect('sports_warehouse.db')
cursor = conn.cursor()

# Create the inventory table
cursor.execute('''
CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_name TEXT NOT NULL,
    sport TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    price REAL NOT NULL,
    supplier TEXT
)
''')

# Insert sample data
sample_data = [
    ('Basketball', 'Basketball', 50, 29.99, 'Nike'),
    ('Baseball Bat', 'Baseball', 30, 49.99, 'Louisville Slugger'),
    ('Hockey Mask', 'Hockey', 20, 39.99, 'Bauer'),
    ('Soccer Ball', 'Soccer', 40, 24.99, 'Adidas'),
    ('Tennis Racket', 'Tennis', 25, 89.99, 'Wilson'),
    ('Football', 'Football', 35, 19.99, 'Under Armour'),
    ('Golf Clubs Set', 'Golf', 15, 299.99, 'Callaway'),
    ('Volleyball', 'Volleyball', 45, 14.99, 'Mikasa')
]

cursor.executemany('''
INSERT INTO inventory (item_name, sport, quantity, price, supplier)
VALUES (?, ?, ?, ?, ?)
''', sample_data)

# Commit the changes and close the connection
conn.commit()
conn.close()

print("Sports warehouse database created successfully with sample data.")