import {INITIAL_STATE} from './core/state'
import {createRoom, joinRoom} from './core/main_menu';

export default function reducer(state = INITIAL_STATE, action) {

    switch (action.type) {
        case 'CREATE_ROOM':
            return createRoom(state, action.roomCode, action.player);
            break;
        case 'JOIN_ROOM':
            return joinRoom(state, action.roomCode, action.player);
            break;
        default:
            return state;
    }

}