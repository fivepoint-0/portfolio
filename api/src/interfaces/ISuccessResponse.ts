import IApiObject from "./IApiObject";

export default interface ISuccessResponse {
  data: IApiObject | Array<IApiObject>
}