/**
 * throttle wrapper for event listeners
 *
 * @param      {Function}  callback  The function to throttle
 * @return     {Function}    { the throttled function }
 */
const throttle = (callback) => {
  let go = true;
  return e => {
    if (go) {
      go = false;
      requestAnimationFrame(time => {
        go = true;
        callback(e);
      });
    }
  };
};

export default throttle;