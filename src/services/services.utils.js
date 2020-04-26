import { ajax } from 'rxjs/ajax'
import { map, mapTo } from 'rxjs/operators'
import { timer } from 'rxjs'

export const mapResponse = map((ajaxResponse) => ajaxResponse.response)

export const createCrudServices = (baseUrl) => ({
    fetchList : (     ) => ajax.getJSON(baseUrl),
    insert    : (model) => mapResponse(ajax.post(baseUrl, model, { 'Content-Type': 'application/json' })),
    update    : (model) => mapResponse(ajax.put(`${baseUrl}/${model.id}`, model, { 'Content-Type': 'application/json' })),
    delete    : (model) => ajax.delete(`${baseUrl}/${model.id}`)
})

export const mockService = (responseData, delay = 500) => mapTo(responseData)(timer(delay))