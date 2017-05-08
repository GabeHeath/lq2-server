import {Map} from 'immutable';
import {expect} from 'chai';
import uuid from 'uuid';

describe('game application logic', () => {

    describe('generateQuestions', () => {

        it('picks 3 random questions from the questionBank');

        it('picks 3 unique questions');

        it('when less than 3 questions left, picks all that are left');

    });



    describe('selectQuestion', () => {

        it('eliminates all questions except the one chosen');

    });



    describe('submitResponse', () => {

        it('sets lastResponse to response');

    });



    describe('changePlayer', () => {

        it('changes the current player to the next one in line');

        it('wraps back to the first player if current player is the last in line');
        

    });

});