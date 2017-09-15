


export const progressUpdate = (position) =>{
    return {
        type: PROGRESS_UPDATE,
        payload: position
    }
}
export const stopPlayBack = () =>{
    return{
        type: STOP_PLAYBACK
    }
}


