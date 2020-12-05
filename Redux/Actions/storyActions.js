import {UPDATE_STORY} from '../Constants/storyConstants';

export const storyVisited = (data) =>async dispatch =>{
    dispatch({
        type:UPDATE_STORY,
        payload: data,
    })
}