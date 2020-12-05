import {
  LIST_STORY_REQUESTS,
  LIST_STORY_SUCCESS,
  UPDATE_STORY,
} from "../Constants/storyConstants";

export const storiesReducer = (state = {}, action) => {
  switch (action.type) {
    case LIST_STORY_REQUESTS:
      return { ...state, loading: true };
    case LIST_STORY_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case UPDATE_STORY:
      return { ...state, loading: false, data: action.payload };
    default:
      return { ...state };
  }
};
