import { SavePurchase } from "@/domain/usecases"
import { CacheStore } from "@/data/protocols/cache"

export class CacheStoreSpy implements CacheStore {
  actions: Array<CacheStoreSpy.Action> = []
  deletekey: string 
  insertkey: string 

  insertValues: Array<SavePurchase.Params> = []
  
  delete(key: string) {
    this.actions.push(CacheStoreSpy.Action.delete)
    this.deletekey = key
  }

  insert(key: string, value: any) {
    this.actions.push(CacheStoreSpy.Action.insert)
    this.insertkey = key
    this.insertValues = value
  }

  replace(key: string, value: any) {
    this.delete(key)
    this.insert(key, value)
  }

  simulateDeleteError (): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => { 
      this.actions.push(CacheStoreSpy.Action.delete)
      throw new Error()
    })
  }
  simulateInsertError (): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => { 
      this.actions.push(CacheStoreSpy.Action.insert)
      throw new Error()
    })
  }
  
}

export namespace CacheStoreSpy {
  export enum Action {
    delete,
    insert
  }
}