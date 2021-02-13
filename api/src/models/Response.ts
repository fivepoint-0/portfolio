import IErrorResponse from "../interfaces/IErrorResponse"
import IResponse from "../interfaces/IResponse"
import ISuccessResponse from "../interfaces/ISuccessResponse"

type Response = IResponse & (ISuccessResponse | IErrorResponse)

export default Response