import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

export type ErrorLogEntry = {
  id: string;
  timestamp: string;
  type: 'api' | 'runtime' | 'network';
  method?: string;
  url?: string;
  status?: number;
  message: string;
  details?: string;
};

type ErrorLogValue = {
  logs: ErrorLogEntry[];
  clearLogs: () => void;
};

const MAX_LOG = 100;
const ErrorLogContext = createContext<ErrorLogValue | null>(null);

const makeId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export function ErrorLogProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<ErrorLogEntry[]>([]);
  const originalFetchRef = useRef<typeof fetch | null>(null);

  useEffect(() => {
    const handler = (event: ErrorEvent) => {
      setLogs((prev) => {
        const entry: ErrorLogEntry = {
          id: makeId(),
          timestamp: new Date().toLocaleTimeString(),
          type: 'runtime',
          message: event.message || 'Unknown runtime error',
          details: event.filename ? `${event.filename}:${event.lineno}:${event.colno}` : undefined,
        };
        return [entry, ...prev].slice(0, MAX_LOG);
      });
    };

    const rejectionHandler = (event: PromiseRejectionEvent) => {
      const msg = event.reason instanceof Error ? event.reason.message : String(event.reason || 'Unhandled rejection');
      setLogs((prev) => {
        const entry: ErrorLogEntry = {
          id: makeId(),
          timestamp: new Date().toLocaleTimeString(),
          type: 'network',
          message: msg,
        };
        return [entry, ...prev].slice(0, MAX_LOG);
      });
    };

    window.addEventListener('error', handler);
    window.addEventListener('unhandledrejection', rejectionHandler);

    const origFetch = window.fetch;
    originalFetchRef.current = origFetch;

    window.fetch = async (...args) => {
      try {
        const response = await origFetch(...args);
        if (!response.ok) {
          const url = typeof args[0] === 'string' ? args[0] : args[0] instanceof Request ? args[0].url : '';
          const method = typeof args[0] === 'string'
            ? (args[1]?.method || 'GET')
            : args[0] instanceof Request ? args[0].method : 'GET';

          const clone = response.clone();
          let body: any = null;
          try { body = await clone.json(); } catch { try { body = await clone.text(); } catch { body = ''; } }

          setLogs((prev) => {
            const entry: ErrorLogEntry = {
              id: makeId(),
              timestamp: new Date().toLocaleTimeString(),
              type: 'api',
              method,
              url,
              status: response.status,
              message: body?.message || body?.error || `HTTP ${response.status}`,
              details: typeof body === 'string' ? body : undefined,
            };
            return [entry, ...prev].slice(0, MAX_LOG);
          });
        }
        return response;
      } catch (err) {
        const url = typeof args[0] === 'string' ? args[0] : args[0] instanceof Request ? args[0].url : 'unknown';
        setLogs((prev) => {
          const entry: ErrorLogEntry = {
            id: makeId(),
            timestamp: new Date().toLocaleTimeString(),
            type: 'network',
            url,
            message: err instanceof Error ? err.message : 'Network request failed',
          };
          return [entry, ...prev].slice(0, MAX_LOG);
        });
        throw err;
      }
    };

    return () => {
      window.removeEventListener('error', handler);
      window.removeEventListener('unhandledrejection', rejectionHandler);
      if (originalFetchRef.current) {
        window.fetch = originalFetchRef.current;
      }
    };
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const value = useMemo<ErrorLogValue>(() => ({ logs, clearLogs }), [logs, clearLogs]);

  return <ErrorLogContext.Provider value={value}>{children}</ErrorLogContext.Provider>;
}

export function useErrorLog(): ErrorLogValue {
  const context = useContext(ErrorLogContext);
  if (!context) {
    throw new Error('useErrorLog must be used within ErrorLogProvider');
  }
  return context;
}
