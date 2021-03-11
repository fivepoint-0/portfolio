import express, { response } from 'express'
import dotenv from 'dotenv'
import bp from 'body-parser'
import ApiFactory from './factory'
import IApiRequestOptions from './interfaces/IApiRequestOptions'
import { Api } from './util'
import HttpMethod from './models/HttpMethod'
import Response from './models/Response'
setTimeout(() => {
  console.log("====================================")
  console.log("||||||||||||API  WORKING||||||||||||")
  console.log("====================================")
}, 5000)
dotenv.config()

const app = express()

app.post('*', bp.json())
app.put('*', bp.json())
app.delete('*', bp.json())

app.use('*/:resource/(:id|)', async (req, res) => {

  const converted: IApiRequestOptions = {
    method: req.method as HttpMethod,
    data: ['GET', 'DELETE'].includes(req.method) ? { ...req.params, ...req.query, parentResource: null, parentResourceId: null } : { ...req.body, ...req.params, parentResource: null, parentResourceId: null },
  }
  
  if (converted.data.hasOwnProperty('id')) {
    converted.data.id = Number(converted.data.id)
  }
  
  if (converted['data']['0']) {
    const splitUri = converted['data']['0'].split('/')

    if (splitUri.length > 0) {
      converted['data']['parentResourceId'] = splitUri[splitUri.length - 1]
      converted['data']['parentResource'] = splitUri[splitUri.length - 2]
    }
  }

  delete converted['data']['0']

  let { parentResource, parentResourceId, resource, ...dataArguments } = converted.data

  console.log('Parent Resource Data: ', { parentResource, parentResourceId, resource })

  if (parentResource) {
    console.log('Parent Resource TRUE...')

    const parentController = ApiFactory.getApiObject(parentResource, { id: Number(parentResourceId) })

    if (parentController) {
      console.log('Parent Controller TRUE...')

      let childKeyReferenceToParentKey = parentResource + 'Id'

      console.log('Child Reference Key:', childKeyReferenceToParentKey)

      const getParentResponse = await Api(parentController, { method: 'GET', data: { id: Number(parentResourceId) }})
      
      console.log('THIS IS THE BIG BOI', getParentResponse)

      if (!getParentResponse.success) {
        res.status(400)
        res.send(getParentResponse)
      }

      // res.send(getParentResponse)
    }
  }

  console.log('Moving on from Parent...')

  const controller = ApiFactory.getApiObject(resource, dataArguments)

  if (controller) {
    const response = await Api(controller, { method: converted.method, data: dataArguments })
    
    res.send(response)
  } else {
    res.sendStatus(404)
  }
})

app.listen(3000, () => {console.log("listening on PORT 3000")})
