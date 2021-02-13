import HttpMethod from "../models/HttpMethod";

export default interface IApiRequestOptions {
  method: HttpMethod,
  data: any
}