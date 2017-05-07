import {List, Map} from 'immutable';

export function leaveRoom(state, roomCode, uuid) {
    //return state.deleteIn(['rooms', roomCode, 'players', 'allPlayers', uuid])
}

export function setQuestions(state, roomCode, questions) {
    return state.setIn(['rooms', roomCode, 'questions'], Map({
        currentQuestion: null,
        questionBank: questions
    }));
}

export function startGame(state, roomCode, questions) {
    if( state.getIn(['rooms', roomCode, 'players', 'allPlayers']).size > 2 ) {
        const newState = state.setIn(['rooms', roomCode, 'gameInProgress'], true);
        return setQuestions(newState, roomCode, questions);
    }
    return state;
}