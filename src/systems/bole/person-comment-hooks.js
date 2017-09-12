/**
 * Created by zhanglimin on 17/09/07.
 */
/**
 *
 * @param dispatch or put
 */
function GetComments({ param }) {
  const { dispatch, persons } = param;
  if (typeof dispatch === 'function') {
    dispatch({
      type: 'personComments/getTobProfileList',
      payload: { persons },
    });
  }
}

module.exports = {
  GetComments,
};
