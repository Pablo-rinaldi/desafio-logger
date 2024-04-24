class CustomError {
  static createError(name, code, message, cause) {
    const error = new Error();
    error.name = name;
    error.code = code;
    error.message = message;
    error.cause = cause;

    return error;
  }
}

module.exports = CustomError;
