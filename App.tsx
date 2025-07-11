import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  GestureResponderEvent,
  PanResponder,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { io, Socket } from 'socket.io-client';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [lastTouch, setLastTouch] = useState<{ x: number; y: number } | null>(null);
  const [connected, setConnected] = useState(false);
  const [initialDistance, setInitialDistance] = useState<number | null>(null);
  const socketRef = useRef<Socket | null>(null);

  
  useEffect(() => {
    const newSocket = io('http://192.168.1.106:5000'); 
    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      console.log(' Connected to server');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log(' Disconnected from server');
      setConnected(false);
    });

    return () => newSocket.disconnect();
  }, 
  []);

  
  const handleTouchMove = (e: GestureResponderEvent) => {
    const touches = e.nativeEvent.touches;

    if (touches.length === 1) {
      const { locationX, locationY } = touches[0];
      if (lastTouch) {
        const dx = locationX - lastTouch.x;
        const dy = locationY - lastTouch.y;
        console.log('Moved:', dx, dy);
        socketRef.current?.emit('move', { dx, dy });
      }
      setLastTouch({ x: locationX, y: locationY });
    }

    
    if (touches.length === 2) {
      const y1 = touches[0].pageY;
      const y2 = touches[1].pageY;
      const avgY = (y1 + y2) / 2;
      socketRef.current?.emit('scroll', { dy: avgY });
    }

    
    if (touches.length === 2) {
      const dx = touches[0].pageX - touches[1].pageX;
      const dy = touches[0].pageY - touches[1].pageY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (initialDistance) {
        const zoomDelta = distance - initialDistance;
        socketRef.current?.emit('zoom', { delta: zoomDelta });
      }
      setInitialDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    setLastTouch(null);
    setInitialDistance(null);
  };

  
  const handleClick = (buttonType: 'left' | 'right') => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('click', { button: buttonType });
      console.log(` ${buttonType} click sent`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📱 iPhone Touchpad</Text>
      <Text style={styles.status}>{connected ? ' Connected to Server' : ' Not Connected'}</Text>

      <View
        style={styles.touchpad}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={() => handleClick('left')}>
          <Text style={styles.buttonText}>Left Click</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleClick('right')}>
          <Text style={styles.buttonText}>Right Click</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 4
  },
  status: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 12
  },
  touchpad: {
    width: '90%',
    height: height * 0.75,
    backgroundColor: '#333',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#4CAF50',
    marginBottom: 20
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%'
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 20
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  }
});
