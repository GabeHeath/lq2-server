//TODO convert some setIns to updateIn()

import {List, Map} from 'immutable';
import {expect} from 'chai';
import uuid from 'uuid';

import {destroyRoom, leaveRoom, setQuestions, startGame} from '../../dev/core/lobby';
import {createRoom, createUniqueRoomCode, joinRoom} from '../../dev/core/main_menu'

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
            const nextState3 = leaveRoom(nextState2, roomCode, player2.get('uuid'));
            expect(nextState3.getIn(['rooms', roomCode, 'players', 'allPlayers']).size).to.equal(1);
            expect(nextState3.getIn(['rooms', roomCode, 'players', 'allPlayers'])).to.not.have.key( player2.get('uuid') );
        });

        it('destroys the room if all players leave', () => {
            const nextState3 = leaveRoom(nextState2, roomCode, player2.get('uuid'));
            const nextState4 = leaveRoom(nextState3, roomCode, player1.get('uuid'));
            expect(nextState4.get('rooms').size).to.equal(0);
        });

    });



    describe('destroyRoom', () => {
        it('removes the room from rooms', () => {
            const nextState3 = destroyRoom(nextState2, roomCode);
            expect(nextState3.get('rooms').size).to.equal(0);
            expect(nextState3.get('rooms')).to.not.have.key( roomCode );
        });
    });

});