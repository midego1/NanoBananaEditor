import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Button } from './ui/Button';
import { History, Download, Image as ImageIcon, Layers } from 'lucide-react';
import { cn } from '../utils/cn';
import { ImagePreviewModal } from './ImagePreviewModal';

export const HistoryPanel: React.FC = () => {
  const {
    currentProject,
    canvasImage,
    selectedGenerationId,
    selectedEditId,
    selectGeneration,
    selectEdit,
    showHistory,
    setShowHistory,
    setCanvasImage,
    selectedTool
  } = useAppStore();

  const [previewModal, setPreviewModal] = React.useState<{
    open: boolean;
    imageUrl: string;
    title: string;
    description?: string;
  }>({
    open: false,
    imageUrl: '',
    title: '',
    description: ''
  });

  const generations = currentProject?.generations || [];
  const edits = currentProject?.edits || [];

  // Get current image dimensions
  const [imageDimensions, setImageDimensions] = React.useState<{ width: number; height: number } | null>(null);
  
  React.useEffect(() => {
    if (canvasImage) {
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
      img.src = canvasImage;
    } else {
      setImageDimensions(null);
    }
  }, [canvasImage]);

  if (!showHistory) {
    return (
      <div className="w-8 bg-gradient-to-b from-gray-950 to-gray-900 border-l border-gray-800/80 flex flex-col items-center justify-center shadow-lg">
        <button
          onClick={() => setShowHistory(true)}
          className="w-6 h-16 bg-gradient-to-l from-gray-800 to-gray-750 hover:from-gray-700 hover:to-gray-700 rounded-l-lg border border-r-0 border-gray-700/80 flex items-center justify-center transition-all group shadow-md hover:shadow-lg"
          title="Show History Panel"
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
    <div className="w-80 bg-gradient-to-b from-gray-950 to-gray-900 border-l border-gray-800/80 shadow-xl p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <History className="h-5 w-5 text-yellow-400" />
          <h3 className="text-sm font-bold text-gray-200 tracking-wide uppercase">History & Variants</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowHistory(!showHistory)}
          className="h-7 w-7 text-lg hover:text-yellow-400"
          title="Hide History Panel"
        >
          ×
        </Button>
      </div>

      {/* Variants Grid */}
      <div className="mb-6 flex-shrink-0">
        <h4 className="text-xs font-bold text-gray-300 mb-4 uppercase tracking-wider">Current Variants</h4>
        {generations.length === 0 && edits.length === 0 ? (
          <div className="text-center py-10 px-4">
            <div className="text-5xl mb-3">🖼️</div>
            <p className="text-sm text-gray-400 font-medium">No generations yet</p>
            <p className="text-xs text-gray-500 mt-1">Your variants will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {/* Show generations */}
            {generations.slice(-2).map((generation, index) => (
              <div
                key={generation.id}
                className={cn(
                  'relative aspect-square rounded-xl border-2 cursor-pointer transition-all duration-250 overflow-hidden group',
                  selectedGenerationId === generation.id
                    ? 'border-yellow-400 shadow-lg shadow-yellow-400/20 ring-2 ring-yellow-400/30'
                    : 'border-gray-700/50 hover:border-gray-600 hover:shadow-md'
                )}
                onClick={() => {
                  selectGeneration(generation.id);
                  if (generation.outputAssets[0]) {
                    setCanvasImage(generation.outputAssets[0].url);
                  }
                }}
              >
                {generation.outputAssets[0] ? (
                  <>
                    <img
                      src={generation.outputAssets[0].url}
                      alt="Generated variant"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-yellow-400" />
                      <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-lg animate-pulse" />
                    </div>
                  </div>
                )}

                {/* Variant Number */}
                <div className="absolute top-2 left-2 bg-gray-900/90 backdrop-blur-sm text-xs font-bold px-2.5 py-1 rounded-md shadow-lg border border-gray-700/50">
                  #{index + 1}
                </div>
              </div>
            ))}

            {/* Show edits */}
            {edits.slice(-2).map((edit, index) => (
              <div
                key={edit.id}
                className={cn(
                  'relative aspect-square rounded-xl border-2 cursor-pointer transition-all duration-250 overflow-hidden group',
                  selectedEditId === edit.id
                    ? 'border-yellow-400 shadow-lg shadow-yellow-400/20 ring-2 ring-yellow-400/30'
                    : 'border-gray-700/50 hover:border-gray-600 hover:shadow-md'
                )}
                onClick={() => {
                  if (edit.outputAssets[0]) {
                    setCanvasImage(edit.outputAssets[0].url);
                    selectEdit(edit.id);
                    selectGeneration(null);
                  }
                }}
              >
                {edit.outputAssets[0] ? (
                  <>
                    <img
                      src={edit.outputAssets[0].url}
                      alt="Edited variant"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-yellow-400" />
                      <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-lg animate-pulse" />
                    </div>
                  </div>
                )}

                {/* Edit Label */}
                <div className="absolute top-2 left-2 bg-purple-900/90 backdrop-blur-sm text-xs font-bold px-2.5 py-1 rounded-md shadow-lg border border-purple-700/50">
                  Edit #{index + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Current Image Info */}
      {(canvasImage || imageDimensions) && (
        <div className="mb-5 p-4 bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl border-2 border-gray-700/50 shadow-md">
          <h4 className="text-xs font-bold text-gray-300 mb-3 uppercase tracking-wider">Current Image</h4>
          <div className="space-y-2 text-xs">
            {imageDimensions && (
              <div className="flex justify-between items-center py-1.5 px-2 rounded-md hover:bg-gray-800/50 transition-colors">
                <span className="text-gray-400 font-medium">Dimensions:</span>
                <span className="text-gray-200 font-semibold">{imageDimensions.width} × {imageDimensions.height}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-1.5 px-2 rounded-md hover:bg-gray-800/50 transition-colors">
              <span className="text-gray-400 font-medium">Mode:</span>
              <span className="text-yellow-400 capitalize font-semibold">{selectedTool}</span>
            </div>
          </div>
        </div>
      )}

      {/* Generation Details */}
      <div className="mb-6 p-4 bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl border-2 border-gray-700/50 shadow-md flex-1 overflow-y-auto min-h-0">
        <h4 className="text-xs font-bold text-gray-300 mb-3 uppercase tracking-wider">Generation Details</h4>
        {(() => {
          const gen = generations.find(g => g.id === selectedGenerationId);
          const selectedEdit = edits.find(e => e.id === selectedEditId);
          
          if (gen) {
            return (
              <div className="space-y-4">
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <span className="text-gray-400 font-semibold block mb-2">Prompt:</span>
                    <p className="text-gray-200 leading-relaxed font-medium">{gen.prompt}</p>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <span className="text-gray-400 font-semibold">Model:</span>
                    <span className="text-gray-200 font-medium">{gen.modelVersion}</span>
                  </div>
                  {gen.parameters.seed && (
                    <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                      <span className="text-gray-400 font-semibold">Seed:</span>
                      <span className="text-yellow-400 font-bold">{gen.parameters.seed}</span>
                    </div>
                  )}
                </div>

                {/* Reference Images */}
                {gen.sourceAssets.length > 0 && (
                  <div>
                    <h5 className="text-xs font-semibold text-gray-300 mb-3 uppercase tracking-wider">Reference Images</h5>
                    <div className="grid grid-cols-2 gap-2.5">
                      {gen.sourceAssets.map((asset, index) => (
                        <button
                          key={asset.id}
                          onClick={() => setPreviewModal({
                            open: true,
                            imageUrl: asset.url,
                            title: `Reference Image ${index + 1}`,
                            description: 'This reference image was used to guide the generation'
                          })}
                          className="relative aspect-square rounded-lg border-2 border-gray-700/50 hover:border-gray-600 transition-all overflow-hidden group shadow-md hover:shadow-lg"
                        >
                          <img
                            src={asset.url}
                            alt={`Reference ${index + 1}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-white drop-shadow-lg" />
                          </div>
                          <div className="absolute bottom-1.5 left-1.5 bg-gray-900/90 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-md shadow-lg border border-gray-700/50 text-gray-200">
                            Ref {index + 1}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          } else if (selectedEdit) {
            const parentGen = generations.find(g => g.id === selectedEdit.parentGenerationId);
            return (
              <div className="space-y-4">
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <span className="text-gray-400 font-semibold block mb-2">Edit Instruction:</span>
                    <p className="text-gray-200 leading-relaxed font-medium">{selectedEdit.instruction}</p>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <span className="text-gray-400 font-semibold">Type:</span>
                    <span className="text-gray-200 font-medium">Image Edit</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <span className="text-gray-400 font-semibold">Created:</span>
                    <span className="text-gray-200 font-medium">{new Date(selectedEdit.timestamp).toLocaleTimeString()}</span>
                  </div>
                  {selectedEdit.maskAssetId && (
                    <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                      <span className="text-gray-400 font-semibold">Mask:</span>
                      <span className="text-purple-400 font-bold">Applied</span>
                    </div>
                  )}
                </div>
                
                {/* Parent Generation Reference */}
                {parentGen && (
                  <div>
                    <h5 className="text-xs font-medium text-gray-400 mb-2">Original Image</h5>
                    <button
                      onClick={() => setPreviewModal({
                        open: true,
                        imageUrl: parentGen.outputAssets[0]?.url || '',
                        title: 'Original Image',
                        description: 'The base image that was edited'
                      })}
                      className="relative aspect-square w-16 rounded border border-gray-700 hover:border-gray-600 transition-colors overflow-hidden group"
                    >
                      <img
                        src={parentGen.outputAssets[0]?.url}
                        alt="Original"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <ImageIcon className="h-3 w-3 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  </div>
                )}
                
                {/* Mask Visualization */}
                {selectedEdit.maskReferenceAsset && (
                  <div>
                    <h5 className="text-xs font-medium text-gray-400 mb-2">Masked Reference</h5>
                    <button
                      onClick={() => setPreviewModal({
                        open: true,
                        imageUrl: selectedEdit.maskReferenceAsset!.url,
                        title: 'Masked Reference Image',
                        description: 'This image with mask overlay was sent to the AI model to guide the edit'
                      })}
                      className="relative aspect-square w-16 rounded border border-gray-700 hover:border-gray-600 transition-colors overflow-hidden group"
                    >
                      <img
                        src={selectedEdit.maskReferenceAsset.url}
                        alt="Masked reference"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <ImageIcon className="h-3 w-3 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="absolute bottom-1 left-1 bg-purple-900/80 text-xs px-1 py-0.5 rounded text-purple-300">
                        Mask
                      </div>
                    </button>
                  </div>
                )}
              </div>
            );
          } else {
            return (
              <div className="text-center py-10 px-4">
                <div className="text-4xl mb-3 opacity-50">📝</div>
                <p className="text-sm text-gray-400 font-medium">Select a generation or edit to view details</p>
              </div>
            );
          }
        })()}
      </div>

      {/* Actions */}
      <div className="space-y-3 flex-shrink-0">
        <Button
          variant="outline"
          size="sm"
          className="w-full font-semibold hover:text-yellow-400"
          onClick={() => {
            // Find the currently displayed image (either generation or edit)
            let imageUrl: string | null = null;
            
            if (selectedGenerationId) {
              const gen = generations.find(g => g.id === selectedGenerationId);
              imageUrl = gen?.outputAssets[0]?.url || null;
            } else {
              // If no generation selected, try to get the current canvas image
              const { canvasImage } = useAppStore.getState();
              imageUrl = canvasImage;
            }
            
            if (imageUrl) {
              // Handle both data URLs and regular URLs
              if (imageUrl.startsWith('data:')) {
                const link = document.createElement('a');
                link.href = imageUrl;
                link.download = `nano-banana-${Date.now()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              } else {
                // For external URLs, we need to fetch and convert to blob
                fetch(imageUrl)
                  .then(response => response.blob())
                  .then(blob => {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `nano-banana-${Date.now()}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  });
              }
            }
          }}
          disabled={!selectedGenerationId && !useAppStore.getState().canvasImage}
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>
      
      {/* Image Preview Modal */}
      <ImagePreviewModal
        open={previewModal.open}
        onOpenChange={(open) => setPreviewModal(prev => ({ ...prev, open }))}
        imageUrl={previewModal.imageUrl}
        title={previewModal.title}
        description={previewModal.description}
      />
    </div>
  );
};