from flask import Flask
import os

app = Flask(__name__)

# Tạo ID đơn giản để phân biệt instance
instance_id = os.environ.get('HOSTNAME', 'unknown')

@app.route('/')
def home():
    return f"Hello from Flask instance: {instance_id}!"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)