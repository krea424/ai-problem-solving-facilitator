import React, { useState } from 'react';
import { Playbook } from '../types';
import GridIcon from './icons/GridIcon';

interface PlaybooksPanelProps {
  playbooks: Playbook[];
  onSelectPlaybook: (playbook: Playbook) => void;
}

const PlaybooksPanel: React.FC<PlaybooksPanelProps> = ({ playbooks, onSelectPlaybook }) => {
  const [expanded, setExpanded] = useState<boolean>(true);

  return (
    <div className="w-full mb-8">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 mb-4 text-blue-600 hover:text-blue-800 font-semibold focus:outline-none"
      >
        <GridIcon className="w-5 h-5" />
        <span>{expanded ? 'Hide' : 'Show'} Playbooks</span>
      </button>

      {expanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playbooks.map((pb) => (
            <div
              key={pb.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow animate-fade-in-up"
            >
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{pb.name}</h3>
                <p className="text-sm text-gray-600 mb-4 overflow-hidden text-ellipsis" style={{display:'-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient:'vertical'}}>{pb.description}</p>
              </div>
              <button
                onClick={() => onSelectPlaybook(pb)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors active:scale-95"
              >
                Start Playbook
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaybooksPanel;
