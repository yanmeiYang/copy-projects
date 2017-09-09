/**
 * Created by zhanglimin on 17/09/07.
 */
/**
 *
 * @param dispatch or put
 */
function createRoster(dispatch, id, name, email, perm) {
  dispatch({
    type: 'expertBase/invokeRoster',
    payload: { id, name, email, perm },
  });
}

module.exports = {
  createRoster,
};
