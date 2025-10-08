import { useEffect, useRef } from 'react';

const AdsterraBanner = () => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adContainerRef.current) {
      const script1 = document.createElement('script');
      script1.type = 'text/javascript';
      script1.innerHTML = `
        atOptions = {
          'key' : '3c88c0c6c156a411837976445c9a1161',
          'format' : 'iframe',
          'height' : 50,
          'width' : 320,
          'params' : {}
        };
      `;
      
      const script2 = document.createElement('script');
      script2.type = 'text/javascript';
      script2.src = '//www.highperformanceformat.com/3c88c0c6c156a411837976445c9a1161/invoke.js';
      
      adContainerRef.current.appendChild(script1);
      adContainerRef.current.appendChild(script2);
    }
  }, []);

  return (
    <div ref={adContainerRef} data-testid="adsterra-banner-ad" />
  );
};

const ImageToSketch = () => {
  return (
    <div className="h-full w-full flex flex-col" style={{ margin: 0, padding: 0, border: "none", outline: "none" }}>
      {/* Adsterra Banner Ad at top */}
      <div className="py-3 bg-background flex justify-center border-b border-border/20" data-testid="adsterra-banner-container">
        <AdsterraBanner />
      </div>
      
      <div className="flex-1" style={{ margin: 0, padding: 0 }}>
        <iframe
          src="https://wiuhh-sketch-ai.hf.space"
          width="100%"
          height="100%"
          title="Image to Sketch Tool"
          style={{ 
            border: "none", 
            margin: 0, 
            padding: 0, 
            display: "block",
            outline: "none",
            borderRadius: 0,
            boxShadow: "none"
          }}
          data-testid="iframe-image-to-sketch"
        />
      </div>
    </div>
  );
};

export default ImageToSketch;