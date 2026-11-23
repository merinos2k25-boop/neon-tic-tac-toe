import Peer from 'peerjs';

class P2PManager {
  constructor() {
    this.peer = null;
    this.conn = null;
    this.roomId = null;
    this.isHost = false;
    this.callbacks = {
      onConnect: () => {},
      onData: () => {},
      onClose: () => {},
      onError: () => {}
    };
  }

  // Generate random 5-character readable code
  generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  createRoom(customCode = null, callbacks = {}) {
    this.destroy();
    this.callbacks = { ...this.callbacks, ...callbacks };
    this.isHost = true;
    const code = customCode || this.generateCode();
    this.roomId = code;

    // Use a clean prefix to avoid collision on public PeerJS server
    const peerId = `neonglow-ttt-${code.toLowerCase()}`;

    return new Promise((resolve, reject) => {
      this.peer = new Peer(peerId, {
        debug: 1
      });

      this.peer.on('open', (id) => {
        resolve(code);
      });

      this.peer.on('connection', (conn) => {
        this.conn = conn;
        this.setupConnection();
        this.callbacks.onConnect(true);
      });

      this.peer.on('error', (err) => {
        this.callbacks.onError(err);
        reject(err);
      });
    });
  }

  joinRoom(code, callbacks = {}) {
    this.destroy();
    this.callbacks = { ...this.callbacks, ...callbacks };
    this.isHost = false;
    this.roomId = code.toUpperCase().trim();

    const hostPeerId = `neonglow-ttt-${this.roomId.toLowerCase()}`;

    return new Promise((resolve, reject) => {
      this.peer = new Peer({
        debug: 1
      });

      this.peer.on('open', () => {
        this.conn = this.peer.connect(hostPeerId, {
          reliable: true
        });

        this.setupConnection();

        this.conn.on('open', () => {
          this.callbacks.onConnect(false);
          resolve(true);
        });
      });

      this.peer.on('error', (err) => {
        this.callbacks.onError(err);
        reject(err);
      });
    });
  }

  setupConnection() {
    if (!this.conn) return;

    this.conn.on('data', (data) => {
      this.callbacks.onData(data);
    });

    this.conn.on('close', () => {
      this.callbacks.onClose();
    });

    this.conn.on('error', (err) => {
      this.callbacks.onError(err);
    });
  }

  send(data) {
    if (this.conn && this.conn.open) {
      this.conn.send(data);
    }
  }

  destroy() {
    if (this.conn) {
      try { this.conn.close(); } catch {}
      this.conn = null;
    }
    if (this.peer) {
      try { this.peer.destroy(); } catch {}
      this.peer = null;
    }
    this.roomId = null;
    this.isHost = false;
  }
}

export const p2p = new P2PManager();
