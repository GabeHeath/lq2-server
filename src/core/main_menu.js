import {List, Map} from 'immutable';
import {getRoomIndex} from './state'

export function createRoom(state, player) {
    return state.set('rooms', state.get('rooms').push(Map({
            roomCode: createUniqueRoomCode(state.get('rooms')),
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
        })))
}

export function joinRoom(state, roomCode, player) {
    const roomIndex = getRoomIndex(state, roomCode);

    if( roomIndex >= 0 ) {
        const allPlayers = state.getIn(['rooms', roomIndex, 'players', 'allPlayers']);
        let playerAlreadyExists = false;
        allPlayers.forEach( (aPlayer) => {
            if(aPlayer.get('uuid') === player.get('uuid')) {
                playerAlreadyExists = true;
            }
        });

        if(!playerAlreadyExists) {
            const newPlayers = state.getIn(['rooms', roomIndex, 'players', 'allPlayers']).push(
                Map({
                    uuid: player.get('uuid'),
                    name: player.get('name'),
                    lastResponse: null,
                    score: 0,
                    likes: 0
                })
            );

            return state.setIn(['rooms', roomIndex, 'players', 'allPlayers'], newPlayers);
        }
    }
    return state;
}

export function createUniqueRoomCode(rooms) {
    let unique;

    do {
        unique = true;
        const roomCode = Math.random().toString(36).substr(2, 4).toUpperCase();

        rooms.forEach( (room) => {
            if( room.get('roomCode') === roomCode ) {
                unique = false
            }
        });

        if(unique) {
            return roomCode;
        }

    } while (unique === false);
}


