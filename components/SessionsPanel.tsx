import React, { useState, useMemo } from 'react';
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
  const [expanded, setExpanded] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  const filtered = useMemo(() => {
    return sessions.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  }, [sessions, search]);

  if (sessions.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto mt-8 p-4 text-center text-gray-500">
        No saved sessions yet. Use the "Save Session" button to save your progress.
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto mt-8 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center">
          <div className="mr-3 text-gray-500"><SaveIcon /></div>
          <h2 className="text-xl font-bold text-gray-900">Saved Sessions</h2>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${expanded ? 'rotate-0' : '-rotate-90'}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {expanded && (
        <>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search session..."
            className="w-full mb-3 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {filtered.map(session => (
              <li key={session.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 transition-all duration-200 transform hover:shadow-md hover:-translate-y-0.5">
                <span className="text-gray-700 truncate max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl" title={session.name}>{session.name}</span>
                <div className="flex-shrink-0">
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
            {filtered.length === 0 && (
              <li className="text-center text-sm text-gray-500 py-2">No sessions match.</li>
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default SessionsPanel; 