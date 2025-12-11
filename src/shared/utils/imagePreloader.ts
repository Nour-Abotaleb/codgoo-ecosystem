/**
 * Preloads images to improve loading performance
 * This ensures images are cached by the browser before they're needed
 */

type ImagePreloadOptions = {
  readonly crossOrigin?: string;
  readonly priority?: "high" | "low" | "auto";
};

/**
 * Preloads a single image
 */
export const preloadImage = (
  src: string,
  options: ImagePreloadOptions = {}
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    if (options.crossOrigin) {
      img.crossOrigin = options.crossOrigin;
    }

    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

/**
 * Preloads multiple images in parallel
 */
export const preloadImages = async (
  sources: readonly string[],
  options: ImagePreloadOptions = {}
): Promise<void[]> => {
  return Promise.all(sources.map((src) => preloadImage(src, options)));
};

/**
 * Preloads images using link preload tags (more efficient for critical resources)
 */
export const preloadImagesWithLink = (sources: readonly string[]): void => {
  sources.forEach((src) => {
    // Check if link already exists
    const existingLink = document.querySelector(`link[href="${src}"]`);
    if (existingLink) {
      return;
    }

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = src;
    if ("fetchPriority" in link) {
      (link as HTMLLinkElement & { fetchPriority: string }).fetchPriority = "high";
    }
    document.head.appendChild(link);
  });
};

/**
 * Preloads critical application images (logos, hero images)
 * Call this early in app initialization
 * 
 * @param logoPaths - Array of logo image paths (from Vite imports)
 */
export const preloadCriticalImages = (logoPaths: readonly string[]): void => {
  // Use link preload for better performance
  preloadImagesWithLink(logoPaths);
  
  // Also preload using Image objects for browser caching
  logoPaths.forEach((src) => {
    preloadImage(src).catch(() => {
      // Silently fail - image will load normally when needed
    });
  });
};

