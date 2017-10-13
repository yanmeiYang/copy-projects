/**
 * 残的.
 */
function authenticateExpertBase(dispatch, id, name, email, perm) {
  console.log('\\\\\\\\\\\\\\\\\\\\\\===============', "HOOKS;;;;;;;;;;;;;");
  dispatch({
    type: 'expertBase/invokeRoster',
    payload: { id, name, email, perm },
  });
}

module.exports = {
  authenticateExpertBase,
};
