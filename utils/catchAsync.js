module.exports = fn => {
  // createComplaint is expecting a function, not the result of a function.
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
