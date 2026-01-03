import { useEffect } from 'react';

/**
 * Component to generate PWA icons programmatically using canvas
 * This runs once on mount to create the icon files
 */
export function PWAIcons() {
  useEffect(() => {
    generateIcons();
  }, []);

  const generateIcons = () => {
    // Generate 192x192 icon
    generateIcon(192);
    // Generate 512x512 icon
    generateIcon(512);
  };

  const generateIcon = (size: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    const scale = size / 512;

    // Background with rounded corners
    ctx.fillStyle = '#10b981';
    roundRect(ctx, 0, 0, size, size, 115 * scale);
    ctx.fill();

    // Dumbbell icon
    ctx.fillStyle = '#ffffff';

    // Left weight
    roundRect(ctx, 120 * scale, 200 * scale, 40 * scale, 80 * scale, 8 * scale);
    ctx.fill();

    // Left plate
    ctx.globalAlpha = 0.3;
    roundRect(ctx, 115 * scale, 190 * scale, 50 * scale, 100 * scale, 10 * scale);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Bar
    roundRect(ctx, 160 * scale, 225 * scale, 200 * scale, 30 * scale, 15 * scale);
    ctx.fill();

    // Right weight
    roundRect(ctx, 360 * scale, 200 * scale, 40 * scale, 80 * scale, 8 * scale);
    ctx.fill();

    // Right plate
    ctx.globalAlpha = 0.3;
    roundRect(ctx, 355 * scale, 190 * scale, 50 * scale, 100 * scale, 10 * scale);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Center grip marks
    ctx.fillStyle = '#09090b';
    const gripY = 240 * scale;
    [240, 260, 280].forEach((x) => {
      ctx.beginPath();
      ctx.arc(x * scale, gripY, 8 * scale, 0, Math.PI * 2);
      ctx.fill();
    });

    // Convert to blob and create download link (for development)
    canvas.toBlob((blob) => {
      if (blob && typeof window !== 'undefined') {
        const url = URL.createObjectURL(blob);
        // Store in sessionStorage for reference
        sessionStorage.setItem(`pwa-icon-${size}`, url);
        
        // Optionally download during development
        // const a = document.createElement('a');
        // a.href = url;
        // a.download = `icon-${size}.png`;
        // a.click();
      }
    });
  };

  // Helper function to draw rounded rectangles
  const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  return null; // This component doesn't render anything
}
