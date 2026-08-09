import React from 'react';
import BaWorkbench from '../components/workbenches/BaWorkbench';
import DesignerWorkbench from '../components/workbenches/DesignerWorkbench';
import ValidationWorkbench from '../components/workbenches/ValidationWorkbench';

export const WorkspaceView: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Multi-Workbench Workspace</h2>
      <BaWorkbench />
      <DesignerWorkbench />
      <ValidationWorkbench />
    </div>
  );
};

export default WorkspaceView;
