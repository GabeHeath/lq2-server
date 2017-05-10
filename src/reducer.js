import {INITIAL_STATE} from './core/state'
import {createRoom, joinRoom} from './core/main_menu';
import {leaveRoom, startGame} from './core/lobby';
import {nextPlayer, selectQuestion, submitResponse} from './core/game';
import {allQuestions} from '../allQuestions';

export default function reducer(state = INITIAL_STATE, action) {

    switch (action.type) {
        case 'CREATE_ROOM':
            return createRoom(state, action.roomCode, action.player);
            break;
        case 'JOIN_ROOM':
            return joinRoom(state, action.roomCode, action.player);
            break;
        case 'LEAVE_ROOM':
            return leaveRoom(state, action.roomCode, action.player.get('uuid'));
            break;
        case 'NEXT_PLAYER':
            return nextPlayer(state, action.roomCode);
            break;
        case 'SELECT_QUESTION':
            return selectQuestion(state, action.roomCode, action.questionIndex);
            break;
        case 'START_GAME':
            return startGame(state, action.roomCode, allQuestions);
            break;
        case 'SUBMIT_RESPONSE':
            return submitResponse(state, action.roomCode, action.player);
            break;
        default:
            return state;
    }

}