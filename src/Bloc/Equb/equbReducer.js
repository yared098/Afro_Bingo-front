// export const initialState = {
//   rooms: [],
//   view: 'LIST', 
//   selectedRoom: null,
//   loading: true,
// };

// export function equbReducer(state, action) {
//   switch (action.type) {
//     case 'SET_ROOMS':
//       return { ...state, rooms: action.payload || [], loading: false };

//     case 'SET_LOADING':
//       return { ...state, loading: action.payload };

//     case 'ENTER_ROOM':
//       return { ...state, view: 'ROOM', selectedRoom: action.payload, loading: false };

//     case 'EXIT_ROOM':
//       return { ...state, view: 'LIST', selectedRoom: null };

//     case 'UPDATE_ROOM_COUNT': {
//       return {
//         ...state,
//         rooms: state.rooms.map(r => 
//           r.id === action.payload.id 
//             ? { ...r, participantCount: action.payload.participantCount } 
//             : r
//         )
//       };
//     }

//     case 'ADD_PARTICIPANT': {
//       const { equbId, slotNumber, userId, username } = action.payload;
//       const updatedRooms = state.rooms.map(r => 
//         r.id === equbId ? { ...r, participantCount: (r.participantCount || 0) + 1 } : r
//       );

//       if (state.selectedRoom?.id !== equbId) return { ...state, rooms: updatedRooms };

//       return {
//         ...state,
//         rooms: updatedRooms,
//         selectedRoom: {
//           ...state.selectedRoom,
//           participants: [...(state.selectedRoom.participants || []), { userId, slotNumber, username }]
//         }
//       };
//     }

//     case 'SET_ROOM_STATUS': {
//       const { id, status, expiryTime } = action.payload;
//       const isViewing = state.selectedRoom?.id === id;
//       return {
//         ...state,
//         rooms: state.rooms.map(r => r.id === id ? { ...r, status, expiryTime: expiryTime || r.expiryTime } : r),
//         selectedRoom: isViewing ? { ...state.selectedRoom, status, expiryTime: expiryTime || state.selectedRoom.expiryTime } : state.selectedRoom
//       };
//     }

//     case 'RESET_ROOM_UI': {
//       // Use id or roomId depending on what backend sends
//       const roomId = action.payload.id || action.payload.roomId; 
//       const { expiryTime } = action.payload;

//       const resetRooms = state.rooms.map(r => 
//         r.id === roomId 
//           ? { 
//               ...r, 
//               status: 'open', 
//               participants: [], 
//               participantCount: 0, // 👈 Crucial: Reset the progress bar
//               expiryTime, 
//               winners: null 
//             } 
//           : r
//       );

//       const isViewing = state.selectedRoom?.id === roomId;

//       return {
//         ...state,
//         rooms: resetRooms,
//         selectedRoom: isViewing 
//           ? { 
//               ...state.selectedRoom, 
//               status: 'open', 
//               participants: [], 
//               participantCount: 0, 
//               winners: null, 
//               expiryTime 
//             } 
//           : state.selectedRoom
//       };
//     }

//     case 'SHOW_WINNERS': {
//       const { roomId, results } = action.payload;
//       return {
//         ...state,
//         rooms: state.rooms.map(r => r.id === roomId ? { ...r, status: 'completed', winners: results } : r),
//         selectedRoom: state.selectedRoom?.id === roomId 
//           ? { ...state.selectedRoom, status: 'completed', winners: results } 
//           : state.selectedRoom
//       };
//     }

//     default:
//       return state;
//   }
// }