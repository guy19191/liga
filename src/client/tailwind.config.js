module.exports = {
  theme: {
    extend: {
      keyframes: {
        'score-jump': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'float-up': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-20px)', opacity: '0' }
        }
      },
      animation: {
        'score-jump': 'score-jump 0.5s ease-in-out',
        'float-up': 'float-up 1s ease-out forwards'
      }
    }
  }
}