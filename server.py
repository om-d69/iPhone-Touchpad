from flask import Flask
from flask_socketio import SocketIO
import pyautogui

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

SCROLL_SENSITIVITY = 1.5
ZOOM_SENSITIVITY = 0.2

@socketio.on('move')
def handle_move(data):
    dx = data.get('dx', 0)
    dy = data.get('dy', 0)
    pyautogui.moveRel(dx, dy)
    print(f"Moved mouse: {dx}, {dy}")

@socketio.on('click')
def handle_click(data):
    button = data.get('button', 'left')
    print(f" Click command received: {button}")
    pyautogui.click(button=button)
    print(f"Clicked: {button}")

def handle_scroll(data):
    dy = data['dy']
    pyautogui.scroll(int(-dy*SCROLL_SENSITIVITY))
    print(f"Scrolled: dy={dy}")

def handle_zoom(data):
    delta = data['delta']
    if abs(delta)>10:
        if delta>0:
            pyautogui.hotkey('ctrl', '+')
            print('zoom in')

        else:
            pyautogui.hotkey('ctr', '-')
            print("zoom out")

@app.route('/')
def index():
    return " Flask server running."

if __name__ == '__main__':
    print(" Server running at http://0.0.0.0:5000")
    socketio.run(app, host='0.0.0.0', port=5000)

