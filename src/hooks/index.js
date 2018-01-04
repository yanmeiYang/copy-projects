/**
 * 残的. TODO lalalalaal
 */
function authenticateExpertBase(dispatch, id, name, email, perm) {
  console.log('\\\\\\\\\\\\\\\\\\\\\\===============', "HOOKS;;;;;;;;;;;;;");
  dispatch({
    type: 'expertBase/invokeRoster',
    payload: { id, name, email, perm },
  });
}

export { authenticateExpertBase };
