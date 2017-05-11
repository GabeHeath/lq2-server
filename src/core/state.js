import {Map} from 'immutable';

export const INITIAL_STATE = Map({
    rooms: Map({
        '1111': Map({
            a: 1,
            b: 1,
            gameInProgress: true
        })
    })
});