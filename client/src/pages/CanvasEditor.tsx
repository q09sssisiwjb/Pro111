import { useState, useCallback, useEffect } from 'react';
import { Excalidraw, MainMenu, WelcomeScreen, Footer, exportToCanvas } from '@excalidraw/excalidraw';
import type { ExcalidrawImperativeAPI, ExcalidrawElement, AppState } from '@excalidraw/excalidraw/types';
import '@excalidraw/excalidraw/index.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Sparkles, Loader2, Download, Palette, Eraser } from 'lucide-react';

const CanvasEditor = () => {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const { toast } = useToast();

  // Set Excalidraw asset path for self-hosting
  useEffect(() => {
    window.EXCALIDRAW_ASSET_PATH = '/';
  }, []);

  const sketchToImageMutation = useMutation({
    mutationFn: async ({ sketchData, prompt }: { sketchData: string; prompt: string }) => {
      const res = await apiRequest('POST', '/api/sketch-to-image', { sketchData, prompt });
      return res.json();
    },
    onSuccess: (data) => {
      setGeneratedImage(`data:image/png;base64,${data.imageData}`);
      toast({
        title: 'Success!',
        description: 'Your sketch has been converted to a realistic image.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate image',
        variant: 'destructive',
      });
    },
  });

  const handleExportToCanvas = useCallback(async () => {
    if (!excalidrawAPI) {
      toast({
        title: 'Error',
        description: 'Excalidraw is not ready yet',
        variant: 'destructive',
      });
      return;
    }

    const elements = excalidrawAPI.getSceneElements();
    if (!elements || elements.length === 0) {
      toast({
        title: 'No Drawing',
        description: 'Please draw something first',
        variant: 'destructive',
      });
      return;
    }

    try {
      const canvas = await exportToCanvas({
        elements,
        appState: excalidrawAPI.getAppState(),
        files: excalidrawAPI.getFiles(),
        getDimensions: () => ({ width: 1024, height: 1024 }),
      });
      
      const sketchData = canvas.toDataURL('image/png').split(',')[1];
      sketchToImageMutation.mutate({ sketchData, prompt });
    } catch (error) {
      toast({
        title: 'Export Error',
        description: 'Failed to export the canvas',
        variant: 'destructive',
      });
    }
  }, [excalidrawAPI, prompt, sketchToImageMutation, toast]);

  const downloadImage = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `canvas-editor-${Date.now()}.png`;
    link.click();
  };

  const downloadExcalidrawImage = useCallback(async () => {
    if (!excalidrawAPI) return;

    const elements = excalidrawAPI.getSceneElements();
    if (!elements || elements.length === 0) {
      toast({
        title: 'No Drawing',
        description: 'Please draw something first',
        variant: 'destructive',
      });
      return;
    }

    try {
      const canvas = await exportToCanvas({
        elements,
        appState: excalidrawAPI.getAppState(),
        files: excalidrawAPI.getFiles(),
      });

      canvas.toBlob((blob: Blob | null) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `excalidraw-${Date.now()}.png`;
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch (error) {
      toast({
        title: 'Export Error',
        description: 'Failed to export the drawing',
        variant: 'destructive',
      });
    }
  }, [excalidrawAPI, toast]);

  return (
    <div className="container mx-auto max-w-7xl px-2 sm:px-4 py-4 sm:py-8" data-testid="canvas-editor-page">
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2" data-testid="text-title">Canvas Editor</h1>
        <p className="text-sm sm:text-base text-muted-foreground" data-testid="text-description">
          Draw with Excalidraw's powerful tools and convert your sketch to a realistic image with AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Excalidraw Canvas */}
        <Card className="min-h-[600px] sm:min-h-[700px] lg:h-[800px] flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl">Draw Your Sketch</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Use Excalidraw's professional drawing tools</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 p-2 sm:p-6">
            <div className="h-full w-full min-h-[500px] border-2 border-border rounded-lg overflow-hidden" data-testid="excalidraw-container">
              <Excalidraw
                excalidrawAPI={(api) => setExcalidrawAPI(api)}
                theme="dark"
                onChange={(elements: readonly ExcalidrawElement[], appState: AppState) => {
                  // Track changes if needed
                  console.log('Canvas updated:', elements.length, 'elements');
                }}
                UIOptions={{
                  canvasActions: {
                    changeViewBackgroundColor: true,
                    clearCanvas: true,
                    export: { saveFileToDisk: true },
                    loadScene: true,
                    saveToActiveFile: false,
                    theme: true,
                    saveAsImage: true,
                  },
                }}
                initialData={{
                  appState: {
                    viewBackgroundColor: "#1e1e1e",
                    currentItemStrokeColor: "#ffffff",
                    currentItemBackgroundColor: "#6366f1",
                    zoom: { value: 1 },
                  },
                }}
              >
                <MainMenu>
                  <MainMenu.DefaultItems.LoadScene />
                  <MainMenu.DefaultItems.SaveToActiveFile />
                  <MainMenu.DefaultItems.Export />
                  <MainMenu.DefaultItems.SaveAsImage />
                  <MainMenu.DefaultItems.ClearCanvas />
                  <MainMenu.Separator />
                  <MainMenu.DefaultItems.ToggleTheme />
                  <MainMenu.Separator />
                  <MainMenu.Item onSelect={downloadExcalidrawImage}>
                    Download Drawing
                  </MainMenu.Item>
                </MainMenu>
                <WelcomeScreen>
                  <WelcomeScreen.Hints.MenuHint />
                  <WelcomeScreen.Hints.ToolbarHint />
                  <WelcomeScreen.Hints.HelpHint />
                </WelcomeScreen>
                <Footer>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Palette className="w-3 h-3" />
                    <span className="hidden sm:inline">Professional Drawing Tools</span>
                  </div>
                </Footer>
              </Excalidraw>
            </div>
          </CardContent>
        </Card>

        {/* AI Generation Panel */}
        <Card className="min-h-[600px] sm:min-h-[700px] lg:h-[800px] flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl">AI Image Generation</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Convert your sketch to a realistic image</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            <div className="space-y-2">
              <label className="text-sm font-medium">Prompt (Optional)</label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to generate... (e.g., 'a beautiful landscape with mountains')"
                className="resize-none text-sm"
                rows={4}
                data-testid="textarea-prompt"
              />
            </div>

            <Button
              className="w-full"
              onClick={handleExportToCanvas}
              disabled={sketchToImageMutation.isPending}
              data-testid="button-generate-image"
            >
              {sketchToImageMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Generate Realistic Image</span>
                  <span className="sm:hidden">Generate Image</span>
                </>
              )}
            </Button>

            {generatedImage ? (
              <div className="space-y-4">
                <div className="border-2 border-border rounded-lg overflow-hidden">
                  <img
                    src={generatedImage}
                    alt="Generated image"
                    className="w-full h-auto"
                    data-testid="img-generated-result"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={downloadImage}
                  variant="outline"
                  data-testid="button-download-image"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Download AI Generated Image</span>
                  <span className="sm:hidden">Download Image</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] sm:h-[500px] border-2 border-dashed border-border rounded-lg">
                <div className="text-center space-y-2 px-4">
                  <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-muted-foreground" />
                  <p className="text-xs sm:text-sm text-muted-foreground" data-testid="text-no-image">
                    Draw a sketch and click "Generate Image"
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CanvasEditor;
