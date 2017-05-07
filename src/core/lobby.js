import {List} from 'immutable';

export function startGame(state, roomCode) {

}

export function setQuestions(state, questions) {
    return state.set('questions', List(questions));
}