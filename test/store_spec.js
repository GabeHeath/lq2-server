/**
 * Created by gabeheath on 5/9/17.
 */
import {Map, fromJS} from 'immutable';
import {expect} from 'chai';

import makeStore from '../src/store';

describe('store', () => {

    it('is a Redux store configured with the correct reducer', () => {
        const store = makeStore();
        expect(store.getState()).to.equal(Map({
            rooms: Map()
        }));

        store.dispatch({
            type: 'CREATE_ROOM',
            roomCode: 'ZZZZ',
            player: Map({
                uuid: 'player-1s-uuid',
                name: 'Player 1'
            })
        });
        expect(store.getState()).to.equal(fromJS({
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
        }));
    });

});