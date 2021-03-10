import { LocalLoadPurchases } from '@/data/usecases'
import { mockPurchases, CacheStoreSpy, getCacheExpirationDate } from '@/data/tests'


type SutTypes = {
  sut: LocalLoadPurchases
  cacheStore: CacheStoreSpy
}

const makeSut = (timestamp = new Date()): SutTypes => {
  const cacheStore = new CacheStoreSpy() 
  const sut = new LocalLoadPurchases(cacheStore, timestamp)
  return {
    sut,
    cacheStore
  }
}

describe('LocalSavePurchase', () => {
  test('Should not delete or insert cache on sut.init', () => {
    const { cacheStore } = makeSut()
    expect(cacheStore.actions).toEqual([])
  })

  test('Should delete cache if load fails',  () => {
    const { sut, cacheStore } = makeSut()
    cacheStore.simulateFetchError()
    sut.validate()
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete])
    expect(cacheStore.deletekey).toEqual('purchases')
  })

  test('Should has no side effect load success', () => {
    const currentDate = new Date()
    const timestamp = getCacheExpirationDate(currentDate)
    timestamp.setSeconds(timestamp.getSeconds() + 1)

    const { sut, cacheStore } = makeSut(currentDate)
    cacheStore.fetchResult = { timestamp }
    sut.validate()
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
    expect(cacheStore.fetchKey).toBe('purchases')
  })

  test('Should delete cache if its expired', async () => {
    const currentDate = new Date()
    const timestamp = getCacheExpirationDate(currentDate)
    timestamp.setSeconds(timestamp.getSeconds() - 1)

    const { sut, cacheStore } = makeSut(currentDate)
    cacheStore.fetchResult = { timestamp }
    sut.validate()
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete])
    expect(cacheStore.fetchKey).toBe('purchases')
    expect(cacheStore.deletekey).toBe('purchases')
  })

  test('Should delete cache if its on expiration date', () => {
    const currentDate = new Date()
    const timestamp = getCacheExpirationDate(currentDate)

    const { sut, cacheStore } = makeSut(currentDate)
    cacheStore.fetchResult = { timestamp }
    sut.validate()
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete])
    expect(cacheStore.fetchKey).toBe('purchases')
    expect(cacheStore.deletekey).toBe('purchases')
  })

})