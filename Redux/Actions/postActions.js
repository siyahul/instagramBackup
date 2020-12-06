import {
  UPDATE_POSTS,
  LIST_POSTS_REQUESTS,
  LIST_POSTS_SUCCESS,
  LIST_POSTS_FAIL,
} from "../Constants/postConstants";

export const postUpdate = (data) => async (dispatch) => {
  dispatch({
    type: UPDATE_POSTS,
    payload: data,
  });
};

export const fetchPosts = ({getNews}) => async (dispatch) => {
    dispatch({
      type:LIST_POSTS_SUCCESS,
      payload: getNews,
    })
};
