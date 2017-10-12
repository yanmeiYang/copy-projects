/**
 * Created by zhanglimin on 17/09/07.
 */
/**
 *
 * @param dispatch or put
 */
function GetComments({ param }) {
  const { dispatch, persons, expertBaseId } = param;
  if (expertBaseId === 'aminer') {
    return;
  }
  if (!persons || persons.length === 0) {
    return;
  }
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
