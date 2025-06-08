class TypingTest {
    constructor() {
        this.totalCharsTyped = 0;
        this.totalErrors = 0;
        this.textContent = '';
        this.currentIndex = 0;
        this.errors = 0;
        this.correctChars = 0;
        
        this.textDisplay = document.getElementById('text-content');
        this.typingInput = document.getElementById('typing-input');
        this.charCount = document.getElementById('char-count');
        this.errorCount = document.getElementById('error-count');
        this.accuracy = document.getElementById('accuracy');
        this.resetBtn = document.getElementById('reset-btn');
        
        this.init();
    }
    
    async init() {
        await this.loadText();
        this.setupEventListeners();
        this.renderText();
        this.updateStats();
    }
    
    async loadText() {
        try {
            const response = await fetch('/api/text');
            const data = await response.json();
            this.textContent = data.text;
        } catch (error) {
            console.error('Error loading text:', error);
            this.textContent = 'Error loading text. Please try again.';
        }
    }
    
    renderText() {
        // Split text into individual characters and wrap each in a span
        const chars = this.textContent.split('').map((char, index) => {
            const className = this.getCharClass(index);
            const displayChar = char === ' ' ? '&nbsp;' : char;
            return `<span class="char ${className}" data-index="${index}">${displayChar}</span>`;
        });
        
        this.textDisplay.innerHTML = chars.join('');
    }
    
    getCharClass(index) {
        if (index < this.currentIndex) {
            // Check if this character was typed correctly
            const typedChar = this.typingInput.value[index];
            const expectedChar = this.textContent[index];
            return typedChar === expectedChar ? 'correct' : 'incorrect';
        } else if (index === this.currentIndex) {
            return 'current';
        }
        return '';
    }
    
    setupEventListeners() {
        this.typingInput.addEventListener('input', (e) => this.handleInput(e));
        this.typingInput.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.resetBtn.addEventListener('click', () => this.resetTest());
        
        // Prevent default behavior for certain keys
        this.typingInput.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
            }
        });
    }
    
    handleInput(e) {
        const inputValue = e.target.value;
        const inputLength = inputValue.length;
        

        const prevLength = this.currentIndex;
        
        // Track added characters
        if (inputValue.length > prevLength) {
            const addedChars = inputValue.length - prevLength;
            this.totalCharsTyped += addedChars;
            
            // Check each new character for errors
            for (let i = prevLength; i < inputValue.length; i++) {
                if (inputValue[i] !== this.textContent[i]) {
                    this.totalErrors++;
                }
            }
        }

        // Prevent typing beyond the text length
        if (inputLength > this.textContent.length) {
            e.target.value = inputValue.slice(0, this.textContent.length);
            return;
        }
        
        // Update current index
        this.currentIndex = inputLength;
        
        // Calculate errors and correct characters
        this.calculateStats(inputValue);
        
        // Re-render text with updated highlighting
        this.renderText();
        
        // Update statistics
        this.updateStats();
        
        // Check if test is complete
        if (inputLength === this.textContent.length) {
            this.completeTest();
        }
    }
    
    handleKeydown(e) {
        // Handle backspace functionality
        if (e.key === 'Backspace') {
            // Allow default backspace behavior
            setTimeout(() => {
                this.currentIndex = this.typingInput.value.length;
                this.calculateStats(this.typingInput.value);
                this.renderText();
                this.updateStats();
            }, 0);
        }
    }
    
    calculateStats(inputValue) {
        this.errors = 0;
        this.correctChars = 0;
        
        for (let i = 0; i < inputValue.length; i++) {
            if (inputValue[i] === this.textContent[i]) {
                this.correctChars++;
            } else {
                this.errors++;
            }
        }
    }
    
    updateStats() {
        this.charCount.textContent = this.totalCharsTyped;

        // Update accuracy calculation
        const accuracy = this.totalCharsTyped === 0 ? 100 :
            Math.round(((this.totalCharsTyped - this.totalErrors) / this.totalCharsTyped) * 100);
        
        this.accuracy.textContent = `${accuracy}%`;
        this.errorCount.textContent = this.totalErrors;
    }

    completeTest() {
        // const finalAccuracy = Math.round((this.correctChars / this.textContent.length) * 100);
        alert(`Test Complete!\nAccuracy: ${this.accuracy.textContent}\nErrors: ${this.totalErrors}`);
    }
    
    resetTest() {
        this.totalCharsTyped = 0;
        this.totalErrors = 0;
        this.currentIndex = 0;
        this.errors = 0;
        this.correctChars = 0;
        this.typingInput.value = '';
        this.renderText();
        this.updateStats();
        this.typingInput.focus();
    }
}

// Initialize the typing test when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TypingTest();
});
