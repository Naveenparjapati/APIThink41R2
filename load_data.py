import csv
import mysql.connector

conn = mysql.connector.connect(
    host='localhost',
    user='root',
    password='yourpassword',
    database='chatdb'
)
cursor = conn.cursor()

with open('your_ecommerce_data.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        cursor.execute("INSERT INTO orders (order_id, user_email, status) VALUES (%s, %s, %s)", 
                       (row['order_id'], row['email'], row['status']))
conn.commit()
cursor.close()
conn.close()
