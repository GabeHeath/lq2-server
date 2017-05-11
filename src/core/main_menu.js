//TODO change getIns to updateIn()

import {fromJS, Map} from 'immutable';

export function createRoom(state, roomCode, player) {
    const newRoom = state.setIn(['rooms', roomCode], Map({
        gameInProgress: false,
        players: Map({
            currentPlayer: 1,
            allPlayers: Map()
        })
    }));

    return newRoom.setIn(['rooms', roomCode, 'players', 'allPlayers', fromJS(player).get('uuid')],  Map({
        name: fromJS(player).get('name'),
        lastResponse: null,
        score: 0,
        likes: 0
    }))
}

export function joinRoom(state, roomCode, player) {
    const room = state.getIn(['rooms', roomCode]);
    const uuid = state.getIn(['rooms', roomCode, 'players', 'allPlayers', player.get('uuid')]);

    if( room && !uuid ) {
        return state.setIn(['rooms', roomCode, 'players', 'allPlayers', player.get('uuid')], Map({
            name: player.get('name'),
            lastResponse: null,
            score: 0,
            likes: 0
        }));
    }
    return state;
}

export function createUniqueRoomCode(rooms) {
    const roomCode = Math.random().toString(36).substr(2, 4).toUpperCase();
    return rooms.get(roomCode) ? createUniqueRoomCode(rooms) : roomCode;
}


