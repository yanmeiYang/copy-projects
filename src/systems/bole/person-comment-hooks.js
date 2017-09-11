/**
 * Created by zhanglimin on 17/09/07.
 */
/**
 *
 * @param dispatch or put
 */
function createComment(param) {
  const { dispatch, persons } = param;
  dispatch({
    type: 'personComments/getTobProfileList',
    payload: { persons },
  });
}

module.exports = {
  createComment,
};
