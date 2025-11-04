import React, { useState } from 'react';
import { Button } from './ui/Button';
import { HelpCircle } from 'lucide-react';
import { InfoModal } from './InfoModal';

export const Header: React.FC = () => {
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <>
      <header className="h-16 bg-gradient-to-b from-gray-950 to-gray-900 border-b border-gray-800/80 shadow-lg flex items-center justify-between px-6 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl transform hover:scale-110 transition-transform duration-300 cursor-default">🍌</div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-50 to-gray-200 hidden md:block tracking-tight">
                Nano Banana AI Image Editor
              </h1>
              <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-50 to-gray-200 md:hidden tracking-tight">
                NB Editor
              </h1>
            </div>
          </div>
          <div className="text-xs font-semibold text-yellow-400/80 bg-gradient-to-b from-gray-800 to-gray-900 px-3 py-1.5 rounded-md border border-gray-700/50 shadow-md">
            v1.0
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowInfoModal(true)}
            className="hover:text-yellow-400 transition-colors"
            title="Help & Info"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <InfoModal open={showInfoModal} onOpenChange={setShowInfoModal} />
    </>
  );
};