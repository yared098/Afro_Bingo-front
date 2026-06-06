

// Initial state for the game
export const initialBingoState = {
    cards: [],           // Now an array to support multiple cards
    activeCardIndex: 0,  // Which card the user is currently looking at
    drawnNumbers: [],
    lastNumber: null,
    connected: false,
    activeTab: 'card',
    winnerModal: { show: false, winnerId: '', winnerName: '', prize: 0 },
    errorMessage: '',
};

// Reducer handling all "Events"
export function bingoReducer(state, action) {
    switch (action.type) {
        case 'SET_CONNECTED':
            return { ...state, connected: action.payload };
            
        case 'INIT_CARD':
            return { 
                ...state, 
                // If payload is an array, use it; if single card, wrap it in an array
                cards: Array.isArray(action.payload) ? action.payload : [action.payload],
                loading: false 
            };

        case 'SET_ACTIVE_CARD':
            return { 
                ...state, 
                activeCardIndex: action.payload 
            };

        case 'UPDATE_GAME_STATUS':
            return { 
                ...state, 
                drawnNumbers: action.payload.drawnNumbers || state.drawnNumbers,
                lastNumber: action.payload.lastNumber || state.lastNumber 
            };

        case 'NUMBER_DRAWN':
            return { 
                ...state, 
                lastNumber: action.payload.number,
                drawnNumbers: action.payload.history 
            };

        case 'ANNOUNCE_WINNER':
            return { 
                ...state, 
                winnerModal: { 
                    show: true, 
                    winnerId: action.payload.winnerId,
                    winnerName: action.payload.winnerName, 
                    prize: action.payload.prize,
                    pattern: action.payload.pattern
                } 
            };

        case 'SET_ERROR':
            return { ...state, errorMessage: action.payload };

        case 'SWITCH_TAB':
            return { ...state, activeTab: action.payload };

        default:
            return state;
    }
}