class ApiResponse {
  static success(data, message = 'Success') {
    return { success: true, message, data };
  }
  static failure(message = 'Failure', data = null) {
    return { success: false, message, data };
  }
}
module.exports = ApiResponse;
