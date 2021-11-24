export class ServiceResponseModel {
  constructor(success, error) {
    this.success = success;
    this.error = error;
  }
  success;
  error;
}
