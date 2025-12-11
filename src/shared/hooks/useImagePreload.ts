import { useEffect } from "react";
import { preloadImage } from "../utils/imagePreloader";

/**
 * Hook to preload images when a component mounts
 * Useful for preloading images that will be shown soon
 * 
 * @example
 * useImagePreload([heroImage, logoImage]);
 */
export const useImagePreload = (imageSources: readonly string[]): void => {
  useEffect(() => {
    imageSources.forEach((src) => {
      preloadImage(src).catch(() => {
        // Silently fail - image will load normally when needed
      });
    });
  }, [imageSources]);
};

