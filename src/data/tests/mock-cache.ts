import { SavePurchase } from "@/domain/usecases"
import { CacheStore } from "@/data/protocols/cache"

export class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0
  insertCallsCount = 0
  deletekey: string 
  insertkey: string 

  insertValues: Array<SavePurchase.Params> = []
  
  delete(key: string) {
    this.deletekey = key
    this.deleteCallsCount++
  }

  insert(key: string, value: any) {
    this.insertCallsCount++
    this.insertkey = key
    this.insertValues = value
  }

  simulateDeleteError (): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => { throw new Error()})
  }
  simulateInsertError (): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => { throw new Error()})
  }
  
}