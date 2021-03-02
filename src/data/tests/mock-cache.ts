import { SavePurchase } from "@/domain/usecases"
import { CacheStore } from "@/data/protocols/cache"

export class CacheStoreSpy implements CacheStore {
  messages: Array<CacheStoreSpy.Message> = []
  deletekey: string 
  insertkey: string 

  insertValues: Array<SavePurchase.Params> = []
  
  delete(key: string) {
    this.messages.push(CacheStoreSpy.Message.delete)
    this.deletekey = key
  }

  insert(key: string, value: any) {
    this.messages.push(CacheStoreSpy.Message.insert)
    this.insertkey = key
    this.insertValues = value
  }

  simulateDeleteError (): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => { 
      this.messages.push(CacheStoreSpy.Message.delete)
      throw new Error()
    })
  }
  simulateInsertError (): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => { 
      this.messages.push(CacheStoreSpy.Message.insert)
      throw new Error()
    })
  }
  
}

export namespace CacheStoreSpy {
  export enum Message {
    delete,
    insert
  }
}