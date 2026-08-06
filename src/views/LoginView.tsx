import React, { useState } from 'react';

export const LoginView: React.FC = () => {
  const [email, setEmail] = useState('');
  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">AI Factory Authentication</h2>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm"
            placeholder="engineer@aifactory.ai"
          />
        </div>
        <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginView;
