import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Info,
  AlertCircle,
  CheckCircle2,
  Sliders,
  Download,
  HelpCircle,
  Settings,
  Grid
} from 'lucide-react';
import { MathParser } from '@/utils/mathParser';
import { useToast } from './calculator/Toast';

interface EquationItem {
  id: string;
  expression: string;
  color: string;
  visible: boolean;
  error?: string;
  compiledFn?: (x: number) => number;
}

const PRESET_COLORS = [
  '#f43f5e', // Rose
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#f97316'  // Orange
];

const MATHE_PRESETS = [
  {
    name: 'Sine Wave Trio',
    desc: 'Plots y = sin(x) and shifted harmonics to show phase interference.',
    equations: [
      { expression: 'sin(x)', color: '#f43f5e' },
      { expression: 'sin(2x) * 0.5', color: '#3b82f6' },
      { expression: 'sin(x) + sin(2x)*0.5', color: '#10b981' }
    ]
  },
  {
    name: 'Polynomial Parabola',
    desc: 'An elegant parabolic curve with multiple local roots.',
    equations: [
      { expression: 'x^2 - 4', color: '#f43f5e' },
      { expression: 'x^3 - 3x', color: '#8b5cf6' }
    ]
  },
  {
    name: 'Trigonometric Tan',
    desc: 'The beautiful repeating rational branches of the tangent function.',
    equations: [
      { expression: 'tan(x)', color: '#f97316' },
      { expression: 'cos(x)', color: '#3b82f6' }
    ]
  },
  {
    name: 'Exponential Growth',
    desc: 'Natural logarithm and exponential curves showcasing symmetry.',
    equations: [
      { expression: 'exp(x)', color: '#10b981' },
      { expression: 'ln(x)', color: '#f59e0b' },
      { expression: 'x', color: '#8b5cf6' }
    ]
  },
  {
    name: 'Damped Oscillator',
    desc: 'Slowing soundwaves represented by an exponential decay envelope.',
    equations: [
      { expression: 'exp(-0.2x) * sin(2x)', color: '#ec4899' },
      { expression: 'exp(-0.2x)', color: '#3b82f6' }
    ]
  }
];

export default function GraphingView() {
  const { addToast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Equations list state
  const [equations, setEquations] = useState<EquationItem[]>([
    { id: '1', expression: 'x^2 - 4', color: '#f43f5e', visible: true },
    { id: '2', expression: 'sin(x)', color: '#3b82f6', visible: true },
    { id: '3', expression: 'cos(2x)', color: '#10b981', visible: true }
  ]);

  // View parameters
  const [zoomLevel, setZoomLevel] = useState<number>(40); // Pixels per math unit
  const [offsetX, setOffsetX] = useState<number>(0);     // X center offset in pixels
  const [offsetY, setOffsetY] = useState<number>(0);     // Y center offset in pixels
  const [gridVisible, setGridVisible] = useState<boolean>(true);
  const [axesVisible, setAxesVisible] = useState<boolean>(true);
  const [labelsVisible, setLabelsVisible] = useState<boolean>(true);
  const [darkTheme, setDarkTheme] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  
  // Interactive Mouse State
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mouseCoord, setMouseCoord] = useState<{ x: number; y: number } | null>(null);
  const [activePresetIndex, setActivePresetIndex] = useState<number>(-1);

  // Width & height trackers
  const [dimensions, setDimensions] = useState({ width: 600, height: 450 });

  // Compile equations in real-time
  useEffect(() => {
    let changed = false;
    const updated = equations.map((eq) => {
      // Clean string
      const expr = eq.expression.trim();
      if (!expr) {
        if (eq.error !== undefined || eq.compiledFn !== undefined) changed = true;
        return { ...eq, error: undefined, compiledFn: undefined };
      }

      try {
        const fn = MathParser.compile(expr);
        // Test compile
        fn(1);
        if (eq.error !== undefined || eq.compiledFn === undefined) {
          changed = true;
        }
        return { ...eq, error: undefined, compiledFn: fn };
      } catch (err: any) {
        const errMsg = err.message || 'Invalid syntax';
        if (eq.error !== errMsg || eq.compiledFn !== undefined) {
          changed = true;
        }
        return { ...eq, error: errMsg, compiledFn: undefined };
      }
    });

    if (changed) {
      setEquations(updated);
    }
  }, [equations.map(eq => eq.expression).join('::')]); // Run only when expression texts change

  // Resize canvas handler
  useEffect(() => {
    if (!containerRef.current) return;

    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    handleResize();

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Main Draw Call
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensions;
    canvas.width = width;
    canvas.height = height;

    // Clear Screen
    const bgColor = darkTheme ? '#18181b' : '#ffffff';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Calculate grid properties
    const centerX = width / 2 + offsetX;
    const centerY = height / 2 + offsetY;

    // Grid step calculation
    const idealStepPx = 60; // We want labels roughly every 60 pixels
    const approxUnits = idealStepPx / zoomLevel;
    
    // Nice friendly steps: 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, etc.
    const magnitude = Math.pow(10, Math.floor(Math.log10(approxUnits)));
    const ratio = approxUnits / magnitude;
    let stepUnit = magnitude;
    if (ratio > 5) stepUnit = 5 * magnitude;
    else if (ratio > 2) stepUnit = 2 * magnitude;

    const stepPx = stepUnit * zoomLevel;

    // Helper: Map grid pixel space to mathematical coordinate
    const toMathX = (px: number) => (px - centerX) / zoomLevel;
    const toMathY = (py: number) => (centerY - py) / zoomLevel;

    // Helper: Map mathematical coordinate to pixel space
    const toPixelX = (x: number) => centerX + x * zoomLevel;
    const toPixelY = (y: number) => centerY - y * zoomLevel;

    const gridColor = darkTheme ? '#27272a' : '#f4f4f5';
    const majorGridColor = darkTheme ? '#3f3f46' : '#e4e4e7';
    const axisColor = darkTheme ? '#71717a' : '#a1a1aa';
    const labelColor = darkTheme ? '#a1a1aa' : '#52525b';

    // 1. Draw Grid Lines (Minor and Major)
    if (gridVisible) {
      ctx.lineWidth = 1;

      // Draw vertical lines left of center
      let currX = centerX;
      while (currX >= 0) {
        ctx.strokeStyle = Math.abs(toMathX(currX)) < 0.0001 ? axisColor : gridColor;
        ctx.beginPath();
        ctx.moveTo(currX, 0);
        ctx.lineTo(currX, height);
        ctx.stroke();
        currX -= stepPx / 5; // minor grid
      }
      
      currX = centerX;
      while (currX <= width) {
        ctx.strokeStyle = Math.abs(toMathX(currX)) < 0.0001 ? axisColor : gridColor;
        ctx.beginPath();
        ctx.moveTo(currX, 0);
        ctx.lineTo(currX, height);
        ctx.stroke();
        currX += stepPx / 5;
      }

      // Draw horizontal lines
      let currY = centerY;
      while (currY >= 0) {
        ctx.strokeStyle = Math.abs(toMathY(currY)) < 0.0001 ? axisColor : gridColor;
        ctx.beginPath();
        ctx.moveTo(0, currY);
        ctx.lineTo(width, currY);
        ctx.stroke();
        currY -= stepPx / 5;
      }

      currY = centerY;
      while (currY <= height) {
        ctx.strokeStyle = Math.abs(toMathY(currY)) < 0.0001 ? axisColor : gridColor;
        ctx.beginPath();
        ctx.moveTo(0, currY);
        ctx.lineTo(width, currY);
        ctx.stroke();
        currY += stepPx / 5;
      }

      // Major gridlines for contrast
      ctx.lineWidth = 1.2;
      currX = centerX;
      while (currX >= 0) {
        ctx.strokeStyle = Math.abs(toMathX(currX)) < 0.0001 ? axisColor : majorGridColor;
        ctx.beginPath();
        ctx.moveTo(currX, 0);
        ctx.lineTo(currX, height);
        ctx.stroke();
        currX -= stepPx;
      }
      currX = centerX;
      while (currX <= width) {
        ctx.strokeStyle = Math.abs(toMathX(currX)) < 0.0001 ? axisColor : majorGridColor;
        ctx.beginPath();
        ctx.moveTo(currX, 0);
        ctx.lineTo(currX, height);
        ctx.stroke();
        currX += stepPx;
      }

      currY = centerY;
      while (currY >= 0) {
        ctx.strokeStyle = Math.abs(toMathY(currY)) < 0.0001 ? axisColor : majorGridColor;
        ctx.beginPath();
        ctx.moveTo(0, currY);
        ctx.lineTo(width, currY);
        ctx.stroke();
        currY -= stepPx;
      }
      currY = centerY;
      while (currY <= height) {
        ctx.strokeStyle = Math.abs(toMathY(currY)) < 0.0001 ? axisColor : majorGridColor;
        ctx.beginPath();
        ctx.moveTo(0, currY);
        ctx.lineTo(width, currY);
        ctx.stroke();
        currY += stepPx;
      }
    }

    // 2. Draw Axes Lines (bolded lines)
    if (axesVisible) {
      ctx.strokeStyle = axisColor;
      ctx.lineWidth = 2.5;

      // X Axis
      if (centerY >= 0 && centerY <= height) {
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
      }

      // Y Axis
      if (centerX >= 0 && centerX <= width) {
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, height);
        ctx.stroke();
      }

      // Origin Marker dot
      ctx.fillStyle = axisColor;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Draw Axis Numbers Labels
    if (labelsVisible) {
      ctx.fillStyle = labelColor;
      ctx.font = '500 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      // Format clean labels, avoiding float precision tails
      const formatLabel = (val: number) => {
        return Number(val.toFixed(8)).toString();
      };

      // X Axis Labels
      let count = 0;
      let currX = centerX;
      while (currX >= 0) {
        const mathX = toMathX(currX);
        if (count > 0 && Math.abs(mathX) > 0.0001) {
          const labelY = Math.max(8, Math.min(height - 20, centerY + 8));
          ctx.fillText(formatLabel(mathX), currX, labelY);
        }
        currX -= stepPx;
        count++;
      }

      count = 0;
      currX = centerX;
      while (currX <= width) {
        const mathX = toMathX(currX);
        if (count > 0 && Math.abs(mathX) > 0.0001) {
          const labelY = Math.max(8, Math.min(height - 20, centerY + 8));
          ctx.fillText(formatLabel(mathX), currX, labelY);
        }
        currX += stepPx;
        count++;
      }

      // Y Axis Labels
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      let currY = centerY;
      count = 0;
      while (currY >= 0) {
        const mathY = toMathY(currY);
        if (count > 0 && Math.abs(mathY) > 0.0001) {
          const labelX = Math.max(8, Math.min(width - 8, centerX - 8));
          ctx.fillText(formatLabel(mathY), labelX, currY);
        }
        currY -= stepPx;
        count++;
      }

      currY = centerY;
      count = 0;
      while (currY <= height) {
        const mathY = toMathY(currY);
        if (count > 0 && Math.abs(mathY) > 0.0001) {
          const labelX = Math.max(8, Math.min(width - 8, centerX - 8));
          ctx.fillText(formatLabel(mathY), labelX, currY);
        }
        currY += stepPx;
        count++;
      }
    }

    // 4. Draw Curves (Plot equations)
    equations.forEach((eq) => {
      if (!eq.visible || !eq.compiledFn) return;

      ctx.strokeStyle = eq.color;
      ctx.lineWidth = 3.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      let first = true;
      let lastY = 0;

      // Draw pixel by pixel for perfect high-fidelity rendering
      for (let px = 0; px < width; px++) {
        const x = toMathX(px);
        const y = eq.compiledFn(x);

        if (isNaN(y) || !isFinite(y)) {
          // Break line sequence on asymptote / invalid domains
          first = true;
          continue;
        }

        const py = toPixelY(y);

        // Clip viewport boundaries to prevent canvas overflow artifacts
        if (py < -2000 || py > height + 2000) {
          first = true;
          continue;
        }

        // Detect huge step jump for asymptotic functions (e.g. tan(x), 1/x)
        if (!first) {
          const deltaY = Math.abs(py - lastY);
          // If the math values crossed infinity/asymptote, do not draw connect line segment
          const prevYMath = toMathY(lastY);
          if (deltaY > height * 1.5 && Math.sign(y) !== Math.sign(prevYMath)) {
            first = true;
          }
        }

        if (first) {
          ctx.moveTo(px, py);
          first = false;
        } else {
          ctx.lineTo(px, py);
        }
        lastY = py;
      }
      ctx.stroke();
    });

    // 5. Draw Interactive Coordinates Hover crosshair/dot
    if (mouseCoord && axesVisible) {
      const mx = mouseCoord.x;
      const my = mouseCoord.y;
      const xVal = toMathX(mx);

      // Draw visual vertical tracker line
      ctx.strokeStyle = darkTheme ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(mx, 0);
      ctx.lineTo(mx, height);
      ctx.stroke();

      // Draw coordinate dots on any function intersection
      equations.forEach((eq) => {
        if (!eq.visible || !eq.compiledFn) return;
        const yVal = eq.compiledFn(xVal);
        if (!isNaN(yVal) && isFinite(yVal)) {
          const py = toPixelY(yVal);
          if (py >= 0 && py <= height) {
            // Draw hover indicator dot
            ctx.fillStyle = eq.color;
            ctx.beginPath();
            ctx.arc(mx, py, 5.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = darkTheme ? '#18181b' : '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Render coordinate text bubbles above/below dot
            ctx.fillStyle = darkTheme ? '#f4f4f5' : '#18181b';
            ctx.font = 'bold 10px "JetBrains Mono", monospace';
            ctx.fillText(
              `(${Number(xVal.toFixed(2))}, ${Number(yVal.toFixed(2))})`,
              mx + 8,
              py - 8
            );
          }
        }
      });
    }

  }, [dimensions, equations, zoomLevel, offsetX, offsetY, gridVisible, axesVisible, labelsVisible, darkTheme, mouseCoord]);

  // Zoom controls
  const handleZoom = (factor: number) => {
    setZoomLevel((prev) => {
      const next = prev * factor;
      return Math.min(1500, Math.max(5, next));
    });
  };

  const handleResetView = () => {
    setZoomLevel(40);
    setOffsetX(0);
    setOffsetY(0);
    addToast('Coordinate framework reset to origin.', 'info');
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setOffsetX((prev) => prev + dx);
      setOffsetY((prev) => prev + dy);
      setDragStart({ x: e.clientX, y: e.clientY });
    }

    setMouseCoord({ x: mx, y: my });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setMouseCoord(null);
  };

  // Touch Drag Panning (Mobile Devices)
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !isDragging) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const mx = touch.clientX - rect.left;
    const my = touch.clientY - rect.top;

    const dx = touch.clientX - dragStart.x;
    const dy = touch.clientY - dragStart.y;

    setOffsetX((prev) => prev + dx);
    setOffsetY((prev) => prev + dy);
    setDragStart({ x: touch.clientX, y: touch.clientY });
    setMouseCoord({ x: mx, y: my });
  };

  // Add / Edit / Delete equations
  const handleAddEquation = () => {
    const nextColor = PRESET_COLORS[equations.length % PRESET_COLORS.length];
    const newEq: EquationItem = {
      id: Math.random().toString(36).substr(2, 9),
      expression: '',
      color: nextColor,
      visible: true
    };
    setEquations([...equations, newEq]);
    addToast('New equation slot created.', 'success');
  };

  const handleUpdateExpression = (id: string, text: string) => {
    setEquations((prev) =>
      prev.map((eq) => (eq.id === id ? { ...eq, expression: text } : eq))
    );
  };

  const handleToggleVisibility = (id: string) => {
    setEquations((prev) =>
      prev.map((eq) => (eq.id === id ? { ...eq, visible: !eq.visible } : eq))
    );
  };

  const handleDeleteEquation = (id: string) => {
    if (equations.length === 1) {
      setEquations([{ id: '1', expression: '', color: PRESET_COLORS[0], visible: true }]);
      addToast('Cleared last equation field.', 'info');
      return;
    }
    setEquations(equations.filter((eq) => eq.id !== id));
    addToast('Equation removed.', 'info');
  };

  const handleChangeColor = (id: string, color: string) => {
    setEquations((prev) =>
      prev.map((eq) => (eq.id === id ? { ...eq, color } : eq))
    );
  };

  // Presets
  const handleLoadPreset = (idx: number) => {
    const preset = MATHE_PRESETS[idx];
    const loaded = preset.equations.map((eq, eqIdx) => ({
      id: Math.random().toString(36).substr(2, 9) + eqIdx,
      expression: eq.expression,
      color: eq.color,
      visible: true
    }));
    setEquations(loaded);
    setActivePresetIndex(idx);
    handleResetView();
    addToast(`Preset "${preset.name}" loaded.`, 'success');
  };

  const handleClearAll = () => {
    setEquations([{ id: '1', expression: '', color: PRESET_COLORS[0], visible: true }]);
    setOffsetX(0);
    setOffsetY(0);
    setZoomLevel(40);
    addToast('Graph canvas and formulas cleared.', 'info');
  };

  // Export Plot Image
  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `metricores-graph-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      addToast('Graph screenshot exported successfully.', 'success');
    } catch (err) {
      addToast('Could not export screenshot.', 'error');
    }
  };

  return (
    <div className="py-8 md:py-12 max-w-[95%] w-[95%] mx-auto px-4" id="graphing-page-root">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-1.5 text-[10px] sm:text-[11px] font-sans text-zinc-400 mb-4 print:hidden" id="graph-breadcrumbs">
        <button onClick={() => window.location.href = '/'} className="hover:text-blue-600 transition-colors cursor-pointer focus:outline-none">Home</button>
        <span className="text-zinc-300">&gt;</span>
        <span className="text-zinc-500 font-medium">Calculators</span>
        <span className="text-zinc-300">&gt;</span>
        <span className="text-zinc-600 font-semibold">Graphing Calculator</span>
      </nav>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-start justify-between border-b border-zinc-200 pb-6 mb-8" id="graphing-hero">
        <div className="space-y-2.5 max-w-2xl" id="graphing-hero-left">
          <div className="flex items-center space-x-2" id="graphing-category">
            <span className="px-2.5 py-0.5 bg-rose-50 text-rose-600 text-[11px] font-bold uppercase tracking-wider rounded-full font-sans border border-rose-100">
              Active Graphing Suite
            </span>
            <span className="text-zinc-300 font-sans">•</span>
            <span className="text-[11px] text-zinc-500 font-sans font-medium uppercase tracking-wider">
              High Precision HTML5 Engine
            </span>
          </div>
          <h1 className="text-2xl md:text-3.5xl font-extrabold tracking-tight text-zinc-900 font-heading flex items-center gap-2">
            <Grid className="w-7 h-7 text-rose-500 shrink-0" />
            Graphing Calculator
          </h1>
          <p className="text-sm text-zinc-600 font-sans leading-relaxed">
            Enter equations like <code className="font-mono bg-zinc-100 text-zinc-800 px-1 py-0.5 rounded text-xs">sin(x)</code> or <code className="font-mono bg-zinc-100 text-zinc-800 px-1 py-0.5 rounded text-xs">x^2 - 4</code> to render curves instantly. Panning and zooming are supported on desktop and touch devices.
          </p>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="graphing-layout-grid">
        
        {/* Left Side: Equations & Presets Controls Sidebar (5 Cols) */}
        <div className="lg:col-span-5 space-y-6" id="graphing-sidebar">
          
          {/* Preset Formulas Card */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-5 shadow-sm" id="preset-card">
            <div className="flex items-center space-x-2 border-b border-zinc-100 pb-2.5 mb-3">
              <Sliders className="w-4 h-4 text-rose-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 font-sans">
                Curated Curve Presets
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {MATHE_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLoadPreset(idx)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs focus:outline-none flex flex-col space-y-1 ${
                    activePresetIndex === idx
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : 'bg-zinc-50 hover:bg-zinc-100/80 border-zinc-200/60 text-zinc-700'
                  }`}
                  id={`preset-btn-${idx}`}
                >
                  <span className="font-bold flex items-center justify-between">
                    <span>{p.name}</span>
                    {activePresetIndex === idx && (
                      <span className="text-[10px] font-black uppercase text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded">Active</span>
                    )}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-sans leading-normal line-clamp-2">{p.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Formulas Panel */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4" id="equations-panel">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 font-sans">
                  Active Equations List
                </h3>
              </div>
              <button
                onClick={handleClearAll}
                className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600 font-sans flex items-center space-x-1 uppercase focus:outline-none"
                id="btn-clear-all"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-3" id="equations-list-container">
              {equations.map((eq) => (
                <div
                  key={eq.id}
                  className={`p-3.5 border rounded-xl transition-all space-y-2.5 relative ${
                    eq.error
                      ? 'border-red-200 bg-red-50/20'
                      : 'border-zinc-200/80 bg-zinc-50/50'
                  }`}
                  id={`eq-card-${eq.id}`}
                >
                  <div className="flex items-center space-x-2">
                    {/* Color Swatch Selector */}
                    <div className="relative group">
                      <button
                        className="w-5 h-5 rounded-full border border-white shadow-xs cursor-pointer focus:outline-none"
                        style={{ backgroundColor: eq.color }}
                        title="Change Color"
                        id={`eq-color-swatch-${eq.id}`}
                      />
                      {/* Color Menu Popover on Hover */}
                      <div className="absolute left-0 top-6 hidden group-hover:flex bg-white border border-zinc-200 p-1.5 rounded-lg shadow-lg z-50 gap-1.5">
                        {PRESET_COLORS.map((col) => (
                          <button
                            key={col}
                            onClick={() => handleChangeColor(eq.id, col)}
                            className="w-4 h-4 rounded-full border border-zinc-100 hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                            style={{ backgroundColor: col }}
                          />
                        ))}
                      </div>
                    </div>

                    <span className="text-zinc-400 font-mono text-xs">y =</span>

                    <input
                      type="text"
                      placeholder="e.g. sin(x) or x^2"
                      value={eq.expression}
                      onChange={(e) => handleUpdateExpression(eq.id, e.target.value)}
                      className={`flex-1 py-1 px-2.5 bg-white border text-xs rounded-lg text-zinc-900 font-mono shadow-inner focus:outline-none focus:ring-2 ${
                        eq.error
                          ? 'border-red-300 focus:ring-red-500/20'
                          : 'border-zinc-200 focus:ring-rose-500/20 focus:border-rose-500'
                      }`}
                      id={`eq-input-field-${eq.id}`}
                    />

                    {/* Vis Toggle */}
                    <button
                      onClick={() => handleToggleVisibility(eq.id)}
                      className="text-zinc-400 hover:text-zinc-600 focus:outline-none cursor-pointer"
                      title={eq.visible ? 'Hide Curve' : 'Show Curve'}
                      id={`eq-vis-btn-${eq.id}`}
                    >
                      {eq.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteEquation(eq.id)}
                      className="text-zinc-400 hover:text-rose-600 focus:outline-none cursor-pointer"
                      title="Delete Formula"
                      id={`eq-del-btn-${eq.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Dynamic Status / Error Messages */}
                  {eq.error ? (
                    <div className="flex items-center space-x-1.5 text-[10px] text-red-600 font-sans" id={`eq-err-${eq.id}`}>
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span className="font-semibold line-clamp-1">{eq.error}</span>
                    </div>
                  ) : eq.expression.trim() !== '' ? (
                    <div className="flex items-center space-x-1.5 text-[10px] text-emerald-600 font-sans" id={`eq-ok-${eq.id}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ready & compiled successfully.</span>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <button
              onClick={handleAddEquation}
              className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl font-sans flex items-center justify-center space-x-1.5 transition-colors focus:outline-none cursor-pointer shadow-sm"
              id="btn-add-equation"
            >
              <Plus className="w-4 h-4" />
              <span>Add Function Curve</span>
            </button>
          </div>

        </div>

        {/* Right Side: Large Graph Render Canvas & Toolbar (7 Cols) */}
        <div className="lg:col-span-7 space-y-4" id="graphing-canvas-panel">
          
          {/* Plot Toolbar Container */}
          <div className="bg-zinc-100 border border-zinc-200 rounded-2xl p-2.5 flex flex-wrap items-center justify-between gap-2.5" id="plot-toolbar">
            
            {/* Left Tools */}
            <div className="flex items-center space-x-2" id="toolbar-left-group">
              <button
                onClick={handleResetView}
                className="p-2 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-600 rounded-xl transition-all shadow-xs cursor-pointer focus:outline-none flex items-center space-x-1 text-xs font-bold"
                title="Reset Camera View"
                id="btn-reset-view"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Origin</span>
              </button>

              <button
                onClick={() => setGridVisible(!gridVisible)}
                className={`p-2 border rounded-xl transition-all cursor-pointer focus:outline-none text-xs font-bold flex items-center space-x-1 ${
                  gridVisible
                    ? 'bg-zinc-200 border-zinc-300 text-zinc-800'
                    : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-500'
                }`}
                title="Toggle Grid Lines"
                id="btn-toggle-grid"
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>

              <button
                onClick={() => setLabelsVisible(!labelsVisible)}
                className={`p-2 border rounded-xl transition-all cursor-pointer focus:outline-none text-xs font-bold flex items-center space-x-1 ${
                  labelsVisible
                    ? 'bg-zinc-200 border-zinc-300 text-zinc-800'
                    : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-500'
                }`}
                title="Toggle Axis Numbers"
                id="btn-toggle-labels"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Labels</span>
              </button>
            </div>

            {/* Right Tools */}
            <div className="flex items-center space-x-1.5" id="toolbar-right-group">
              {/* Theme Selector */}
              <button
                onClick={() => setDarkTheme(!darkTheme)}
                className="p-2 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-600 rounded-xl transition-all shadow-xs cursor-pointer focus:outline-none text-xs font-bold"
                id="btn-toggle-canvas-theme"
              >
                {darkTheme ? 'Light Canvas' : 'Dark Canvas'}
              </button>

              {/* Zoom Buttons */}
              <button
                onClick={() => handleZoom(1.25)}
                className="p-2 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-600 rounded-xl transition-all shadow-xs cursor-pointer focus:outline-none"
                title="Zoom In"
                id="btn-zoom-in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => handleZoom(0.8)}
                className="p-2 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-600 rounded-xl transition-all shadow-xs cursor-pointer focus:outline-none"
                title="Zoom Out"
                id="btn-zoom-out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={() => {
                  const root = document.getElementById('canvas-viewport-wrapper');
                  if (!root) return;
                  if (!isFullscreen) {
                    if (root.requestFullscreen) root.requestFullscreen();
                    setIsFullscreen(true);
                  } else {
                    if (document.exitFullscreen) document.exitFullscreen();
                    setIsFullscreen(false);
                  }
                }}
                className="p-2 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-600 rounded-xl transition-all shadow-xs cursor-pointer focus:outline-none"
                title="Toggle Fullscreen"
                id="btn-fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Export PNG */}
              <button
                onClick={handleExportPNG}
                className="p-2 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-600 rounded-xl transition-all shadow-xs cursor-pointer focus:outline-none"
                title="Download Graph Plot"
                id="btn-export-png"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Graph Viewport Area */}
          <div
            id="canvas-viewport-wrapper"
            ref={containerRef}
            className={`w-full h-[450px] border rounded-2xl relative shadow-inner overflow-hidden cursor-crosshair select-none ${
              darkTheme ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-white'
            }`}
          >
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
              className="absolute inset-0 block w-full h-full"
            />

            {/* Scale/Coordinates Info display */}
            <div className="absolute left-4 top-4 bg-zinc-950/80 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl text-white font-mono text-xs space-y-0.5 select-none pointer-events-none" id="viewport-stats">
              <div className="text-[9px] text-zinc-400 font-sans tracking-wide">VIEWPORT STATS</div>
              <div>Zoom Scale: <span className="text-rose-400 font-bold">{Math.round(zoomLevel)}%</span></div>
              <div>Grid Steps: <span className="text-rose-400 font-bold">{Math.abs(60 / zoomLevel).toFixed(2)}u</span></div>
            </div>

            {/* Quick Helper hint overlays */}
            <div className="absolute right-4 bottom-4 bg-zinc-900/65 backdrop-blur-xs px-2.5 py-1 rounded-md text-[9px] text-zinc-300 font-sans select-none pointer-events-none tracking-wider">
              DRAG TO PAN • SCROLL TO ZOOM
            </div>
          </div>

        </div>

      </div>

      {/* Math Guide Explainer */}
      <div className="mt-8 bg-zinc-50 border border-zinc-200/50 rounded-2xl p-6 space-y-4" id="graphing-math-guide">
        <div className="flex items-center space-x-2" id="guide-head">
          <Info className="w-4 h-4 text-zinc-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 font-sans">
            Mathematical Function Reference & Syntax Guide
          </h3>
        </div>
        <p className="text-xs text-zinc-500 font-sans leading-relaxed">
          The parser interprets formulas with algebraic precedence and implicit multiplier variables. Learn how to format your mathematical models below:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-zinc-600 font-sans" id="guide-columns">
          <div className="space-y-1.5">
            <h4 className="font-bold text-zinc-800">1. Standard Trigonometry</h4>
            <p className="text-zinc-500">Supports standard radian functions:</p>
            <ul className="list-disc list-inside space-y-0.5 text-zinc-500">
              <li><code className="bg-zinc-100 text-zinc-800 px-1 py-0.5 rounded text-[11px] font-mono">sin(x)</code>, <code className="bg-zinc-100 text-zinc-800 px-1 py-0.5 rounded text-[11px] font-mono">cos(x)</code></li>
              <li><code className="bg-zinc-100 text-zinc-800 px-1 py-0.5 rounded text-[11px] font-mono">tan(x)</code> (drawn with asymptote guards)</li>
            </ul>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-bold text-zinc-800">2. Exponents & Roots</h4>
            <p className="text-zinc-500">Solve powers and real logarithms:</p>
            <ul className="list-disc list-inside space-y-0.5 text-zinc-500">
              <li><code className="bg-zinc-100 text-zinc-800 px-1 py-0.5 rounded text-[11px] font-mono">x^2</code>, <code className="bg-zinc-100 text-zinc-800 px-1 py-0.5 rounded text-[11px] font-mono">x^3</code>, <code className="bg-zinc-100 text-zinc-800 px-1 py-0.5 rounded text-[11px] font-mono">exp(x)</code></li>
              <li><code className="bg-zinc-100 text-zinc-800 px-1 py-0.5 rounded text-[11px] font-mono">sqrt(x)</code>, <code className="bg-zinc-100 text-zinc-800 px-1 py-0.5 rounded text-[11px] font-mono">ln(x)</code> (natural base e)</li>
            </ul>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-bold text-zinc-800">3. Algebraic Shorthand</h4>
            <p className="text-zinc-500">Desmos-level implicit multipliers:</p>
            <ul className="list-disc list-inside space-y-0.5 text-zinc-500">
              <li>Type <code className="bg-zinc-100 text-zinc-800 px-1 py-0.5 rounded text-[11px] font-mono">2x</code> instead of <code className="bg-zinc-100 text-zinc-800 px-1 py-0.5 rounded text-[11px] font-mono">2 * x</code></li>
              <li>Type <code className="bg-zinc-100 text-zinc-800 px-1 py-0.5 rounded text-[11px] font-mono">(x+1)(x-1)</code> instead of multiplying</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
