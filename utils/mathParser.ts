/**
 * Robust Mathematical Expression Parser
 * Supports:
 * - Basic operations: +, -, *, /, ^ (power)
 * - Constants: pi, e
 * - Variables: x
 * - Standard functions: sin, cos, tan, sqrt, abs, log (base 10), ln, exp
 * - Implicit multiplication: e.g. 2x, x sin(x), (x+1)(x-2), 3pi
 * - Unary signs: -x, +x
 * - Proper operator precedence and bracket matching
 */

type TokenType = 'NUMBER' | 'VAR' | 'CONST' | 'FUNC' | 'OP' | 'LPAREN' | 'RPAREN' | 'EOF';

interface Token {
  type: TokenType;
  value: string;
}

export class MathParser {
  private tokens: Token[] = [];
  private index = 0;

  constructor(private input: string) {
    this.tokenize();
  }

  private tokenize() {
    const s = this.input.toLowerCase().replace(/\s+/g, '');
    let i = 0;
    const n = s.length;

    while (i < n) {
      const char = s[i];

      // Parentheses
      if (char === '(') {
        this.tokens.push({ type: 'LPAREN', value: '(' });
        i++;
        continue;
      }
      if (char === ')') {
        this.tokens.push({ type: 'RPAREN', value: ')' });
        i++;
        continue;
      }

      // Operators
      if (['+', '-', '*', '/', '^'].includes(char)) {
        this.tokens.push({ type: 'OP', value: char });
        i++;
        continue;
      }

      // Numbers (including decimals)
      if (/[0-9.]/.test(char)) {
        let numStr = '';
        while (i < n && /[0-9.]/.test(s[i])) {
          numStr += s[i];
          i++;
        }
        this.tokens.push({ type: 'NUMBER', value: numStr });
        continue;
      }

      // Alphabetic: variables, constants, functions
      if (/[a-z]/.test(char)) {
        let word = '';
        while (i < n && /[a-z]/.test(s[i])) {
          word += s[i];
          i++;
        }

        if (word === 'x') {
          this.tokens.push({ type: 'VAR', value: 'x' });
        } else if (word === 'pi' || word === 'e') {
          this.tokens.push({ type: 'CONST', value: word });
        } else if (['sin', 'cos', 'tan', 'sqrt', 'abs', 'log', 'ln', 'exp'].includes(word)) {
          this.tokens.push({ type: 'FUNC', value: word });
        } else {
          throw new Error(`Unknown mathematical identifier: "${word}"`);
        }
        continue;
      }

      throw new Error(`Invalid mathematical character: "${char}"`);
    }

    this.tokens.push({ type: 'EOF', value: '' });

    // Handle implicit multiplication: e.g. 2x -> 2 * x, x(y) -> x * (y), (x)(y) -> (x) * (y), 3pi -> 3 * pi
    const processedTokens: Token[] = [];
    for (let j = 0; j < this.tokens.length; j++) {
      const curr = this.tokens[j];
      processedTokens.push(curr);

      if (j < this.tokens.length - 1) {
        const next = this.tokens[j + 1];
        
        // Conditions for implicit multiplication:
        // Current token is: NUMBER, VAR, CONST, RPAREN
        // Next token is: VAR, CONST, FUNC, LPAREN, or NUMBER (only if RPAREN is before NUMBER)
        const isCurrentVal = ['NUMBER', 'VAR', 'CONST', 'RPAREN'].includes(curr.type);
        const isNextValStart = ['VAR', 'CONST', 'FUNC', 'LPAREN'].includes(next.type);

        if (isCurrentVal && isNextValStart) {
          processedTokens.push({ type: 'OP', value: '*' });
        } else if (curr.type === 'RPAREN' && next.type === 'NUMBER') {
          processedTokens.push({ type: 'OP', value: '*' });
        }
      }
    }
    this.tokens = processedTokens;
  }

  private peek(): Token {
    return this.tokens[this.index] || { type: 'EOF', value: '' };
  }

  private consume(expectedType?: TokenType): Token {
    const tok = this.peek();
    if (expectedType && tok.type !== expectedType) {
      throw new Error(`Expected token ${expectedType} but found ${tok.type}`);
    }
    this.index++;
    return tok;
  }

  /**
   * Parse Entry: expression = term { ('+' | '-') term }
   */
  public parseExpression(): (x: number) => number {
    let node = this.parseTerm();

    while (true) {
      const tok = this.peek();
      if (tok.type === 'OP' && (tok.value === '+' || tok.value === '-')) {
        this.consume();
        const right = this.parseTerm();
        const op = tok.value;
        const left = node;
        node = (x: number) => {
          const lVal = left(x);
          const rVal = right(x);
          return op === '+' ? lVal + rVal : lVal - rVal;
        };
      } else {
        break;
      }
    }

    return node;
  }

  /**
   * term = factor { ('*' | '/') factor }
   */
  private parseTerm(): (x: number) => number {
    let node = this.parseFactor();

    while (true) {
      const tok = this.peek();
      if (tok.type === 'OP' && (tok.value === '*' || tok.value === '/')) {
        this.consume();
        const right = this.parseFactor();
        const op = tok.value;
        const left = node;
        node = (x: number) => {
          const lVal = left(x);
          const rVal = right(x);
          if (op === '/') {
            if (rVal === 0) return NaN; // Gracefully handle divide-by-zero
            return lVal / rVal;
          }
          return lVal * rVal;
        };
      } else {
        break;
      }
    }

    return node;
  }

  /**
   * factor = unary { '^' unary }
   */
  private parseFactor(): (x: number) => number {
    let node = this.parseUnary();

    const tok = this.peek();
    if (tok.type === 'OP' && tok.value === '^') {
      this.consume();
      const right = this.parseFactor(); // Right-associative power
      const left = node;
      node = (x: number) => Math.pow(left(x), right(x));
    }

    return node;
  }

  /**
   * unary = [ '+' | '-' ] primary
   */
  private parseUnary(): (x: number) => number {
    const tok = this.peek();
    if (tok.type === 'OP' && (tok.value === '+' || tok.value === '-')) {
      this.consume();
      const op = tok.value;
      const operand = this.parsePrimary();
      return (x: number) => (op === '-' ? -operand(x) : operand(x));
    }
    return this.parsePrimary();
  }

  /**
   * primary = NUMBER | VAR | CONST | FUNC '(' expression ')' | '(' expression ')'
   */
  private parsePrimary(): (x: number) => number {
    const tok = this.peek();

    if (tok.type === 'NUMBER') {
      this.consume();
      const val = parseFloat(tok.value);
      return () => val;
    }

    if (tok.type === 'VAR') {
      this.consume();
      return (x: number) => x;
    }

    if (tok.type === 'CONST') {
      this.consume();
      if (tok.value === 'pi') {
        return () => Math.PI;
      } else {
        return () => Math.E;
      }
    }

    if (tok.type === 'FUNC') {
      this.consume();
      this.consume('LPAREN');
      const argExpr = this.parseExpression();
      this.consume('RPAREN');
      const funcName = tok.value;

      return (x: number) => {
        const arg = argExpr(x);
        if (isNaN(arg)) return NaN;
        switch (funcName) {
          case 'sin': return Math.sin(arg);
          case 'cos': return Math.cos(arg);
          case 'tan': return Math.tan(arg);
          case 'sqrt': return arg >= 0 ? Math.sqrt(arg) : NaN;
          case 'abs': return Math.abs(arg);
          case 'log': return arg > 0 ? Math.log10(arg) : NaN;
          case 'ln': return arg > 0 ? Math.log(arg) : NaN;
          case 'exp': return Math.exp(arg);
          default: return NaN;
        }
      };
    }

    if (tok.type === 'LPAREN') {
      this.consume();
      const expr = this.parseExpression();
      this.consume('RPAREN');
      return expr;
    }

    throw new Error(`Unexpected token at column: "${tok.value || 'EOF'}"`);
  }

  public static compile(expressionStr: string): (x: number) => number {
    if (!expressionStr || expressionStr.trim() === '') {
      throw new Error('Expression string cannot be empty.');
    }
    const parser = new MathParser(expressionStr);
    const compiled = parser.parseExpression();
    if (parser.peek().type !== 'EOF') {
      throw new Error('Extra trailing tokens or malformed parentheses in expression.');
    }
    return compiled;
  }
}
