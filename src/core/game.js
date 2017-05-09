export function increaseScore(state, roomCode, player) {
    return state.setIn(['rooms', roomCode, 'players','allPlayers', player.get('uuid'), 'score'], parseInt(state.getIn(['rooms', roomCode, 'players', 'allPlayers', player.get('uuid'), 'score'])) + player.get('score'));
}

export function nextPlayer(state, roomCode) {
    const players = state.getIn(['rooms', roomCode, 'players']);
    return state.setIn(['rooms', roomCode, 'players', 'currentPlayer'], (players.get('currentPlayer') % players.get('allPlayers').size) + 1 );
}

export function submitResponse(state, roomCode, player) {
    return state.setIn(['rooms', roomCode, 'players', 'allPlayers', player.get('uuid'), 'lastResponse'], player.get('response'));
}