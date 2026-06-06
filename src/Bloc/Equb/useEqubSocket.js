// // import { useEffect, useMemo } from 'react';
// // import { io } from 'socket.io-client';

// // export const useEqubSocket = (dispatch) => {
// //   const socket = useMemo(() => {
// //     const token = localStorage.getItem('token');
// //     return io(`${import.meta.env.VITE_API_URL}/equb`, {
// //       auth: { token },
// //       transports: ['polling', 'websocket'],
// //       // transports: ['websocket'],
// //       withCredentials: true, // 👈 Add this line,
// //       reconnection: true,
// //       autoConnect: true
// //     });
// //   }, []);

// //   useEffect(() => {
// //     if (!socket) return;

// //     // ✅ Fix 1: Only emit when we are officially connected
// //     const onConnect = () => {
// //       console.log("🚀 Connected to Equb Namespace");
// //       socket.emit('getInitialStatus');
// //     };

// //     socket.on('connect', onConnect);

// //     socket.on('allRoomsStatus', (list) => {
// //       dispatch({ type: 'SET_ROOMS', payload: list });
// //     });

// //     // 🔵 Update Grid when a slot is bought
// //     socket.on('slotPurchased', (data) => {
// //       dispatch({ type: 'ADD_PARTICIPANT', payload: data });
// //     });

// //     // 🔵 Update Lobby progress bars
// //     socket.on('roomUpdate', (data) => {
// //       dispatch({ type: 'UPDATE_ROOM_COUNT', payload: data });
// //     });

// //     // ✅ Fix 2: Backend calls this 'statusUpdate', not 'drawStarted'
// //     // Inside useEqubSocket.js
// //     socket.on('statusUpdate', (data) => {
// //       console.log("📥 Status Change:", data); // Add this to debug!

// //       if (data.status === 'open') {
// //         // This MUST trigger RESET_ROOM_UI to clear winners and participants
// //         dispatch({ type: 'RESET_ROOM_UI', payload: data });
// //       } else {
// //         // This handles the transition to 'drawing' or 'completed'
// //         dispatch({ type: 'SET_ROOM_STATUS', payload: data });
// //       }
// //     });

// //     // IMPORTANT: Add this if your backend sends 'roomReset' instead
// //     socket.on('roomReset', (data) => {
// //       dispatch({ type: 'RESET_ROOM_UI', payload: data });
// //     });

// //     socket.on('drawResults', (data) => {
// //       dispatch({ type: 'SHOW_WINNERS', payload: data });
// //     });

// //     socket.on('connect_error', (err) => {
// //       console.error('❌ Socket Auth/Conn Error:', err.message);
// //     });

// //     socket.on('error', (msg) => console.error('⚠️ Server Error:', msg));

// //     return () => {
// //       socket.off('connect', onConnect);
// //       socket.off('allRoomsStatus');
// //       socket.off('slotPurchased');
// //       socket.off('roomUpdate');
// //       socket.off('statusUpdate');
// //       socket.off('drawResults');
// //       socket.off('connect_error');
// //       socket.off('error');
// //     };
// //   }, [dispatch, socket]);

// //   return socket;
// // };   


// import { useEffect, useMemo } from 'react';
// import { io } from 'socket.io-client';

// export const useEqubSocket = (dispatch) => {
//   const socket = useMemo(() => {
//     const token = localStorage.getItem('token');

//     return io(`${import.meta.env.VITE_API_URL}/equb`, {
//       auth: { token },
//       transports: ['websocket', 'polling'], // 👈 Move websocket to the front
//       // transports: ['websocket'], // ✅ use websocket only (more stable)
//       withCredentials: true,
//       reconnection: true,
//       autoConnect: true,
//     });
//   }, []);

//   useEffect(() => {
//     if (!socket) return;

//     // ✅ CONNECT
//     const onConnect = () => {
//       console.log("🚀 Connected to Equb Namespace");

//       // 🔥 ALWAYS request lobby on connect
//       socket.emit('getInitialStatus');
//     };

//     // ✅ LOBBY DATA
//     const onRooms = (list) => {
//       console.log("🏠 Rooms received:", list);

//       dispatch({
//         type: 'SET_ROOMS',
//         payload: list || []
//       });
//     };

//     // ✅ SLOT PURCHASE
//     const onSlotPurchased = (data) => {
//       dispatch({ type: 'ADD_PARTICIPANT', payload: data });
//     };

//     // ✅ LOBBY COUNT UPDATE
//     const onRoomUpdate = (data) => {
//       dispatch({ type: 'UPDATE_ROOM_COUNT', payload: data });
//     };

//     // ✅ STATUS UPDATE (drawing / completed / reset)
//     const onStatusUpdate = (data) => {
//       console.log("📥 Status Change:", data);

//       if (data.status === 'open') {
//         dispatch({ type: 'RESET_ROOM_UI', payload: data });
//       } else {
//         dispatch({ type: 'SET_ROOM_STATUS', payload: data });
//       }
//     };

//     // ✅ WINNERS
//     const onResults = (data) => {
//       dispatch({ type: 'SHOW_WINNERS', payload: data });
//     };

//     // ❌ ERRORS
//     const onError = (msg) => {
//       console.error('⚠️ Server Error:', msg);
//     };

//     const onConnectError = (err) => {
//       console.error('❌ Socket Error:', err.message);
//     };

//     // ✅ REGISTER EVENTS (IMPORTANT: define first, then attach)
//     socket.on('connect', onConnect);
//     socket.on('allRoomsStatus', onRooms);
//     socket.on('slotPurchased', onSlotPurchased);
//     socket.on('roomUpdate', onRoomUpdate);
//     socket.on('statusUpdate', onStatusUpdate);
//     socket.on('roomReset', onStatusUpdate); // fallback
//     socket.on('drawResults', onResults);
//     socket.on('error', onError);
//     socket.on('connect_error', onConnectError);

//     // 🧹 CLEANUP
//     return () => {
//       socket.off('connect', onConnect);
//       socket.off('allRoomsStatus', onRooms);
//       socket.off('slotPurchased', onSlotPurchased);
//       socket.off('roomUpdate', onRoomUpdate);
//       socket.off('statusUpdate', onStatusUpdate);
//       socket.off('roomReset', onStatusUpdate);
//       socket.off('drawResults', onResults);
//       socket.off('error', onError);
//       socket.off('connect_error', onConnectError);
//     };
//   }, [socket, dispatch]);

//   return socket;
// };
