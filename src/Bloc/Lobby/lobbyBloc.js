export const initialLobbyState = {
    rooms: [],
    isConnected: false,
    loading: true,
};

export function lobbyReducer(state, action) {
    switch (action.type) {
        case 'SET_CONNECTED':
            return { ...state, isConnected: action.payload };
        case 'UPDATE_ROOMS':
            // Logic to reverse rooms so newest appear first
            return { 
                ...state, 
                rooms: [...action.payload].reverse(), 
                loading: false 
            };
        case 'TIMER_TICK':
            return {
                ...state,
                rooms: state.rooms.map(room => 
                    room._id === action.payload.roomId 
                        ? { ...room, countdown: action.payload.countdown } 
                        : room
                )
            };
        case 'REMOVE_ROOM':
            return {
                ...state,
                rooms: state.rooms.filter(room => room._id !== action.payload)
            };
        default:
            return state;
    }
}