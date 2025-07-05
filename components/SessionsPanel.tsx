import React from 'react';
import SaveIcon from './icons/SaveIcon';

interface SavedSession {
  id: number;
  name: string;
}

interface SessionsPanelProps {
  sessions: SavedSession[];
  onLoadSession: (sessionId: number) => void;
  onDeleteSession: (sessionId: number) => void;
}

const SessionsPanel: React.FC<SessionsPanelProps> = ({ sessions, onLoadSession, onDeleteSession }) => {
  if (sessions.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto mt-8 p-4 text-center text-gray-500">
        No saved sessions yet. Use the "Save Session" button to save your progress.
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto mt-8 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center mb-4">
        <div className="mr-3 text-gray-500"><SaveIcon /></div>
        <h2 className="text-xl font-bold text-gray-900">Saved Sessions</h2>
      </div>
      <ul className="space-y-2">
        {sessions.map(session => (
          <li key={session.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 transition-all duration-200 transform hover:shadow-md hover:-translate-y-0.5">
            <span className="text-gray-700">{session.name}</span>
            <div>
              <button 
                onClick={() => onLoadSession(session.id)}
                className="text-sm bg-blue-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-blue-600"
              >
                Load
              </button>
              <button
                onClick={() => onDeleteSession(session.id)}
                className="text-sm bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionsPanel; 