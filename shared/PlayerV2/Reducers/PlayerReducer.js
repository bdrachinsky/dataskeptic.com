import Immutable from 'immutable';

const init = {
    is_playing: false,
    has_shown: false,
    playback_loaded: false,
    position: 0,
    position_updated: false,
}

const defaultState = Immutable.fromJS(init);

export default function PlayerReducer(state = defaultState, action) {
   switch (action.type){

   }

}