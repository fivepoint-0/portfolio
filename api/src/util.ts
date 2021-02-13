import IApiController from "./interfaces/IApiController"
import { IApiError } from "./interfaces/IApiError"
import IApiObject from "./interfaces/IApiObject"
import IApiRequestOptions from "./interfaces/IApiRequestOptions"
import Response from './models/Response'

export function apiResponseIsError(response: IApiObject | IApiObject[] | IApiError | boolean) {
  if (typeof response === 'boolean' && !response) { return true }
  if (Array.isArray(response)) { return false }
  return response.hasOwnProperty('errors')
}

export async function Api<ApiObject extends IApiObject>(controller: IApiController<ApiObject>, apiRequestOptions: IApiRequestOptions): Promise<Response> {

  let baseResponse: Partial<Response> = {
    message: '',
    success: false
  }

  let error: any = {
    errorCode: 0,
    errors: []
  }

  let apiResponse: IApiObject | IApiObject[] | IApiError | boolean = {}

  try {
    switch (apiRequestOptions.method) {
      case 'GET':
        if (apiRequestOptions.data) {
          const { id, ...strippedData } = apiRequestOptions.data
          apiResponse = !!apiRequestOptions.data.id || apiRequestOptions.data.id === 0 ? controller.retrieve(apiRequestOptions.data.id) : controller.retrieveAll(strippedData)
        } else {
          apiResponse = controller.retrieveAll()
        }
        break;
      case 'POST':
        apiResponse = controller.create(apiRequestOptions.data)
        break;
      case 'PUT':
        apiResponse = controller.update(apiRequestOptions.data.id, apiRequestOptions.data)
        break;
      case 'DELETE':
        apiResponse = controller.delete(apiRequestOptions.data.id)
        break;
    }

    baseResponse.success = !apiResponseIsError(apiResponse)

    if (!baseResponse.success) {
      switch (apiRequestOptions.method) {
        case 'GET':
          error.errors.push('Could not retrieve object(s)')
          error.errors.push((apiResponse as IApiError).errors)
          break;
        case 'POST':
          error.errors.push('Could not create object')
          error.errors.push((apiResponse as IApiError).errors)
          break;
        case 'PUT':
          error.errors.push('Could not update object')
          error.errors.push((apiResponse as IApiError).errors)
          break;
        case 'DELETE':
          error.errors.push('Could not delete object')
          error.errors.push()
          break;
      }

      error.errorCode = 404
    }
  } catch (err) {
    error.errors.push(err)
    error.errorCode = 500
    baseResponse.message = 'Internal Server Error'
  }

  const response: Response = error.errorCode === 0 ? { ...baseResponse, data: apiResponse } : { ...baseResponse, ...error }

  return response
}