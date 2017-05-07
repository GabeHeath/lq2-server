export function getRoomIndex(state, roomCode) {
    let roomIndex;
    state.get('rooms').forEach( (room, i) => {
        if( room.get('roomCode') === roomCode) {
            roomIndex = i;
        }
    });
    return typeof roomIndex !== 'undefined' ? roomIndex : -1
}