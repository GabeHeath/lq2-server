import {List, Map} from 'immutable';

export function createRoom(state, roomCode, player) {
    return state.setIn(['rooms', roomCode], Map({
            gameInProgress: false,
            players: Map({
                currentPlayer: 1,
                allPlayers: List.of(
                    Map({
                        uuid: player.get('uuid'),
                        name: player.get('name'),
                        lastResponse: null,
                        score: 0,
                        likes: 0
                    })
                )
            }),
            questions: List()
        }))
}

export function joinRoom(state, roomCode, player) {
    const room = state.getIn(['rooms', roomCode]);

    if( room ) {
        const allPlayers = room.getIn(['players', 'allPlayers']);
        let playerAlreadyExists = false;
        allPlayers.forEach( (aPlayer) => {
            if(aPlayer.get('uuid') === player.get('uuid')) {
                playerAlreadyExists = true;
            }
        });

        if(!playerAlreadyExists) {
            const newPlayers = state.getIn(['rooms', roomCode, 'players', 'allPlayers']).push(
                Map({
                    uuid: player.get('uuid'),
                    name: player.get('name'),
                    lastResponse: null,
                    score: 0,
                    likes: 0
                })
            );
            return state.setIn(['rooms', roomCode, 'players', 'allPlayers'], newPlayers);
        }
    }
    return state;
}

export function createUniqueRoomCode(rooms) {
    const roomCode = Math.random().toString(36).substr(2, 4).toUpperCase();
    return rooms.get(roomCode) ? createUniqueRoomCode(rooms) : roomCode;
}


