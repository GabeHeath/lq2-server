//TODO change getIns to updateIn()

import {fromJS, List} from 'immutable'

export function increaseScore(state, roomCode, player) {
    return state.setIn(['rooms', roomCode, 'players','allPlayers', player.get('uuid'), 'score'], parseInt(state.getIn(['rooms', roomCode, 'players', 'allPlayers', player.get('uuid'), 'score'])) + player.get('score'));
}

export function nextPlayer(state, roomCode) {
    const players = state.getIn(['rooms', roomCode, 'players']);
    const nextPlayerState = state.setIn(['rooms', roomCode, 'players', 'currentPlayer'], (players.get('currentPlayer') % players.get('allPlayers').size) + 1 );
    const splicedQuestionState = spliceQuestions(nextPlayerState, roomCode);
    const deletedGuessesState = splicedQuestionState.deleteIn(['rooms', roomCode, 'guesses']);
    let  deletedResponsesState = deletedGuessesState;
    deletedGuessesState.getIn(['rooms', roomCode, 'players', 'allPlayers']).keySeq().forEach( uuid => {
        deletedResponsesState = deletedResponsesState.setIn(['rooms', roomCode, 'players', 'allPlayers', uuid, 'lastResponse'], null);
        deletedResponsesState = deletedResponsesState.setIn(['rooms', roomCode, 'players', 'allPlayers', uuid, 'lastResponseLikes'], 0);
    });
    return deletedResponsesState;
}

export function selectQuestion(state, roomCode, questionIndex) {
    const selectedQuestion = List.of(state.getIn(['rooms', roomCode, 'questions', 'activeQuestions', questionIndex]));
    const returningQuestions = state.getIn(['rooms', roomCode, 'questions', 'activeQuestions']).delete(questionIndex);
    return state.setIn(['rooms', roomCode, 'questions', 'activeQuestions'], selectedQuestion).setIn(['rooms', roomCode, 'questions', 'questionBank'], state.getIn(['rooms', roomCode, 'questions', 'questionBank']).concat(returningQuestions));
}

export function spliceQuestions(state, roomCode) {
    const questionBank = state.getIn(['rooms', roomCode, 'questions', 'questionBank']);
    const activeQuestions = questionBank.splice(3, questionBank.size - 1);
    const splicedQuestionBank = questionBank.splice(0, 3);
    const setActiveQuestions = state.setIn(['rooms', roomCode, 'questions', 'activeQuestions'], activeQuestions);
    return setActiveQuestions.setIn(['rooms', roomCode, 'questions', 'questionBank'], splicedQuestionBank);
}

export function submitGuesses(state, roomCode, currentPlayerUUID, guesses) {
    const updatedScoreState = state.updateIn(['rooms', roomCode, 'players', 'allPlayers', currentPlayerUUID, 'score'], score => score + fromJS(guesses).get('score'));
    return updatedScoreState.setIn(['rooms', roomCode, 'guesses'], guesses);
}

export function submitLike(state, roomCode, uuid) {
    const updatedResponseLikesState = state.updateIn(['rooms', roomCode, 'players', 'allPlayers', uuid, 'lastResponseLikes'], val => val + 1);
    return updatedResponseLikesState.updateIn(['rooms', roomCode, 'players', 'allPlayers', uuid, 'likes'], val => val + 1);
}

export function submitResponse(state, roomCode, player) {
    return state.setIn(['rooms', roomCode, 'players', 'allPlayers', fromJS(player).get('uuid'), 'lastResponse'], fromJS(player).get('response'));
}