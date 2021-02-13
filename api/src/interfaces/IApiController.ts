import { IApiError } from "./IApiError";
import IApiObject from "./IApiObject"

export default interface IApiController<ApiObject extends IApiObject> {
  create(data: any): ApiObject | IApiError
  retrieve(id: number): ApiObject | IApiError
  retrieveAll(data?: any): ApiObject[] | IApiError
  update(id: number, data: any): ApiObject | IApiError
  delete(id: number): boolean | IApiError
}