import { useState, useEffect, useRef } from 'react';
import { Clock, Trash2, ArrowLeftRight, HelpCircle, Delete, CornerDownLeft } from 'lucide-react';

interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: string;
}

export default function ScientificCalculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [isDeg, setIsDeg] = useState(true);
  const [memory, setMemory] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isError, setIsError] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'scientific'>('basic'); // for mobile layout split

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('metricores_scientific_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  }, []);

  // Save history helper
  const saveHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem('metricores_scientific_history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Failed to save history', e);
    }
  };

  // Math Helper functions
  const factorial = (n: number): number => {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    const maxN = Math.min(n, 170); // 170! is JS double limit
    for (let i = 2; i <= maxN; i++) {
      result *= i;
    }
    return result;
  };

  const parseFactorials = (str: string): string => {
    // Find numbers followed by ! (e.g. 5!)
    let regex = /(\d+(?:\.\d+)?)\!/g;
    let matches;
    let safetyCounter = 0;
    while ((matches = regex.exec(str)) !== null && safetyCounter < 50) {
      safetyCounter++;
      const num = parseFloat(matches[1]);
      const factVal = factorial(num);
      str = str.replace(matches[0], factVal.toString());
      regex.lastIndex = 0; // Reset regex to catch overlapping matches
    }
    return str;
  };

  // Math execution helper
  const evaluate = (expr: string, isDegreeMode: boolean): number => {
    let sanitized = expr;

    // Replace pretty math signs with JS math signs
    sanitized = sanitized.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');

    // Parse factorials first
    sanitized = parseFactorials(sanitized);

    // Percentage: convert standard % to value / 100 or multiplied by 0.01
    sanitized = sanitized.replace(/%/g, ' * 0.01');

    // Add implicit multiplication (e.g., 2π -> 2*π, 2(3) -> 2*(3))
    // Digit/constant followed by parenthesis or word/constant/function
    sanitized = sanitized.replace(/(\d+(?:\.\d+)?)(?=[a-zA-Z\(πe])/g, '$1*');
    // Right parenthesis followed by digit/constant/word/parenthesis
    sanitized = sanitized.replace(/\)(?=[0-9\(πea-zA-Z])/g, ')*');
    // Constant π or e followed by digit/word/parenthesis
    sanitized = sanitized.replace(/([πe])(?=[0-9\(πea-zA-Z])/g, '$1*');

    // Substitute standard constants
    sanitized = sanitized.replace(/π/g, 'Math.PI');
    sanitized = sanitized.replace(/\be\b/g, 'Math.E');

    // Map ^ to **
    sanitized = sanitized.replace(/\^/g, '**');

    // Map custom scientific functions to local scope equivalents
    const calcSin = (x: number) => Math.sin(isDegreeMode ? (x * Math.PI) / 180 : x);
    const calcCos = (x: number) => Math.cos(isDegreeMode ? (x * Math.PI) / 180 : x);
    const calcTan = (x: number) => Math.tan(isDegreeMode ? (x * Math.PI) / 180 : x);
    
    const calcAsin = (x: number) => isDegreeMode ? (Math.asin(x) * 180) / Math.PI : Math.asin(x);
    const calcAcos = (x: number) => isDegreeMode ? (Math.acos(x) * 180) / Math.PI : Math.acos(x);
    const calcAtan = (x: number) => isDegreeMode ? (Math.atan(x) * 180) / Math.PI : Math.atan(x);
    
    const calcSinh = (x: number) => Math.sinh(x);
    const calcCosh = (x: number) => Math.cosh(x);
    const calcTanh = (x: number) => Math.tanh(x);
    
    const calcLog = (x: number) => Math.log10(x);
    const calcLn = (x: number) => Math.log(x);
    const calcExp = (x: number) => Math.exp(x);
    const calcSqrt = (x: number) => Math.sqrt(x);
    const calcAbs = (x: number) => Math.abs(x);

    // Replace user scientific functions (substituting nested safely)
    sanitized = sanitized.replace(/asin\(/g, 'calcAsin(');
    sanitized = sanitized.replace(/acos\(/g, 'calcAcos(');
    sanitized = sanitized.replace(/atan\(/g, 'calcAtan(');
    sanitized = sanitized.replace(/sinh\(/g, 'calcSinh(');
    sanitized = sanitized.replace(/cosh\(/g, 'calcCosh(');
    sanitized = sanitized.replace(/tanh\(/g, 'calcTanh(');
    sanitized = sanitized.replace(/sin\(/g, 'calcSin(');
    sanitized = sanitized.replace(/cos\(/g, 'calcCos(');
    sanitized = sanitized.replace(/tan\(/g, 'calcTan(');
    sanitized = sanitized.replace(/log\(/g, 'calcLog(');
    sanitized = sanitized.replace(/ln\(/g, 'calcLn(');
    sanitized = sanitized.replace(/exp\(/g, 'calcExp(');
    sanitized = sanitized.replace(/sqrt\(/g, 'calcSqrt(');
    sanitized = sanitized.replace(/abs\(/g, 'calcAbs(');

    // Dynamic clean runner
    const runner = new Function(
      'calcSin', 'calcCos', 'calcTan', 
      'calcAsin', 'calcAcos', 'calcAtan', 
      'calcSinh', 'calcCosh', 'calcTanh', 
      'calcLog', 'calcLn', 'calcExp', 
      'calcSqrt', 'calcAbs',
      `return (${sanitized});`
    );

    const val = runner(
      calcSin, calcCos, calcTan,
      calcAsin, calcAcos, calcAtan,
      calcSinh, calcCosh, calcTanh,
      calcLog, calcLn, calcExp,
      calcSqrt, calcAbs
    );

    if (typeof val !== 'number' || isNaN(val) || !isFinite(val)) {
      throw new Error('Invalid calculation');
    }

    return val;
  };

  // Button Click Logic
  const handleBtnPress = (value: string, type: 'number' | 'operator' | 'function' | 'action' | 'memory') => {
    setIsError(false);

    if (type === 'action') {
      if (value === 'AC') {
        setDisplay('0');
        setExpression('');
      } else if (value === 'CE') {
        setDisplay('0');
      } else if (value === '⌫') {
        if (display.length <= 1 || display === 'Error') {
          setDisplay('0');
        } else {
          setDisplay(display.slice(0, -1));
        }
      } else if (value === '=') {
        try {
          const finalExpr = expression ? `${expression}${display}` : display;
          
          // Balance parentheses if needed
          let openCount = (finalExpr.match(/\(/g) || []).length;
          let closeCount = (finalExpr.match(/\)/g) || []).length;
          let balancedExpr = finalExpr;
          while (openCount > closeCount) {
            balancedExpr += ')';
            closeCount++;
          }

          const evaluatedVal = evaluate(balancedExpr, isDeg);
          
          // Format result cleanly
          let resultStr = evaluatedVal.toString();
          if (resultStr.includes('.') && resultStr.length > 12) {
            resultStr = parseFloat(evaluatedVal.toFixed(10)).toString();
          }

          setDisplay(resultStr);
          setExpression('');

          // Save to history
          const newItem: HistoryItem = {
            id: Date.now().toString(),
            expression: balancedExpr,
            result: resultStr,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          saveHistory([newItem, ...history].slice(0, 30));

        } catch (err) {
          setDisplay('Error');
          setIsError(true);
        }
      }
    } else if (type === 'number') {
      if (display === '0' || display === 'Error' || expression === '') {
        if (value === '.') {
          setDisplay('0.');
        } else {
          setDisplay(value);
        }
      } else {
        if (value === '.' && display.includes('.')) return; // Prevent double decimals
        setDisplay(display + value);
      }
    } else if (type === 'operator') {
      if (display === 'Error') return;
      setExpression((prev) => `${prev}${display} ${value} `);
      setDisplay('0');
    } else if (type === 'function') {
      if (display === 'Error') return;

      // Handle direct single-value unary operations or parentheses wrap
      if (value === 'x²') {
        setDisplay((prev) => `(${prev})^2`);
      } else if (value === 'x³') {
        setDisplay((prev) => `(${prev})^3`);
      } else if (value === '1/x') {
        setDisplay((prev) => `1/(${prev})`);
      } else if (value === 'abs') {
        setDisplay((prev) => `abs(${prev})`);
      } else if (value === 'exp') {
        setDisplay((prev) => `exp(${prev})`);
      } else if (value === 'sqrt') {
        setDisplay((prev) => `sqrt(${prev})`);
      } else if (value === '!') {
        setDisplay((prev) => `${prev}!`);
      } else {
        // Appending standard functions like sin(, log(, etc.
        if (display === '0' || display === 'Error') {
          setDisplay(`${value}(`);
        } else {
          setDisplay((prev) => `${prev}${value}(`);
        }
      }
    } else if (type === 'memory') {
      const currentVal = parseFloat(display) || 0;
      switch (value) {
        case 'MC':
          setMemory(0);
          break;
        case 'MR':
          setDisplay(memory.toString());
          break;
        case 'MS':
          setMemory(currentVal);
          break;
        case 'M+':
          setMemory((prev) => prev + currentVal);
          break;
        case 'M-':
          setMemory((prev) => prev - currentVal);
          break;
      }
    }
  };

  const clearHistory = () => {
    saveHistory([]);
  };

  const selectHistoryItem = (item: HistoryItem) => {
    setDisplay(item.result);
    setExpression('');
  };

  // Keyboard support listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Numbers
      if (/[0-9]/.test(e.key)) {
        handleBtnPress(e.key, 'number');
      } else if (e.key === '.') {
        handleBtnPress('.', 'number');
      }
      // Operators
      else if (e.key === '+') {
        handleBtnPress('+', 'operator');
      } else if (e.key === '-') {
        handleBtnPress('−', 'operator');
      } else if (e.key === '*') {
        handleBtnPress('×', 'operator');
      } else if (e.key === '/') {
        handleBtnPress('÷', 'operator');
      } else if (e.key === '%') {
        handleBtnPress('%', 'operator');
      }
      // Action keys
      else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleBtnPress('=', 'action');
      } else if (e.key === 'Backspace') {
        handleBtnPress('⌫', 'action');
      } else if (e.key === 'Escape') {
        handleBtnPress('AC', 'action');
      } else if (e.key === '(') {
        handleBtnPress('(', 'number');
      } else if (e.key === ')') {
        handleBtnPress(')', 'number');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, expression, isDeg]);

  return (
    <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="scientific-calc-core">
      {/* Main Interactive Calculator */}
      <div className="lg:col-span-8 bg-zinc-950 rounded-xl p-5 md:p-6 shadow-2xl border border-zinc-800 space-y-6">
        
        {/* Status Line */}
        <div className="flex items-center justify-between text-[11px] font-sans text-zinc-500 font-semibold px-1">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsDeg(true)} 
              className={`px-2 py-0.5 rounded-sm transition-colors cursor-pointer ${isDeg ? 'bg-zinc-800 text-amber-400 border border-zinc-700' : 'hover:text-zinc-300'}`}
            >
              DEG
            </button>
            <button 
              onClick={() => setIsDeg(false)} 
              className={`px-2 py-0.5 rounded-sm transition-colors cursor-pointer ${!isDeg ? 'bg-zinc-800 text-amber-400 border border-zinc-700' : 'hover:text-zinc-300'}`}
            >
              RAD
            </button>
          </div>
          <div className="flex items-center space-x-2">
            {memory !== 0 && (
              <span className="bg-amber-400/10 text-amber-400 px-1.5 py-0.5 rounded-sm border border-amber-400/20 font-mono text-[9px] uppercase tracking-wider">
                M ({parseFloat(memory.toFixed(4))})
              </span>
            )}
            <span className="text-zinc-600 font-mono text-[10px]">SCI-CALC V1.0</span>
          </div>
        </div>

        {/* LED High Fidelity Display */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex flex-col justify-between items-end min-h-[110px] space-y-2 select-all relative overflow-hidden">
          <div className="absolute top-1 left-2 text-[9px] font-mono text-zinc-600 tracking-wider">LED MATRICES ACTIVE</div>
          
          {/* Formula preview */}
          <div className="text-right text-zinc-400 font-mono text-sm tracking-wide break-all min-h-[20px] max-w-full truncate">
            {expression}
          </div>
          
          {/* Result Output */}
          <div className={`text-right font-mono text-3xl sm:text-4xl font-semibold tracking-tight break-all truncate max-w-full ${isError ? 'text-rose-500' : 'text-white'}`}>
            {display}
          </div>
        </div>

        {/* Mobile Keypad Segmented Control */}
        <div className="flex md:hidden bg-zinc-900 p-1 rounded-lg border border-zinc-800">
          <button 
            onClick={() => setActiveTab('basic')}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-md transition-all ${activeTab === 'basic' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}
          >
            Basic Matrix
          </button>
          <button 
            onClick={() => setActiveTab('scientific')}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-md transition-all ${activeTab === 'scientific' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}
          >
            Scientific Pad
          </button>
        </div>

        {/* Full Desktop Keypad (Scientific & Standard) / Tabbed on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5" id="keypad-grid-parent">
          
          {/* Left Block: Scientific Pad (Hidden on mobile if Basic is chosen) */}
          <div className={`md:col-span-5 grid grid-cols-4 gap-2.5 transition-all duration-150 ${activeTab === 'basic' ? 'hidden md:grid' : 'grid'}`}>
            {/* Row 1 */}
            <button onClick={() => handleBtnPress('sin', 'function')} className="calc-sci-btn">sin</button>
            <button onClick={() => handleBtnPress('cos', 'function')} className="calc-sci-btn">cos</button>
            <button onClick={() => handleBtnPress('tan', 'function')} className="calc-sci-btn">tan</button>
            <button onClick={() => handleBtnPress('asin', 'function')} className="calc-sci-btn">sin⁻¹</button>

            {/* Row 2 */}
            <button onClick={() => handleBtnPress('sinh', 'function')} className="calc-sci-btn">sinh</button>
            <button onClick={() => handleBtnPress('cosh', 'function')} className="calc-sci-btn">cosh</button>
            <button onClick={() => handleBtnPress('tanh', 'function')} className="calc-sci-btn">tanh</button>
            <button onClick={() => handleBtnPress('acos', 'function')} className="calc-sci-btn">cos⁻¹</button>

            {/* Row 3 */}
            <button onClick={() => handleBtnPress('ln', 'function')} className="calc-sci-btn">ln</button>
            <button onClick={() => handleBtnPress('log', 'function')} className="calc-sci-btn">log</button>
            <button onClick={() => handleBtnPress('abs', 'function')} className="calc-sci-btn">abs</button>
            <button onClick={() => handleBtnPress('atan', 'function')} className="calc-sci-btn">tan⁻¹</button>

            {/* Row 4 */}
            <button onClick={() => handleBtnPress('x²', 'function')} className="calc-sci-btn">x²</button>
            <button onClick={() => handleBtnPress('x³', 'function')} className="calc-sci-btn">x³</button>
            <button onClick={() => handleBtnPress('^', 'operator')} className="calc-sci-btn">xʸ</button>
            <button onClick={() => handleBtnPress('sqrt', 'function')} className="calc-sci-btn">√</button>

            {/* Row 5 */}
            <button onClick={() => handleBtnPress('π', 'number')} className="calc-sci-btn text-amber-400">π</button>
            <button onClick={() => handleBtnPress('e', 'number')} className="calc-sci-btn text-amber-400">e</button>
            <button onClick={() => handleBtnPress('!', 'function')} className="calc-sci-btn">x!</button>
            <button onClick={() => handleBtnPress('1/x', 'function')} className="calc-sci-btn">1/x</button>

            {/* Row 6 */}
            <button onClick={() => handleBtnPress('exp', 'function')} className="calc-sci-btn col-span-2">exp</button>
            <button onClick={() => handleBtnPress('(', 'number')} className="calc-sci-btn">(</button>
            <button onClick={() => handleBtnPress(')', 'number')} className="calc-sci-btn">)</button>
          </div>

          {/* Right Block: Standard Keypad (Hidden on mobile if Scientific is chosen) */}
          <div className={`md:col-span-7 grid grid-cols-4 gap-2.5 transition-all duration-150 ${activeTab === 'scientific' ? 'hidden md:grid' : 'grid'}`}>
            
            {/* Memory Functions Row */}
            <button onClick={() => handleBtnPress('MC', 'memory')} className="calc-mem-btn">MC</button>
            <button onClick={() => handleBtnPress('MR', 'memory')} className="calc-mem-btn">MR</button>
            <button onClick={() => handleBtnPress('MS', 'memory')} className="calc-mem-btn">MS</button>
            <div className="grid grid-cols-2 gap-1 col-span-1">
              <button onClick={() => handleBtnPress('M+', 'memory')} className="calc-mem-mini-btn">M+</button>
              <button onClick={() => handleBtnPress('M-', 'memory')} className="calc-mem-mini-btn">M-</button>
            </div>

            {/* Row 1 */}
            <button onClick={() => handleBtnPress('CE', 'action')} className="calc-act-btn text-rose-400">CE</button>
            <button onClick={() => handleBtnPress('AC', 'action')} className="calc-act-btn text-rose-500">AC</button>
            <button onClick={() => handleBtnPress('⌫', 'action')} className="calc-act-btn flex items-center justify-center">
              <Delete className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => handleBtnPress('÷', 'operator')} className="calc-op-btn">÷</button>

            {/* Row 2 */}
            <button onClick={() => handleBtnPress('7', 'number')} className="calc-num-btn">7</button>
            <button onClick={() => handleBtnPress('8', 'number')} className="calc-num-btn">8</button>
            <button onClick={() => handleBtnPress('9', 'number')} className="calc-num-btn">9</button>
            <button onClick={() => handleBtnPress('×', 'operator')} className="calc-op-btn">×</button>

            {/* Row 3 */}
            <button onClick={() => handleBtnPress('4', 'number')} className="calc-num-btn">4</button>
            <button onClick={() => handleBtnPress('5', 'number')} className="calc-num-btn">5</button>
            <button onClick={() => handleBtnPress('6', 'number')} className="calc-num-btn">6</button>
            <button onClick={() => handleBtnPress('−', 'operator')} className="calc-op-btn">−</button>

            {/* Row 4 */}
            <button onClick={() => handleBtnPress('1', 'number')} className="calc-num-btn">1</button>
            <button onClick={() => handleBtnPress('2', 'number')} className="calc-num-btn">2</button>
            <button onClick={() => handleBtnPress('3', 'number')} className="calc-num-btn">3</button>
            <button onClick={() => handleBtnPress('+', 'operator')} className="calc-op-btn">+</button>

            {/* Row 5 */}
            <button onClick={() => handleBtnPress('0', 'number')} className="calc-num-btn col-span-2">0</button>
            <button onClick={() => handleBtnPress('.', 'number')} className="calc-num-btn">.</button>
            <button onClick={() => handleBtnPress('=', 'action')} className="calc-eq-btn flex items-center justify-center">
              <CornerDownLeft className="w-4 h-4 text-zinc-950 font-bold" />
            </button>
          </div>

        </div>

        {/* Display Instruction Tips */}
        <div className="bg-zinc-900/60 p-3.5 rounded-lg border border-zinc-800/60 flex items-start space-x-3">
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-[11px] text-zinc-400 font-sans leading-relaxed space-y-1">
            <span className="font-bold text-zinc-200 block">Pro Tips & Shortcuts</span>
            <p>
              Type directly using your keyboard! Supports numbers <kbd className="kbd">0-9</kbd>, operations <kbd className="kbd">+</kbd>, <kbd className="kbd">-</kbd>, <kbd className="kbd">*</kbd>, <kbd className="kbd">/</kbd>, and evaluating with <kbd className="kbd">Enter</kbd> or clearing with <kbd className="kbd">Esc</kbd>.
            </p>
          </div>
        </div>

      </div>

      {/* History Ledger Sidebar */}
      <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-xl p-5 md:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-sans flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            Calculation History
          </h3>
          {history.length > 0 && (
            <button 
              onClick={clearHistory}
              className="text-[10px] font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>

        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1" id="history-items-list">
          {history.length === 0 ? (
            <div className="text-center py-12 text-zinc-400 font-sans text-xs space-y-2">
              <Clock className="w-8 h-8 text-zinc-200 mx-auto" />
              <p>No calculations processed yet.</p>
              <p className="text-[10px] text-zinc-400 leading-normal max-w-[200px] mx-auto">Submit equations in the scientific display to view historical runs.</p>
            </div>
          ) : (
            history.map((item) => (
              <button
                key={item.id}
                onClick={() => selectHistoryItem(item)}
                className="w-full text-left p-3 bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200/50 rounded-lg hover:border-zinc-300 transition-all cursor-pointer group flex flex-col space-y-1"
                title="Click to load result"
              >
                <div className="flex items-center justify-end">
                  <span className="text-[9px] text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase tracking-wider">Recall →</span>
                </div>
                <div className="text-xs font-mono text-zinc-500 break-all line-clamp-1">{item.expression}</div>
                <div className="text-sm font-mono font-bold text-zinc-900 break-all">{item.result}</div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
