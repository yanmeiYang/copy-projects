/**
 * Created by zhanglimin on 17/09/07.
 */
export function GetComments({ param }) {
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


/**
 * Created by bogao on 2017-11-03.
 */
export function FetchPersonLabels({ param }) {
  const { dispatch, persons, expertBaseId } = param;
  if (!persons || persons.length === 0) {
    return;
  }
  if (typeof dispatch === 'function') {
    dispatch({
      type: 'commonLabels/fetchPersonLabels',
      payload: { ids: persons.map(person => person && person.id) },
    });
  }
}
