
export class SessionManager {
  private static SESSION_KEY = 'sam_session_id';
  private static SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

  static generateSessionId(): string {
    return crypto.randomUUID();
  }

  static getCurrentSessionId(): string {
    const stored = localStorage.getItem(this.SESSION_KEY);
    
    if (stored) {
      try {
        const session = JSON.parse(stored);
        const now = Date.now();
        
        // Check if session is still valid (within timeout)
        if (now - session.timestamp < this.SESSION_TIMEOUT) {
          return session.id;
        }
      } catch (error) {
        console.error('Error parsing stored session:', error);
      }
    }
    
    // Generate new session if none exists or expired
    const newSessionId = this.generateSessionId();
    this.setCurrentSessionId(newSessionId);
    return newSessionId;
  }

  static setCurrentSessionId(sessionId: string): void {
    const session = {
      id: sessionId,
      timestamp: Date.now(),
    };
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
  }

  static updateSessionActivity(): void {
    const currentId = this.getCurrentSessionId();
    this.setCurrentSessionId(currentId);
  }

  static clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }
}
