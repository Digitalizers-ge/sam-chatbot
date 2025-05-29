
// Simple analytics hook that doesn't use useTrackedConversation
export const useAnalytics = () => {
  // Just return session info for now - tracking will be handled directly in Index.tsx
  return {
    sessionId: 'analytics-placeholder',
  };
};
