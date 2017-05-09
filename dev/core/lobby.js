import {List, Map} from 'immutable';

export function destroyRoom(state, roomCode) {
    return state.deleteIn(['rooms', roomCode]);
}

export function leaveRoom(state, roomCode, uuid) {
    const newState =  state.deleteIn(['rooms', roomCode, 'players', 'allPlayers', uuid]);
    return newState.getIn(['rooms', roomCode, 'players', 'allPlayers']).size === 0 ? destroyRoom(newState, roomCode) : newState;
}

export function setQuestions(state, roomCode, questions) {
    return state.setIn(['rooms', roomCode, 'questions'], Map({
        activeQuestions: List(),
        questionBank: questions.sortBy(Math.random)
    }));
}

export function startGame(state, roomCode, questions) {
    if( state.getIn(['rooms', roomCode, 'players', 'allPlayers']).size > 2 ) {
        const newState = state.setIn(['rooms', roomCode, 'gameInProgress'], true);
        return setQuestions(newState, roomCode, questions);
    }
    return state;
}