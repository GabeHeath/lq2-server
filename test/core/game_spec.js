//TODO convert some setIns to updateIn()

import {List, Map} from 'immutable';
import {expect} from 'chai';
import uuid from 'uuid';

import {createRoom, createUniqueRoomCode, joinRoom} from '../../src/core/main_menu'
import {startGame} from '../../src/core/lobby'
import {increaseScore, nextPlayer, selectQuestion, spliceQuestions, submitGuesses, submitResponse} from '../../src/core/game'

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

    const player3 = Map({
        uuid: uuid.v1(),
        name: 'Player 3',
        score: 0
    });

    const questions = List.of('Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8' );

    const roomCode = createUniqueRoomCode(state.get('rooms'));
    const nextState = createRoom(state, roomCode, player1);
    const nextState2 = joinRoom(nextState, roomCode, player2);

    describe('spliceQuestions', () => {

        const nextState3 = joinRoom(nextState2, roomCode, player3);
        const nextState4 = startGame(nextState3, roomCode, questions);

        it('picks 3 random questions from the questionBank', () => {
            expect(nextState4.getIn(['rooms', roomCode, 'questions', 'activeQuestions']).size).to.equal(3);
            expect(nextState4.getIn(['rooms', roomCode, 'questions', 'questionBank']).size).to.equal(5);
        });

        it('does not share any questions between activeQuestions and questionBank lists', () => {
            expect(nextState4.getIn(['rooms', roomCode, 'questions', 'questionBank'])).to.not.include( nextState4.getIn(['rooms', roomCode, 'questions', 'activeQuestions']).get(0) );
            expect(nextState4.getIn(['rooms', roomCode, 'questions', 'questionBank'])).to.not.include( nextState4.getIn(['rooms', roomCode, 'questions', 'activeQuestions']).get(1) );
            expect(nextState4.getIn(['rooms', roomCode, 'questions', 'questionBank'])).to.not.include( nextState4.getIn(['rooms', roomCode, 'questions', 'activeQuestions']).get(2) );
        });

        it('when less than 3 questions left, picks all that are left', () => {
            const nextState5 = spliceQuestions(nextState4, roomCode);
            const nextState6 = spliceQuestions(nextState5, roomCode);
            expect(nextState6.getIn(['rooms', roomCode, 'questions', 'activeQuestions']).size).to.equal(2);
            expect(nextState6.getIn(['rooms', roomCode, 'questions', 'questionBank']).size).to.equal(0);
        });

    });



    describe('selectQuestion', () => {

        const nextState3 = joinRoom(nextState2, roomCode, player3);
        const nextState4 = startGame(nextState3, roomCode, questions);
        const nextState5 = spliceQuestions(nextState4, roomCode);

        it('eliminates all questions except the one chosen', () => {
            const nextState6 = selectQuestion(nextState5, roomCode, 1);
            expect(nextState6.getIn(['rooms', roomCode, 'questions', 'activeQuestions']).size).to.equal(1);
        });

        it('puts the unselected questions back in the questionBank', () => {
            const selectedQuestionIndex = 1;
            const activeQuestions = nextState5.getIn('rooms', roomCode, 'questions', 'activeQuestions');
            const returningQuestions = nextState5.getIn(['rooms', roomCode, 'questions', 'activeQuestions']).delete(selectedQuestionIndex);
            const nextState6 = selectQuestion(nextState5, roomCode, selectedQuestionIndex);
            expect(nextState6.getIn(['rooms', roomCode, 'questions', 'questionBank'])).to.include(returningQuestions.get(0));
            expect(nextState6.getIn(['rooms', roomCode, 'questions', 'questionBank'])).to.include(returningQuestions.get(1));
            expect(nextState6.getIn(['rooms', roomCode, 'questions', 'activeQuestions'])).to.not.include(returningQuestions.get(0));
            expect(nextState6.getIn(['rooms', roomCode, 'questions', 'activeQuestions'])).to.not.include(returningQuestions.get(1));
        });

    });



    describe('submitResponse', () => {

        it('sets lastResponse to response', () => {
            const nextState3 = submitResponse(state, roomCode, player1);
            expect(nextState3.getIn(['rooms', roomCode, 'players', 'allPlayers', player1.get('uuid'), 'lastResponse'])).to.equal(player1.get('response'));
        });

    });



    describe('nextPlayer', () => {

        const nextState3 = joinRoom(nextState2, roomCode, player3);
        const nextState4 = startGame(nextState3, roomCode, questions);

        it('changes the current player to the next one in line', () => {
            const nextState5 = nextPlayer(nextState4, roomCode);
            expect(nextState5.getIn(['rooms', roomCode, 'players', 'currentPlayer'])).to.equal(2);
        });

        it('wraps back to the first player if current player is the last in line', () => {
            const nextState5 = nextPlayer(nextState4, roomCode);
            const nextState6 = nextPlayer(nextState5, roomCode);
            const nextState7 = nextPlayer(nextState6, roomCode);
            expect(nextState7.getIn(['rooms', roomCode, 'players', 'currentPlayer'])).to.equal(1);
        });

        it('sets 3 new questions to activeQuestions', () => {
            const nextState5 = nextPlayer(nextState4, roomCode);
            expect(nextState5.getIn(['rooms', roomCode, 'questions', 'questionBank'])).to.not.include(nextState4.getIn(['rooms', roomCode, 'questions', 'activeQuestions', 0]));
            expect(nextState5.getIn(['rooms', roomCode, 'questions', 'questionBank'])).to.not.include(nextState4.getIn(['rooms', roomCode, 'questions', 'activeQuestions', 1]));
            expect(nextState5.getIn(['rooms', roomCode, 'questions', 'questionBank'])).to.not.include(nextState4.getIn(['rooms', roomCode, 'questions', 'activeQuestions', 2]));
        });

        it('removes the guesses key', () => {
            const guesses = Map({
                score: 1,
                [`${player2.get('uuid')}`]: true,
                [`${player3.get('uuid')}`]: false
            });
            const nextState5 = submitGuesses(nextState4, roomCode, player1.get('uuid'), guesses);
            expect(nextState5.getIn(['rooms', roomCode])).contains.key('guesses');
            const nextState6 = nextPlayer(nextState5, roomCode);
            expect(nextState6.getIn(['rooms', roomCode])).to.not.have.key('guesses');
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



    describe('submitGuesses', () => {
        const nextState3 = joinRoom(nextState2, roomCode, player3);
        const nextState4 = startGame(nextState3, roomCode, questions);

        it('adds the guesses to state', () => {
            const guesses = Map({
                score: 1,
                [`${player2.get('uuid')}`]: true,
                [`${player3.get('uuid')}`]: false
            });
            const nextState5 = submitGuesses(nextState4, roomCode, player1.get('uuid'), guesses);
            expect(nextState5.getIn(['rooms', roomCode, 'guesses']).size).to.equal(3);
            expect(nextState5.getIn(['rooms', roomCode, 'guesses', player2.get('uuid')])).to.equal(true);
            expect(nextState5.getIn(['rooms', roomCode, 'guesses', player3.get('uuid')])).to.equal(false);
        });

        it('increases the score for the number of correct responses', () => {
            const guesses = Map({
                score: 1,
                [`${player2.get('uuid')}`]: true,
                [`${player3.get('uuid')}`]: false
            });
            const nextState5 = submitGuesses(nextState4, roomCode, player1.get('uuid'), guesses);
            expect(nextState5.getIn(['rooms', roomCode, 'players', 'allPlayers', player1.get('uuid'), 'score'])).to.equal(1);
        });

    });

});