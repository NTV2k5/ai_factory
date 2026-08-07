import React from 'react';

export const DesignerWorkbench: React.FC = () => {
  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
      <h3 className="text-lg font-semibold text-white mb-2">Designer Workbench - Penpot & Tailwind UI</h3>
      <p className="text-slate-400 text-sm mb-4">Generate responsive Tailwind components and Penpot visual mockups.</p>
      <div className="h-48 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center text-slate-500 text-sm">
        Canvas Mockup Preview Container
      </div>
    </div>
  );
};

export default DesignerWorkbench;
