from sqlalchemy import create_engine
from dotenv import load_dotenv, dotenv_values

load_dotenv()
config = dotenv_values(".env")

connection_string = config["DB_CONNECTION_STRING"]
engine = create_engine()

print("Hello World!")