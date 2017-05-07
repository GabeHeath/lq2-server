import {List, Map} from 'immutable';
import {expect} from 'chai';
import uuid from 'uuid';

import {createRoom, createUniqueRoomCode, joinRoom, setQuestions} from '../src/core/main_menu';

describe('main menu application logic', () => {

    describe('createRoom', () => {

        it('creates a new room', () => {
            const state = Map({
                rooms: List()
            });

            const player = Map({
                uuid: uuid.v1(),
                name: 'Test Name'
            });

            const nextState = createRoom(state, player);
            expect(nextState.get('rooms').size).to.equal(1);
            expect(nextState.get('rooms').last().get('roomCode').length).to.equal(4);
        });

        it('can handle a lot of rooms at once', () => {
            let state = Map({
                rooms: List()
            });

            const player = Map({
                uuid: uuid.v1(),
                name: 'Test Name'
            });

            for(let i=0; i<3500; i++) {
                state = createRoom(state, player);
            }
            expect(state.get('rooms').size).to.equal(3500);
        });

        it('has a unique room code', () => {
            let roomCodes = [];
            let uniqueRoomCodes = true;
            let state = Map({
                rooms: List()
            });

            const player = Map({
                uuid: uuid.v1(),
                name: 'Test Name'
            });

            for(let i=0; i<3500; i++) {
                state = createRoom(state, player);
                const code = createUniqueRoomCode(state.get('rooms'));

                if( roomCodes.includes(code)) {
                    uniqueRoomCodes = false;
                }
            }

            expect(uniqueRoomCodes).to.equal(true);
        });

        it('adds the initial player to the lobby', () => {
            const state = Map({
                rooms: List()
            });

            const player = Map({
                uuid: uuid.v1(),
                name: 'Test Name'
            });

            const nextState = createRoom(state, player);
            expect(nextState.get('rooms').last().getIn(['players','allPlayers']).first().get('uuid')).to.be.a('string');
            expect(nextState.get('rooms').last().getIn(['players','allPlayers']).first().get('name')).to.be.a('string');
            expect(nextState.get('rooms').last().getIn(['players','allPlayers']).size).to.equal(1);
        });

        it('creates a socket.io room');

    });



    describe('joinRoom', () => {

        it('finds the room matching the roomCode', () => {
            const state = Map({
                rooms: List()
            });

            const player1 = Map({
                uuid: uuid.v1(),
                name: 'Player One'
            });

            const player2 = Map({
                uuid: uuid.v1(),
                name: 'Player Two'
            });

            const nextState = createRoom(state, player1);
            const state1RoomCode = nextState.getIn(['rooms', 0, 'roomCode']);
            const nextState2 = joinRoom(nextState, nextState.get('rooms').first().get('roomCode'), player2);
            const state2RoomCode = nextState2.getIn(['rooms', 0, 'roomCode']);
            expect(state1RoomCode).to.equal(state2RoomCode);
        });

        it('adds player to allPlayers for that room', () => {
            const state = Map({
                rooms: List()
            });

            const player1 = Map({
                uuid: uuid.v1(),
                name: 'Player One'
            });

            const player2 = Map({
                uuid: uuid.v1(),
                name: 'Player Two'
            });

            const nextState = createRoom(state, player1);
            const nextState2 = joinRoom(nextState, nextState.get('rooms').first().get('roomCode'), player2);
            expect(nextState2.getIn(['rooms', 0, 'players', 'allPlayers', 1, 'name'])).to.equal(player2.get('name'));
        });

        it('does nothing if the roomCode is not found', () => {
            const state = Map({
                rooms: List()
            });

            const player1 = Map({
                uuid: uuid.v1(),
                name: 'Player One'
            });

            const player2 = Map({
                uuid: uuid.v1(),
                name: 'Player Two'
            });

            const nextState = createRoom(state, player1);
            const nextState2 = joinRoom(nextState, 'ROOMCODE', player2);
            expect(nextState2).to.equal(nextState);
        });

        it('does nothing if uuid already exists in the room', () => {
            const state = Map({
                rooms: List()
            });

            const player = Map({
                uuid: uuid.v1(),
                name: 'Player One'
            });

            const nextState = createRoom(state, player);
            const nextState2 = joinRoom(nextState, nextState.get('rooms').first().get('roomCode'), player);
            expect(nextState2).to.equal(nextState);
        });

        it('joins the socket.io room');

    });

});