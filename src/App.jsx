import { useState, useCallback, useEffect, useRef } from 'react'

function App() {
  const [length, setLength] = useState(12) // Defaulting to 12 is better for modern security!
  const [numberAllowed, setNumberAllowed] = useState(false)
  const [symbolAllowed, setSymbolAllowed] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [isCopied, setIsCopied] = useState(false) // State for copy animation

  // useRef allows us to reference the input element directly to highlight it
  const passwordRef = useRef(null)

  const passwordGenerator = useCallback(() => {
    let pass = ""
    let str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (numberAllowed) str += "0123456789"
    if (symbolAllowed) str += "!@#$%&*|?/" 

    for (let i = 0; i < length; i++) {
      pass += str.charAt(Math.floor(Math.random() * str.length))
    }
    setGeneratedPassword(pass)
  }, [length, numberAllowed, symbolAllowed])

  const copyPasswordToClipboard = useCallback(() => {
    // Highlights the text inside the input
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, 999); // Mobile optimization
    
    // Copies to clipboard
    window.navigator.clipboard.writeText(generatedPassword);
    
    // Trigger the "Copied!" animation state
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000); // Changes back after 2 seconds
  }, [generatedPassword])

  useEffect(() => { 
    passwordGenerator()
  }, [length, numberAllowed, symbolAllowed, passwordGenerator])

  return (
    // Full screen background wrapper to make it look like a real web app
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4 font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* Main Glassmorphism Card */}
      <div className="w-full max-w-2xl rounded-3xl bg-slate-900 p-8 shadow-2xl shadow-cyan-500/10 border border-slate-800">
        
        {/* Premium Gradient Title inside the card */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 text-center mb-8 pb-6 border-b border-slate-800">
          Password Generator
        </h1>

        {/* Input and Buttons Row */}
        <div className='flex flex-col sm:flex-row items-center gap-3 mb-8'> 
          <div className="flex-1 w-full relative">
            <input
              type="text"
              value={generatedPassword}
              placeholder='Generate password'
              readOnly
              ref={passwordRef}
              // Dark input field with bright cyan text looks very "hacker/tech"
              className="w-full bg-slate-950 border border-slate-700 text-cyan-400 font-mono text-xl p-4 rounded-xl outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </div>

          <button 
            onClick={passwordGenerator} 
            className="w-full sm:w-auto whitespace-nowrap rounded-xl bg-blue-600 px-6 py-4 font-bold text-white transition-all duration-200 hover:bg-blue-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95"
          >
            Generate New
          </button>

          <button 
            onClick={copyPasswordToClipboard} 
            // Dynamically change color if copied
            className={`w-full sm:w-auto whitespace-nowrap rounded-xl px-6 py-4 font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 ${
              isCopied 
                ? "bg-emerald-500 hover:bg-emerald-400 hover:shadow-emerald-500/30" 
                : "bg-cyan-600 hover:bg-cyan-500 hover:shadow-cyan-500/30"
            }`}
          >
            {isCopied ? "Copied! ✓" : "Copy"}
          </button>
        </div> 

        {/* Settings Row */}
        <div className='flex flex-col md:flex-row text-sm items-center justify-between gap-6 bg-slate-950/50 p-6 rounded-2xl border border-slate-800'>
          
          {/* Range Slider Container */}
          <div className='flex items-center gap-4 flex-1 w-full'>
            <input 
              type="range"
              min={8}
              max={20}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full cursor-pointer accent-cyan-500 h-2 bg-slate-700 rounded-lg appearance-none"
            />
            <label className='text-slate-300 font-medium whitespace-nowrap min-w-[80px]'>
              Length: <span className='text-cyan-400 font-bold text-lg ml-1'>{length}</span>
            </label>
          </div>

          {/* Checkboxes Container */}
          <div className='flex items-center gap-6'>
            <div className='flex items-center gap-x-2 group'>
              <input
                type="checkbox"
                checked={numberAllowed}
                id='numbersInput'
                onChange={() => setNumberAllowed((prev) => !prev)}
                className='w-5 h-5 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900 cursor-pointer accent-cyan-500'
              />
              <label htmlFor='numbersInput' className='text-slate-300 group-hover:text-cyan-400 transition-colors font-medium text-base select-none cursor-pointer'>
                Numbers
              </label>
            </div>
            
            <div className='flex items-center gap-x-2 group'>
              <input
                type="checkbox"
                checked={symbolAllowed}
                id='symbolsInput'
                onChange={() => setSymbolAllowed((prev) => !prev)}
                className='w-5 h-5 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900 cursor-pointer accent-cyan-500'
              />
              <label htmlFor='symbolsInput' className='text-slate-300 group-hover:text-cyan-400 transition-colors font-medium text-base select-none cursor-pointer'>
                Symbols
              </label>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default App