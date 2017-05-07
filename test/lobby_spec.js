import {List, Map} from 'immutable';
import {expect} from 'chai';
import uuid from 'uuid';

import {setQuestions, startGame} from '../src/core/lobby';
import {createRoom, createUniqueRoomCode, joinRoom} from '../src/core/main_menu'

describe('lobby application logic', () => {

    const state = Map({
        rooms: Map()
    });

    const player1 = Map({
        uuid: uuid.v1(),
        name: 'Player 1'
    });

    const player2 = Map({
        uuid: uuid.v1(),
        name: 'Player 2'
    });

    const player3 = Map({
        uuid: uuid.v1(),
        name: 'Player 3'
    });

    const questions = List.of('Question 1', 'Question 2');

    const roomCode = createUniqueRoomCode(state.get('rooms'));
    const nextState = createRoom(state, roomCode, player1);
    const nextState2 = joinRoom(nextState, roomCode, player2);


    describe('startGame', () => {

        it('sets gameInProgress to true', () => {
            const nextState3 = joinRoom(nextState2, roomCode, player3);
            const nextState4 = startGame(nextState3, roomCode, questions);
            expect(nextState4.getIn(['rooms', roomCode, 'gameInProgress'])).to.equal(true);
        });

        it('fails to start if less than 3 players', () => {
            const nextState3 = startGame(nextState2, roomCode);
            expect(nextState3).to.equal(nextState2);
        });

    });

    describe('setQuestions', () => {

        it('adds the questions to the state', () => {
            const nextState3 = joinRoom(nextState2, roomCode, player3);
            const nextState4 = startGame(nextState3, roomCode, questions);
            expect(nextState4.getIn(['rooms', roomCode, 'questions', 'questionBank']).size).to.equal(2);
        });

    });



    describe('leaveRoom', () => {

        it('removes player from list of players in room', () => {

        });

    });



    describe('destroyRoom', () => {

    });


    //
    // - leave room
    // -destroy room

});