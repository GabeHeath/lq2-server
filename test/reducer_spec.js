import {fromJS, Map} from 'immutable';
import {expect} from 'chai';
import reducer from '../dev/reducers'

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

    it('handles CREATE_ROOM', () => {
        const action = {type: 'CREATE_ROOM', roomCode: roomCode, player: player1};
        const nextState = reducer(initialState, action);
        expect(nextState).to.equal(fromJS({
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
        const createRoomAction = {type: 'CREATE_ROOM', roomCode: roomCode, player: player1};
        const nextState = reducer(initialState, createRoomAction);
        const joinRoomAction = {type: 'JOIN_ROOM', roomCode: roomCode, player: player2};
        const nextState2 = reducer(nextState, joinRoomAction);
        expect(nextState2).to.equal(fromJS({
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

    it('handles START_GAME');

    it('handles LEAVE_ROOM');

    it('handles SPLICE_QUESTIONS');

    it('handles SELECT_QUESTION');

    it('handles SUBMIT_RESPONSE');

    it('handles SUBMIT_LIKE');

    it('handles SUBMIT_GUESS');



});