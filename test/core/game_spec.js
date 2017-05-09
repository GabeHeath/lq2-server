import {Map} from 'immutable';
import {expect} from 'chai';
import uuid from 'uuid';

import {increaseScore, nextPlayer, submitResponse} from '../../src/core/game'
import {createRoom, createUniqueRoomCode, joinRoom} from '../../src/core/main_menu'

describe('game application logic', () => {

    const state = Map({
        rooms: Map()
    });

    const player1 = Map({
        uuid: uuid.v1(),
        name: 'Player 1',
        score: 10,
        response: "This is the player's response"
    });

    const player2 = Map({
        uuid: uuid.v1(),
        name: 'Player 2',
        score: 0
    });

    const roomCode = createUniqueRoomCode(state.get('rooms'));
    const nextState = createRoom(state, roomCode, player1);
    const nextState2 = joinRoom(nextState, roomCode, player2);

    describe('generateQuestions', () => {

        it('picks 3 random questions from the questionBank');

        it('picks 3 unique questions');

        it('when less than 3 questions left, picks all that are left');

    });



    describe('selectQuestion', () => {

        it('eliminates all questions except the one chosen');

    });



    describe('submitResponse', () => {

        it('sets lastResponse to response', () => {
            const nextState3 = submitResponse(state, roomCode, player1);
            expect(nextState3.getIn(['rooms', roomCode, 'players', 'allPlayers', player1.get('uuid'), 'lastResponse'])).to.equal(player1.get('response'));
        });

    });



    describe('changePlayer', () => {

        it('changes the current player to the next one in line', () => {
            const nextState3 = nextPlayer(nextState2, roomCode);
            expect(nextState3.getIn(['rooms', roomCode, 'players', 'currentPlayer'])).to.equal(2);
        });

        it('wraps back to the first player if current player is the last in line', () => {
            const nextState3 = nextPlayer(nextState2, roomCode);
            const nextState4 = nextPlayer(nextState3, roomCode);
            expect(nextState4.getIn(['rooms', roomCode, 'players', 'currentPlayer'])).to.equal(1);
        });

    });



    describe('increaseScore', () => {

        it('increases the score of a player', () => {
            const nextState3 = increaseScore(nextState2, roomCode, player1);
            const nextState4 = increaseScore(nextState3, roomCode, player1);
            expect(nextState4.getIn(['rooms', roomCode, 'players', 'allPlayers', player1.get('uuid'), 'score'])).to.equal(20);
        });

    });



    describe('increaseLikes', () => {

        it('increases the likes for a player');

    });

});