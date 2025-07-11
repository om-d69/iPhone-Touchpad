# iPhone as Wireless Touchpad for Laptop

##  Project Overview

This project transforms your iPhone into a wireless touchpad for your laptop. It supports:

* Mouse movement
* Left and right clicks
* Vertical scrolling
* Pinch-to-zoom gestures

Built using **React Native with Expo**, **Socket.IO**, and **Python with Flask**, this project communicates touch gestures from the phone to the laptop in real-time.

---

##  Getting Started

###  Requirements

* **Node.js** installed
* **Python 3** installed
* **Expo Go app** on iPhone
* **React Native environment** setup via Expo
* **Flask and Flask-SocketIO** installed in Python

###  Project Structure

```
touchpad-app/
├── App.tsx                # React Native front-end
├── server.py              # Flask + SocketIO server
├── package.json           # Node modules config
├── ...
```

##  Phase 1: Socket Server with Raw Python (FAILED)

Initially, we started using a **basic Python socket server** with `socket` and `pyautogui`. It worked for mouse movement, but had problems:

* Could not support HTTPS or public access
* Required tools like **Ngrok**, which failed due to credit card limits
* Click gestures weren't consistent

So we **scrapped this method** and moved to a Flask-based solution.

##  Phase 2: Flask + Socket.IO (SUCCESS ✅)

Switched to **Flask-SocketIO**, allowing smoother communication with React Native and easier server management.

###  Server Requirements

Install dependencies:

```bash
pip install flask flask-socketio pyautogui
```

Start the server:

```bash
python server.py
```

###  What Changed:

* Flask automatically handles events and connections better
* No more need for Ngrok or port tunneling
* Easier to expand with gesture recognition

---

##  React Native Frontend (Expo)

I had **no experience with React Native or Node.js** before starting this project. Learning was challenging but worth it.

I picked up:

* Basic **JS/TS** syntax
* How to use **Socket.IO client** in React Native
* Gesture handling with `onTouchMove`, `onTouchStart`, and `onTouchEnd`

### Main Features:

* One-finger drag for mouse movement
* Buttons for left/right click
* Two-finger scroll (vertical)
* Pinch to zoom (in/out)

---

##  How to Use

1. Clone the repo and navigate to the project folder
2. Start the Flask server:

   ```bash
   python server.py
   ```
3. Run the React Native app:

   ```bash
   npm start
   ```
4. Scan QR code using **Expo Go** app on iPhone
5. Start using your iPhone as a wireless mouse!

---

##  What I Learned

* Flask-SocketIO integration with real-time apps
* React Native basics: hooks, styles, touch events
* Troubleshooting cross-platform communication
* Network and firewall setup for local IP access

This project pushed me out of my comfort zone, but I learned practical client-server architecture using real-time technologies.

