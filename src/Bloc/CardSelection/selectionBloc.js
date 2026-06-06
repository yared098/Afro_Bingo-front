export const initialSelectionState = {
    reservedCards: [],
    mySelectedCards: [],
    timeLeft: null,
    roomData: null,
    loading: true
};

export function selectionReducer(state, action) {
    switch (action.type) {
        case 'SYNC_ROOM_DATA':
            return {
                ...state,
                roomData: action.payload.room,
                timeLeft: action.payload.room.countdown,
                reservedCards: action.payload.reservedIds,
                mySelectedCards: action.payload.mine,
                loading: false
            };
        case 'TIMER_TICK':
            return { ...state, timeLeft: action.payload };
        case 'RESERVE_SUCCESS':
            return {
                ...state,
                reservedCards: [...new Set([...state.reservedCards, action.payload.cardId])],
                mySelectedCards: action.payload.isMine 
                    ? [...new Set([...state.mySelectedCards, action.payload.cardId])] 
                    : state.mySelectedCards
            };
        default:
            return state;
    }
}