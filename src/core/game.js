import {List} from 'immutable'

export function increaseScore(state, roomCode, player) {
    return state.setIn(['rooms', roomCode, 'players','allPlayers', player.get('uuid'), 'score'], parseInt(state.getIn(['rooms', roomCode, 'players', 'allPlayers', player.get('uuid'), 'score'])) + player.get('score'));
}

export function nextPlayer(state, roomCode) {
    const players = state.getIn(['rooms', roomCode, 'players']);
    return state.setIn(['rooms', roomCode, 'players', 'currentPlayer'], (players.get('currentPlayer') % players.get('allPlayers').size) + 1 );
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

export function submitResponse(state, roomCode, player) {
    return state.setIn(['rooms', roomCode, 'players', 'allPlayers', player.get('uuid'), 'lastResponse'], player.get('response'));
}