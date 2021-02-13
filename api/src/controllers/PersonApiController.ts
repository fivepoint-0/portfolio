import { IApiError } from "../interfaces/IApiError";
import Person from "../models/Person";
import FileApiController from "./FileApiController";

export default class PersonApiController extends FileApiController<Person> {
  constructor() {
    super('Person-db.json')
  }

  create(data: Person) {
    if (data.name) {

      const element = this.retrieveAll({ name: data.name })

      if (Array.isArray(element)) {
        return element.length > 0 ? { errors: ['Elements with that name already exist.'] } : super.create(data)
      }
    }
    return { errors: ['The name was not specified for the Person.'] } as IApiError
  }
}

