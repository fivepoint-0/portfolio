import IApiController from "../interfaces/IApiController";
import IApiObject from "../interfaces/IApiObject";
import fs from 'fs'
import { IApiError } from "../interfaces/IApiError";

export default class FileApiController<T extends IApiObject> implements IApiController<T> {
  public fileName: string = 'db.json'
  private data: T[] = []
  
  constructor(fileName = 'db.json') {
    this.fileName = fileName
    this.data = JSON.parse(fs.readFileSync(this.fileName).toString())

    if (!this.data) {
      throw new Error('Couldnt read database')
    }
  }

  saveData(){
    this.data = this.data.filter(o => o !== null)
    fs.writeFileSync(this.fileName, JSON.stringify(this.data, null, 2))
  }

  create(data: T): T | IApiError {
    let id = 0

    if (this.data.length > 0) {
      id = 1 + (this.data[this.data.length - 1].id as number)
    }

    this.data.push(Object.assign(data, { id }))

    this.saveData()

    return Object.assign(data, { id })
  }

  retrieve(id: number): T | IApiError {
    let element = this.data.find((element: T) => element.id === id)
    return !!element ? element : { errors: ['Element does not exist'] }
  }

  retrieveAll(data?: any): T[] | IApiError {
    if (Object.keys(data).length > 0) {
      return this.data.filter((element: T) => {
        for (let key in element) {
          if (data[key] === element[key]) {
            return element
          }
        }
      })
    }
    return this.data ? this.data : { errors: ['Elements do not exist. Try editing your filter.'] }
  }

  update(id: number, data: any): T | IApiError {
    let element = this.retrieve(id)

    if (element.hasOwnProperty('errors')) { return element }

    const index = this.data.indexOf(element as T)
    this.data[index] = { ...element, ...data }
    this.saveData()
    return { ...element, ...data }
  }
  
  delete(id: number): boolean | IApiError {
    let element = this.retrieve(id)

    if (element.hasOwnProperty('errors')) { return element as IApiError }

    if (!!element) {
      const index = this.data.indexOf(element as T)
      delete this.data[index]
      this.saveData()
      return true
    }

    return false
  }

}