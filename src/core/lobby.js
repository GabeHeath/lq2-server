import {List} from 'immutable';
import {getRoomIndex} from './state'

export function startGame(state, roomCode) {

}

export function setQuestions(state, questions) {
    return state.set('questions', List(questions));
}