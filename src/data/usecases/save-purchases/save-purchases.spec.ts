import { CacheStore } from '@/data/protocols/cache'
import { LocalSavePurchases } from '@/data/usecases'
import { SavePurchase } from '@/domain'
 
class CacheStoreSpy implements CacheStore {
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

type SutTypes = {
  sut: LocalSavePurchases
  cacheStore: CacheStoreSpy
}

const mockPurchases = (): Array<SavePurchase.Params> => [
  {
    id: '1',
    date: new Date(),
    value: 50,
  },
  {
    id: '2',
    date: new Date(),
    value: 70,
  },
]

const makeSut = (): SutTypes => {
  const cacheStore = new CacheStoreSpy() 
  const sut = new LocalSavePurchases(cacheStore)
  return {
    sut,
    cacheStore
  }
}

describe('LocalSavePurchase', () => {
  test('Should not delete cache on sut.init', () => {
    const { cacheStore } = makeSut()
    expect(cacheStore.deleteCallsCount).toBe(0)
  })

  test('Should delete old cache on sut.save', async() => {
    const { sut, cacheStore } = makeSut()
    await sut.save(mockPurchases())
    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.deletekey).toBe('purchases')
  })

  test('Should not insert new Cache if delete fails', () => {
    const { sut, cacheStore } = makeSut()
    cacheStore.simulateDeleteError()
    const promise = sut.save(mockPurchases())
    expect(cacheStore.insertCallsCount).toBe(0)
    expect(promise).rejects.toThrow()
  })

  test('Should insert new Cache if delete succeeds', async() => {
    const { sut, cacheStore } = makeSut()
    const purchases = mockPurchases()
    await sut.save(purchases)
    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.insertCallsCount).toBe(1)
    expect(cacheStore.insertkey).toBe('purchases')
    expect(cacheStore.insertValues).toEqual(purchases)
  })

  test('Should throw if insert throws', () => {
    const { sut, cacheStore } = makeSut()
    cacheStore.simulateInsertError()
    const promise = sut.save(mockPurchases())
    expect(promise).rejects.toThrow()
  })
})
