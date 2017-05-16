//TODO convert some setIns to updateIn()

import {Map} from 'immutable';
import {expect} from 'chai';
import uuid from 'uuid';

import {createRoom, createUniqueRoomCode, joinRoom, setQuestions} from '../../src/core/main_menu';

describe('main menu application logic', () => {

    describe('createRoom', () => {

        it('creates a new room', () => {
            const state = Map({
                rooms: Map()
            });

            const player = Map({
                uuid: uuid.v1(),
                name: 'Test Name'
            });

            const roomCode = createUniqueRoomCode(state.get('rooms'));
            const nextState = createRoom(state, roomCode, player);
            expect(nextState.get('rooms').size).to.equal(1);
            expect(nextState.get('rooms')).to.have.key(roomCode);
        });

        it('can handle a lot of rooms at once', () => {
            let state = Map({
                rooms: Map()
            });

            const player = Map({
                uuid: uuid.v1(),
                name: 'Test Name'
            });

            for(let i=0; i<5000; i++) {
                const roomCode = createUniqueRoomCode(state.get('rooms'));
                state = createRoom(state, roomCode, player);
            }
            expect(state.get('rooms').size).to.equal(5000);
        });

        it('adds the initial player to the lobby', () => {
            const state = Map({
                rooms: Map()
            });

            const player = Map({
                uuid: uuid.v1(),
                name: 'Test Name'
            });

            const roomCode = createUniqueRoomCode(state.get('rooms'));
            const nextState = createRoom(state, roomCode, player);
            expect(nextState.getIn(['rooms', roomCode, 'players','allPlayers'])).to.have.key(player.get('uuid'));
            expect(nextState.getIn(['rooms', roomCode, 'players','allPlayers', player.get('uuid'), 'name'])).to.equal(player.get('name'));
            expect(nextState.getIn(['rooms', roomCode, 'players','allPlayers']).size).to.equal(1);
        });

    });



    describe('createUniqueRoomCode', () => {

        it('creates a unique room code', () => {
            let roomCodes = [];
            let uniqueRoomCodes = true;
            let state = Map({
                rooms: Map()
            });

            const player = Map({
                uuid: uuid.v1(),
                name: 'Test Name'
            });

            for(let i=0; i<5000; i++) {
                const roomCode = createUniqueRoomCode(state.get('rooms'));
                state = createRoom(state, roomCode, player);

                if( roomCodes.includes(roomCode)) {
                    uniqueRoomCodes = false;
                }
                roomCodes.push(roomCode);
            }

            expect(uniqueRoomCodes).to.equal(true);
        });

    });



    describe('joinRoom', () => {

        it('adds player to allPlayers for that room', () => {
            const state = Map({
                rooms: Map()
            });

            const player1 = Map({
                uuid: uuid.v1(),
                name: 'Player One'
            });

            const player2 = Map({
                uuid: uuid.v1(),
                name: 'Player Two'
            });

            const roomCode = createUniqueRoomCode(state.get('rooms'));
            const nextState = createRoom(state, roomCode, player1);
            const nextState2 = joinRoom(nextState, roomCode, player2);
            expect(nextState2.getIn(['rooms', roomCode, 'players', 'allPlayers']).size).to.equal(2);
            expect(nextState2.getIn(['rooms', roomCode, 'players', 'allPlayers', player2.get('uuid'), 'name'])).to.equal(player2.get('name'));
        });

        it('does nothing if the roomCode is not found', () => {
            const state = Map({
                rooms: Map()
            });

            const player1 = Map({
                uuid: uuid.v1(),
                name: 'Player One'
            });

            const player2 = Map({
                uuid: uuid.v1(),
                name: 'Player Two'
            });

            const roomCode = createUniqueRoomCode(state.get('rooms'));
            const nextState = createRoom(state, roomCode, player1);
            const nextState2 = joinRoom(nextState, 'ROOMCODE', player2);
            expect(nextState2).to.equal(nextState);
        });

        it('does nothing if uuid already exists in the room', () => {
            const state = Map({
                rooms: Map()
            });

            const player = Map({
                uuid: uuid.v1(),
                name: 'Player One'
            });

            const roomCode = createUniqueRoomCode(state.get('rooms'));
            const nextState = createRoom(state, roomCode, player);
            const nextState2 = joinRoom(nextState, roomCode, player);
            expect(nextState2).to.equal(nextState);
        });

        it('does nothing if name already exists in the room');

    });

});