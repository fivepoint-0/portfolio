import IApiController from "./interfaces/IApiController";
import PersonApiController from "./controllers/PersonApiController";

const ApiObjects = {
  PERSON: 'person'
}

export default class ApiFactory {
  public static getApiObject(resourceType: string, properties: any): IApiController<any> | null {
    switch (resourceType) {
      case ApiObjects.PERSON:
        return new PersonApiController()
      default:
        return null
    }

    return null
  }
}