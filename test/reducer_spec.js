import {fromJS, Map} from 'immutable';
import {expect} from 'chai';
import reducer from '../src/reducer'

describe('main menu reducer', () => {

    const initialState = Map({
        rooms: Map()
    });

    const roomCode = "ZZZZ";

    const player1 = Map({
        uuid: 'player-1s-uuid',
        name: 'Player 1'
    });

    const player2 = Map({
        uuid: 'player-2s-uuid',
        name: 'Player 2'
    });

    const player3 = Map({
        uuid: 'player-3s-uuid',
        name: 'Player 3'
    });

    const player4 = Map({
        uuid: 'player-4s-uuid',
        name: 'Player 4',
        response: "Player 4's response"
    });

    const createRoomAction = {type: 'CREATE_ROOM', roomCode: roomCode, player: player1};
    const createRoomState = reducer(initialState, createRoomAction);

    const player2JoinRoomAction = {type: 'JOIN_ROOM', roomCode: roomCode, player: player2};
    const player2JoinRoomState = reducer(createRoomState, player2JoinRoomAction);

    const player3JoinRoomAction = {type: 'JOIN_ROOM', roomCode: roomCode, player: player3};
    const player3JoinRoomState = reducer(player2JoinRoomState, player3JoinRoomAction);

    const startGameAction = {type: 'START_GAME', roomCode: roomCode};
    const startGameState = reducer(player3JoinRoomState, startGameAction);

    const player4JoinRoomAction = {type: 'JOIN_ROOM', roomCode: roomCode, player: player4};
    const player4JoinRoomState = reducer(startGameState, player4JoinRoomAction);

    it('handles CREATE_ROOM', () => {
        expect(createRoomState).to.equal(fromJS({
            rooms: {
                ZZZZ: {
                    gameInProgress: false,
                    players: {
                        currentPlayer: 1,
                        allPlayers: {
                            'player-1s-uuid': {
                                name: 'Player 1',
                                lastResponse: null,
                                score: 0,
                                likes: 0
                            }
                        }
                    }
                }
            }
        }))
    });

    it('handles JOIN_ROOM', () => {
        expect(player2JoinRoomState).to.equal(fromJS({
            rooms: {
                ZZZZ: {
                    gameInProgress: false,
                    players: {
                        currentPlayer: 1,
                        allPlayers: {
                            'player-1s-uuid': {
                                name: 'Player 1',
                                lastResponse: null,
                                score: 0,
                                likes: 0
                            },
                            'player-2s-uuid': {
                                name: 'Player 2',
                                lastResponse: null,
                                score: 0,
                                likes: 0
                            }
                        }
                    }
                }
            }
        }))
    });

    it('handles START_GAME', () => {
        expect(startGameState.get('rooms')).to.have.key('ZZZZ');
        expect(startGameState.getIn(['rooms', 'ZZZZ', 'gameInProgress'])).to.equal(true);
        expect(startGameState.getIn(['rooms', 'ZZZZ', 'players', 'currentPlayer'])).to.equal(1);
        expect(startGameState.getIn(['rooms', 'ZZZZ', 'players', 'allPlayers']).size).to.equal(3);
        expect(startGameState.getIn(['rooms', 'ZZZZ', 'questions', 'activeQuestions']).size).to.equal(3);
        expect(startGameState.getIn(['rooms', 'ZZZZ', 'questions', 'questionBank']).size).to.equal(5);
    });

    it('handles LEAVE_ROOM', () => {
        const player4LeaveRoomAction = {type: 'LEAVE_ROOM', roomCode: roomCode, player: player4};
        const player4LeaveRoomState = reducer(player4JoinRoomState, player4LeaveRoomAction);
        expect(player4LeaveRoomState.get('rooms')).to.have.key('ZZZZ');
        expect(player4LeaveRoomState.getIn(['rooms', 'ZZZZ', 'gameInProgress'])).to.equal(true);
        expect(player4LeaveRoomState.getIn(['rooms', 'ZZZZ', 'players', 'currentPlayer'])).to.equal(1);
        expect(player4LeaveRoomState.getIn(['rooms', 'ZZZZ', 'players', 'allPlayers']).size).to.equal(3);
        expect(player4LeaveRoomState.getIn(['rooms', 'ZZZZ', 'questions', 'activeQuestions']).size).to.equal(3);
        expect(player4LeaveRoomState.getIn(['rooms', 'ZZZZ', 'questions', 'questionBank']).size).to.equal(5);
    });

    it('handles NEXT_PLAYER', () => {
        const nextPlayerAction = {type: 'NEXT_PLAYER', roomCode: roomCode};
        const nextPlayerState = reducer(player4JoinRoomState, nextPlayerAction);
        expect(nextPlayerState.get('rooms')).to.have.key('ZZZZ');
        expect(nextPlayerState.getIn(['rooms', 'ZZZZ', 'gameInProgress'])).to.equal(true);
        expect(nextPlayerState.getIn(['rooms', 'ZZZZ', 'players', 'currentPlayer'])).to.equal(2);
        expect(nextPlayerState.getIn(['rooms', 'ZZZZ', 'players', 'allPlayers']).size).to.equal(4);
        expect(nextPlayerState.getIn(['rooms', 'ZZZZ', 'questions', 'activeQuestions']).size).to.equal(3);
        expect(nextPlayerState.getIn(['rooms', 'ZZZZ', 'questions', 'questionBank']).size).to.equal(2);
    });

    it('handles SELECT_QUESTION', () => {
        const selectQuestionAction = {type: 'SELECT_QUESTION', roomCode: roomCode, questionIndex: 1};
        const selectQuestionState = reducer(player4JoinRoomState, selectQuestionAction);
        expect(selectQuestionState.get('rooms')).to.have.key('ZZZZ');
        expect(selectQuestionState.getIn(['rooms', 'ZZZZ', 'gameInProgress'])).to.equal(true);
        expect(selectQuestionState.getIn(['rooms', 'ZZZZ', 'players', 'currentPlayer'])).to.equal(1);
        expect(selectQuestionState.getIn(['rooms', 'ZZZZ', 'players', 'allPlayers']).size).to.equal(4);
        expect(selectQuestionState.getIn(['rooms', 'ZZZZ', 'questions', 'activeQuestions']).size).to.equal(1);
        expect(selectQuestionState.getIn(['rooms', 'ZZZZ', 'questions', 'questionBank']).size).to.equal(7);
    });

    it('handles SUBMIT_GUESSES', () => {
        const guesses = Map({
            score: 1,
            [`${player2.get('uuid')}`]: true,
            [`${player3.get('uuid')}`]: false
        });
        const submitGuessesAction = {type: 'SUBMIT_GUESSES', roomCode: roomCode, currentPlayerUUID: player4.get('uuid'), guesses};
        const submitGuessesState = reducer(player4JoinRoomState, submitGuessesAction);
        expect(submitGuessesState.get('rooms')).to.have.key('ZZZZ');
        expect(submitGuessesState.getIn(['rooms', 'ZZZZ', 'gameInProgress'])).to.equal(true);
        expect(submitGuessesState.getIn(['rooms', 'ZZZZ', 'players', 'currentPlayer'])).to.equal(1);
        expect(submitGuessesState.getIn(['rooms', 'ZZZZ', 'players', 'allPlayers']).size).to.equal(4);
        expect(submitGuessesState.getIn(['rooms', 'ZZZZ', 'questions', 'activeQuestions']).size).to.equal(3);
        expect(submitGuessesState.getIn(['rooms', 'ZZZZ', 'questions', 'questionBank']).size).to.equal(5);
        expect(submitGuessesState.getIn(['rooms', 'ZZZZ', 'guesses']).size).to.equal(3);
        expect(submitGuessesState.getIn(['rooms', 'ZZZZ', 'guesses', player2.get('uuid')])).to.equal(true);
        expect(submitGuessesState.getIn(['rooms', 'ZZZZ', 'guesses', player3.get('uuid')])).to.equal(false);
    });

    it('handles SUBMIT_RESPONSE', () => {
        const submitResponseAction = {type: 'SUBMIT_RESPONSE', roomCode: roomCode, player: player4};
        const submitResponseState = reducer(player4JoinRoomState, submitResponseAction);
        expect(submitResponseState.get('rooms')).to.have.key('ZZZZ');
        expect(submitResponseState.getIn(['rooms', 'ZZZZ', 'gameInProgress'])).to.equal(true);
        expect(submitResponseState.getIn(['rooms', 'ZZZZ', 'players', 'currentPlayer'])).to.equal(1);
        expect(submitResponseState.getIn(['rooms', 'ZZZZ', 'players', 'allPlayers']).size).to.equal(4);
        expect(submitResponseState.getIn(['rooms', 'ZZZZ', 'players', 'allPlayers','player-4s-uuid', 'lastResponse'])).to.equal("Player 4's response");
        expect(submitResponseState.getIn(['rooms', 'ZZZZ', 'questions', 'activeQuestions']).size).to.equal(3);
        expect(submitResponseState.getIn(['rooms', 'ZZZZ', 'questions', 'questionBank']).size).to.equal(5);
    });

    it('handles SUBMIT_LIKE');



});