import React, { useState } from 'react';

export const CreateTicketView: React.FC = () => {
  const [title, setTitle] = useState('');
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Create Agent Execution Ticket</h2>
        <div className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ticket summary..."
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm"
          />
          <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium text-sm">
            Dispatch Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTicketView;
