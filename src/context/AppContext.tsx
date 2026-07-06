import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { AppAction } from './actions';
import type { AppState } from '../types';

const initialState: AppState = {
  userRole: 'operator',
  geminiStatus: 'idle',
  events: [],
  crowdStatus: [],
  gateStatus: [],
  incidents: [],
  tasks: [],
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER_ROLE':
      return { ...state, userRole: action.payload };
    case 'SET_GEMINI_STATUS':
      return { ...state, geminiStatus: action.payload };
    case 'LOG_EVENT':
      return { ...state, events: [...state.events, action.payload] };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
