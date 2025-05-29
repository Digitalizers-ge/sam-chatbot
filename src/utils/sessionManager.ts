
export class SessionManager {
  private static SESSION_KEY = 'sam_session_id';
  private static SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

  static generateSessionId(): string {
    const id = crypto.randomUUID();
    console.log('🔍 SESSION_MANAGER: Generated new session ID:', id);
    return id;
  }

  static getCurrentSessionId(): string {
    const stored = localStorage.getItem(this.SESSION_KEY);
    console.log('🔍 SESSION_MANAGER: Stored session data:', stored);
    
    if (stored) {
      try {
        const session = JSON.parse(stored);
        const now = Date.now();
        
        console.log('🔍 SESSION_MANAGER: Parsed session:', session);
        console.log('🔍 SESSION_MANAGER: Time check - now:', now, 'session timestamp:', session.timestamp, 'timeout:', this.SESSION_TIMEOUT);
        
        // Check if session is still valid (within timeout)
        if (now - session.timestamp < this.SESSION_TIMEOUT) {
          console.log('🔍 SESSION_MANAGER: Using existing valid session:', session.id);
          return session.id;
        } else {
          console.log('🔍 SESSION_MANAGER: Session expired, creating new one');
        }
      } catch (error) {
        console.error('🔍 SESSION_MANAGER: Error parsing stored session:', error);
      }
    }
    
    // Generate new session if none exists or expired
    const newSessionId = this.generateSessionId();
    this.setCurrentSessionId(newSessionId);
    console.log('🔍 SESSION_MANAGER: Created and stored new session:', newSessionId);
    return newSessionId;
  }

  static setCurrentSessionId(sessionId: string): void {
    const session = {
      id: sessionId,
      timestamp: Date.now(),
    };
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    console.log('🔍 SESSION_MANAGER: Stored session:', session);
  }

  static updateSessionActivity(): void {
    const currentId = this.getCurrentSessionId();
    console.log('🔍 SESSION_MANAGER: Updating activity for session:', currentId);
    this.setCurrentSessionId(currentId);
  }

  static clearSession(): void {
    console.log('🔍 SESSION_MANAGER: Clearing session');
    localStorage.removeItem(this.SESSION_KEY);
  }
}
