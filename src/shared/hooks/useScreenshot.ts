import { useState, useCallback } from "react";
// @ts-ignore - dom-to-image-more doesn't have types
import domtoimage from "dom-to-image-more";

export const useScreenshot = () => {
  const [isCapturing, setIsCapturing] = useState(false);

  const captureScreen = useCallback(async () => {
    setIsCapturing(true);
    try {
      // Capture the main dashboard content
      const element = document.querySelector('.dashboard') || document.querySelector('main') || document.body;
      
      // Use dom-to-image-more which handles modern CSS better
      const dataUrl = await domtoimage.toPng(element as HTMLElement, {
        quality: 1,
        bgcolor: '#ffffff',
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        },
        filter: (node: HTMLElement) => {
          // Skip script and style tags
          return node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE';
        },
      });

      // Download the image
      const link = document.createElement("a");
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-").split("T");
      const date = timestamp[0];
      const time = timestamp[1].split("-").slice(0, 3).join("-");
      link.download = `screenshot-${date}-${time}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error capturing screenshot:", error);
      alert("Failed to capture screenshot. Please try again.");
    } finally {
      setIsCapturing(false);
    }
  }, []);

  return { captureScreen, isCapturing };
};

