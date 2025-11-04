import React, { useState, useRef } from 'react';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { useAppStore } from '../store/useAppStore';
import { useImageGeneration, useImageEditing } from '../hooks/useImageGeneration';
import { Upload, Wand2, Edit3, MousePointer, HelpCircle, Menu, ChevronDown, ChevronRight, RotateCcw } from 'lucide-react';
import { blobToBase64 } from '../utils/imageUtils';
import { PromptHints } from './PromptHints';
import { cn } from '../utils/cn';

export const PromptComposer: React.FC = () => {
  const {
    currentPrompt,
    setCurrentPrompt,
    selectedTool,
    setSelectedTool,
    temperature,
    setTemperature,
    seed,
    setSeed,
    isGenerating,
    uploadedImages,
    addUploadedImage,
    removeUploadedImage,
    clearUploadedImages,
    editReferenceImages,
    addEditReferenceImage,
    removeEditReferenceImage,
    clearEditReferenceImages,
    canvasImage,
    setCanvasImage,
    showPromptPanel,
    setShowPromptPanel,
    clearBrushStrokes,
  } = useAppStore();

  const { generate } = useImageGeneration();
  const { edit } = useImageEditing();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showHintsModal, setShowHintsModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = () => {
    if (!currentPrompt.trim()) return;
    
    if (selectedTool === 'generate') {
      const referenceImages = uploadedImages
        .filter(img => img.includes('base64,'))
        .map(img => img.split('base64,')[1]);
        
      generate({
        prompt: currentPrompt,
        referenceImages: referenceImages.length > 0 ? referenceImages : undefined,
        temperature,
        seed: seed || undefined
      });
    } else if (selectedTool === 'edit' || selectedTool === 'mask') {
      edit(currentPrompt);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      try {
        const base64 = await blobToBase64(file);
        const dataUrl = `data:${file.type};base64,${base64}`;
        
        if (selectedTool === 'generate') {
          // Add to reference images (max 2)
          if (uploadedImages.length < 2) {
            addUploadedImage(dataUrl);
          }
        } else if (selectedTool === 'edit') {
          // For edit mode, add to separate edit reference images (max 2)
          if (editReferenceImages.length < 2) {
            addEditReferenceImage(dataUrl);
          }
          // Set as canvas image if none exists
          if (!canvasImage) {
            setCanvasImage(dataUrl);
          }
        } else if (selectedTool === 'mask') {
          // For mask mode, set as canvas image immediately
          clearUploadedImages();
          addUploadedImage(dataUrl);
          setCanvasImage(dataUrl);
        }
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }
  };

  const handleClearSession = () => {
    setCurrentPrompt('');
    clearUploadedImages();
    clearEditReferenceImages();
    clearBrushStrokes();
    setCanvasImage(null);
    setSeed(null);
    setTemperature(0.7);
    setShowClearConfirm(false);
  };

  const tools = [
    { id: 'generate', icon: Wand2, label: 'Generate', description: 'Create from text' },
    { id: 'edit', icon: Edit3, label: 'Edit', description: 'Modify existing' },
    { id: 'mask', icon: MousePointer, label: 'Select', description: 'Click to select' },
  ] as const;

  if (!showPromptPanel) {
    return (
      <div className="w-8 bg-gradient-to-b from-gray-950 to-gray-900 border-r border-gray-800/80 flex flex-col items-center justify-center shadow-lg">
        <button
          onClick={() => setShowPromptPanel(true)}
          className="w-6 h-16 bg-gradient-to-r from-gray-800 to-gray-750 hover:from-gray-700 hover:to-gray-700 rounded-r-lg border border-l-0 border-gray-700/80 flex items-center justify-center transition-all group shadow-md hover:shadow-lg"
          title="Show Prompt Panel"
        >
          <div className="flex flex-col space-y-1">
            <div className="w-1.5 h-1.5 bg-gray-500 group-hover:bg-yellow-400 rounded-full transition-all group-hover:shadow-sm group-hover:shadow-yellow-400/50"></div>
            <div className="w-1.5 h-1.5 bg-gray-500 group-hover:bg-yellow-400 rounded-full transition-all group-hover:shadow-sm group-hover:shadow-yellow-400/50"></div>
            <div className="w-1.5 h-1.5 bg-gray-500 group-hover:bg-yellow-400 rounded-full transition-all group-hover:shadow-sm group-hover:shadow-yellow-400/50"></div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <>
    <div className="w-80 lg:w-72 xl:w-80 h-full bg-gradient-to-b from-gray-950 to-gray-900 border-r border-gray-800/80 shadow-xl p-6 flex flex-col space-y-6 overflow-y-auto">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-200 tracking-wide uppercase">Mode</h3>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowHintsModal(true)}
              className="h-7 w-7 hover:text-yellow-400"
              title="Prompt Hints"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowPromptPanel(false)}
              className="h-7 w-7 text-lg hover:text-yellow-400"
              title="Hide Prompt Panel"
            >
              ×
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={cn(
                'flex flex-col items-center p-3.5 rounded-xl border-2 transition-all duration-250 group relative overflow-hidden',
                selectedTool === tool.id
                  ? 'bg-gradient-to-b from-yellow-400/15 to-yellow-400/5 border-yellow-400/60 text-yellow-400 shadow-lg shadow-yellow-400/20'
                  : 'bg-gradient-to-b from-gray-800 to-gray-900 border-gray-700/50 text-gray-400 hover:bg-gradient-to-b hover:from-gray-750 hover:to-gray-800 hover:text-gray-300 hover:border-gray-600 hover:shadow-md'
              )}
            >
              {selectedTool === tool.id && (
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent opacity-50"></div>
              )}
              <tool.icon className="h-5 w-5 mb-1.5 relative z-10 transition-transform group-hover:scale-110" />
              <span className="text-xs font-semibold relative z-10">{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* File Upload */}
      <div>
        <div>
          <label className="text-sm font-bold text-gray-200 mb-2 block tracking-wide">
            {selectedTool === 'generate' ? 'Reference Images' : selectedTool === 'edit' ? 'Style References' : 'Upload Image'}
          </label>
          {selectedTool === 'mask' && (
            <p className="text-xs text-gray-400 mb-3 leading-relaxed">Edit an image with masks</p>
          )}
          {selectedTool === 'generate' && (
            <p className="text-xs text-gray-500 mb-3 leading-relaxed">Optional, up to 2 images</p>
          )}
          {selectedTool === 'edit' && (
            <p className="text-xs text-gray-500 mb-3 leading-relaxed">
              {canvasImage ? 'Optional style references, up to 2 images' : 'Upload image to edit, up to 2 images'}
            </p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
            disabled={
              (selectedTool === 'generate' && uploadedImages.length >= 2) ||
              (selectedTool === 'edit' && editReferenceImages.length >= 2)
            }
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          
          {/* Show uploaded images preview */}
          {((selectedTool === 'generate' && uploadedImages.length > 0) ||
            (selectedTool === 'edit' && editReferenceImages.length > 0)) && (
            <div className="mt-4 space-y-2.5">
              {(selectedTool === 'generate' ? uploadedImages : editReferenceImages).map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Reference ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg border-2 border-gray-700/50 shadow-md group-hover:border-gray-600 transition-all"
                  />
                  <button
                    onClick={() => selectedTool === 'generate' ? removeUploadedImage(index) : removeEditReferenceImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-b from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 rounded-full flex items-center justify-center text-sm font-bold shadow-lg hover:shadow-xl transition-all hover:scale-110"
                  >
                    ×
                  </button>
                  <div className="absolute bottom-2 left-2 bg-gray-900/90 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-md shadow-md border border-gray-700/50 text-gray-200">
                    Ref {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Prompt Input */}
      <div>
        <label className="text-sm font-bold text-gray-200 mb-3 block tracking-wide">
          {selectedTool === 'generate' ? 'Describe what you want to create' : 'Describe your changes'}
        </label>
        <Textarea
          value={currentPrompt}
          onChange={(e) => setCurrentPrompt(e.target.value)}
          placeholder={
            selectedTool === 'generate'
              ? 'A serene mountain landscape at sunset with a lake reflecting the golden sky...'
              : 'Make the sky more dramatic, add storm clouds...'
          }
          className="min-h-[120px] resize-none bg-gray-900 border-2 border-gray-700/50 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 shadow-inner"
        />

        {/* Prompt Quality Indicator */}
        <button
          onClick={() => setShowHintsModal(true)}
          className="mt-3 flex items-center text-xs hover:text-gray-300 transition-colors group px-2 py-1.5 rounded-md hover:bg-gray-800/50"
        >
          {currentPrompt.length < 20 ? (
            <HelpCircle className="h-3.5 w-3.5 mr-2 text-red-400 group-hover:text-red-300" />
          ) : (
            <div className={cn(
              'h-2.5 w-2.5 rounded-full mr-2 shadow-sm',
              currentPrompt.length < 50 ? 'bg-yellow-400 shadow-yellow-400/50' : 'bg-green-400 shadow-green-400/50'
            )} />
          )}
          <span className="text-gray-400 group-hover:text-gray-300 font-medium">
            {currentPrompt.length < 20 ? 'Add detail for better results' :
             currentPrompt.length < 50 ? 'Good detail level' : 'Excellent prompt detail'}
          </span>
        </button>
      </div>


      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={isGenerating || !currentPrompt.trim()}
        className="w-full h-14 text-base font-bold shadow-2xl shadow-yellow-400/30 hover:shadow-yellow-400/40"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2.5" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 className="h-5 w-5 mr-2.5" />
            {selectedTool === 'generate' ? 'Generate' : 'Apply Edit'}
          </>
        )}
      </Button>

      {/* Advanced Controls */}
      <div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center text-sm font-semibold text-gray-400 hover:text-yellow-400 transition-all duration-250 px-2 py-1.5 rounded-md hover:bg-gray-800/50"
        >
          {showAdvanced ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
          {showAdvanced ? 'Hide' : 'Show'} Advanced Controls
        </button>

        <button
          onClick={() => setShowClearConfirm(!showClearConfirm)}
          className="flex items-center text-sm font-semibold text-gray-400 hover:text-red-400 transition-all duration-250 mt-2 px-2 py-1.5 rounded-md hover:bg-gray-800/50"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Clear Session
        </button>

        {showClearConfirm && (
          <div className="mt-4 p-4 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl border-2 border-red-500/30 shadow-lg shadow-red-500/10">
            <p className="text-xs text-gray-200 mb-4 leading-relaxed font-medium">
              Are you sure you want to clear this session? This will remove all uploads, prompts, and canvas content.
            </p>
            <div className="flex space-x-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearSession}
                className="flex-1"
              >
                Yes, Clear
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        
        {showAdvanced && (
          <div className="mt-5 space-y-5 p-4 bg-gray-900/50 rounded-xl border border-gray-800/50 backdrop-blur-sm">
            {/* Temperature */}
            <div>
              <label className="text-xs font-semibold text-gray-300 mb-2.5 block tracking-wide">
                Creativity ({temperature})
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer slider shadow-inner"
              />
            </div>

            {/* Seed */}
            <div>
              <label className="text-xs font-semibold text-gray-300 mb-2.5 block tracking-wide">
                Seed (optional)
              </label>
              <input
                type="number"
                value={seed || ''}
                onChange={(e) => setSeed(e.target.value ? parseInt(e.target.value) : null)}
                placeholder="Random"
                className="w-full h-9 px-3 bg-gray-800 border-2 border-gray-700/50 rounded-lg text-xs text-gray-100 font-medium focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 shadow-inner transition-all"
              />
            </div>
          </div>
        )}
      </div>

      {/* Keyboard Shortcuts */}
      <div className="pt-5 border-t border-gray-800/50">
        <h4 className="text-xs font-bold text-gray-300 mb-3 uppercase tracking-wider">Shortcuts</h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center py-1.5 px-2 rounded-md hover:bg-gray-800/50 transition-colors">
            <span className="text-gray-400 font-medium">Generate</span>
            <kbd className="px-2 py-1 bg-gray-800 text-gray-300 rounded border border-gray-700 font-mono text-xs shadow-sm">⌘ + Enter</kbd>
          </div>
          <div className="flex justify-between items-center py-1.5 px-2 rounded-md hover:bg-gray-800/50 transition-colors">
            <span className="text-gray-400 font-medium">Re-roll</span>
            <kbd className="px-2 py-1 bg-gray-800 text-gray-300 rounded border border-gray-700 font-mono text-xs shadow-sm">⇧ + R</kbd>
          </div>
          <div className="flex justify-between items-center py-1.5 px-2 rounded-md hover:bg-gray-800/50 transition-colors">
            <span className="text-gray-400 font-medium">Edit mode</span>
            <kbd className="px-2 py-1 bg-gray-800 text-gray-300 rounded border border-gray-700 font-mono text-xs shadow-sm">E</kbd>
          </div>
          <div className="flex justify-between items-center py-1.5 px-2 rounded-md hover:bg-gray-800/50 transition-colors">
            <span className="text-gray-400 font-medium">History</span>
            <kbd className="px-2 py-1 bg-gray-800 text-gray-300 rounded border border-gray-700 font-mono text-xs shadow-sm">H</kbd>
          </div>
          <div className="flex justify-between items-center py-1.5 px-2 rounded-md hover:bg-gray-800/50 transition-colors">
            <span className="text-gray-400 font-medium">Toggle Panel</span>
            <kbd className="px-2 py-1 bg-gray-800 text-gray-300 rounded border border-gray-700 font-mono text-xs shadow-sm">P</kbd>
          </div>
        </div>
      </div>
    </div>
    {/* Prompt Hints Modal */}
    <PromptHints open={showHintsModal} onOpenChange={setShowHintsModal} />
    </>
  );
};