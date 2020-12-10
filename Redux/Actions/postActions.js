import {
  UPDATE_POSTS,
  LIST_POSTS_SUCCESS
} from "../Constants/postConstants";

export const postUpdate = (data) => async (dispatch) => {
  dispatch({
    type: UPDATE_POSTS,
    payload: data,
  });
};

export const fetchPosts = (posts) => async (dispatch, getState) => {
  const newValue = posts.map((post) => {
    const {
      userSignIn: { userInfo },
    } = getState();
    const liked = post.likes.find((like) => like.userId === userInfo?.id);
    const likes = post.likes.map((like) => like.userId);

    if (liked) {
      return { ...post, liked: true, likes };
    } else {
      return { ...post, liked: false, likes };
    }
  });
  console.log(newValue);
  dispatch({
    type: LIST_POSTS_SUCCESS,
    payload: newValue,
  });
};
