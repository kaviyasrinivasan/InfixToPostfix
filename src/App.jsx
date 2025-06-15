import { useState } from 'react';
import './App.css';

function App() {
    const [infixExp, setInfixExp] = useState('');
    const [currentStep, setCurrentStep] = useState(0);
    const [steps, setSteps] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInputInvalid, setIsInputInvalid] = useState(false);

    const getPrecedence = (operator) => {
        switch (operator) {
            case '+': case '-': return 1;
            case '*': case '/': return 2;
            case '^': return 3;
            default: return 0;
        }
    };

    const isOperator = (char) => ['+', '-', '*', '/', '^'].includes(char);

    const startConversion = () => {
        if (!infixExp.trim()) {
            setIsInputInvalid(true);
            setTimeout(() => setIsInputInvalid(false), 500);
            return;
        }

        setIsLoading(true);
        setCurrentStep(0);
        const newSteps = [];
        let stack = [];
        let output = '';

        for (let i = 0; i < infixExp.length; i++) {
            let char = infixExp[i];
            let explanation = '';

            if (isOperator(char)) {
                while (stack.length > 0 && getPrecedence(stack[stack.length - 1]) >= getPrecedence(char)) {
                    output += stack.pop();
                    explanation = `Operator '${char}' has lower or equal precedence than stack top. Popping stack.`;
                }
                stack.push(char);
                explanation = explanation || `Pushing operator '${char}' to stack.`;
            } else if (char === '(') {
                stack.push(char);
                explanation = "Pushing opening parenthesis to stack.";
            } else if (char === ')') {
                while (stack.length > 0 && stack[stack.length - 1] !== '(') {
                    output += stack.pop();
                }
                if (stack.length > 0 && stack[stack.length - 1] === '(') {
                    stack.pop();
                }
                explanation = "Processing closing parenthesis, popping operators until matching '('.";
            } else {
                output += char;
                explanation = `Adding operand '${char}' directly to output.`;
            }

            newSteps.push({ stack: [...stack], output, explanation });
        }

        while (stack.length > 0) {
            output += stack.pop();
            newSteps.push({ stack: [...stack], output, explanation: "Popping remaining operators from stack." });
        }

        setSteps(newSteps);
        setIsLoading(false);
        showStep(0);
    };

    const showStep = (stepIndex) => {
        if (stepIndex < 0 || stepIndex >= steps.length) return;
        setCurrentStep(stepIndex);
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            showStep(currentStep + 1);
        }
    };

    const previousStep = () => {
        if (currentStep > 0) {
            showStep(currentStep - 1);
        }
    };

    return (
        <div className="main">
            <div className="box">
                <h1 className="title">Infix to Postfix Converter</h1>

                <div className="input-box">
                    <input
                        type="text"
                        value={infixExp}
                        onChange={(e) => setInfixExp(e.target.value)}
                        placeholder="Enter the infix expression (e.g., A+B*C)"
                        className={`input ${isInputInvalid ? 'invalid' : ''}`}
                    />
                    <button onClick={startConversion} className="btn">
                        Convert
                        {isLoading && <span className="loader"></span>}
                    </button>
                </div>

                <div className="viz">
                    <div className="col">
                        <h3>Stack</h3>
                        <div className="content">
                            {steps[currentStep]?.stack.map((item, index) => (
                                <span key={index} className="chip">{item}</span>
                            ))}
                        </div>
                    </div>
                    <div className="col">
                        <h3>Output</h3>
                        <div className="content">
                            {steps[currentStep]?.output.split('').map((item, index) => (
                                <span key={index} className="chip">{item}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="btn-group">
                    <button onClick={previousStep} className="btn">Previous</button>
                    <button onClick={nextStep} className="btn">Next</button>
                </div>

                <div className="explain">
                    <h3>{steps[currentStep]?.explanation || 'Enter an infix expression to see the conversion steps.'}</h3>
                </div>

            </div>
        </div>
    );
}

export default App;