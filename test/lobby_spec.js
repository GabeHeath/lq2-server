import {List, Map} from 'immutable';
import {expect} from 'chai';

import {setQuestions, startGame} from '../src/core/lobby';

describe('lobby application logic', () => {

    describe('startGame', () => {

    });

    describe('setQuestions', () => {

        it('adds the questions to the state', () => {
            const state = Map();
            const questions = List.of('Question 1', 'Question 2');
            const nextState = setQuestions(state, questions);
            expect(nextState).to.equal(Map({
                questions: List.of('Question 1', 'Question 2')
            }));
        });

        it('converts to immutable', () => {
            const state = Map();
            const questions = ['Question 1', 'Question 2'];
            const nextState = setQuestions(state, questions);
            expect(nextState).to.equal(Map({
                questions: List.of('Question 1', 'Question 2')
            }));
        });

    });


    //
    // - leave room
    // -destroy room

});