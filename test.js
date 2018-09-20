/* eslint-env mocha */

const assert = require('assert')
const storage = require('./')

describe('@wext/storage', () => {
  afterEach(async () => {
    await storage.local.clear()
    await storage.sync.clear()
  })

  it('stores a value', async () => {
    await storage.local.set({ foo: 'bar' })
    const { foo } = await storage.local.get('foo')

    assert.strictEqual(foo, 'bar')
  })

  it('removes a value', async () => {
    await storage.local.set({ removeMe: 'bar' })
    await storage.local.remove('removeMe')
    const { removeMe } = await storage.local.get('removeMe')

    assert.strictEqual(removeMe, undefined)
  })

  it('gives all values', async () => {
    await storage.local.set({ key1: 'foo' })
    await storage.local.set({ key2: 'bar' })
    const result = await storage.local.get(null)

    assert.deepStrictEqual(result, { key1: 'foo', key2: 'bar' })
  })

  it('removes multiple values', async () => {
    await storage.local.set({ key1: 'foo' })
    await storage.local.set({ key2: 'bar' })
    await storage.local.set({ key3: 'baz' })
    await storage.local.set({ key4: 'qux' })
    await storage.local.set({ key5: 'quux' })
    await storage.local.set({ key6: 'corge' })

    await storage.local.remove(['key1', 'key2', 'key4', 'key6'])

    assert.strictEqual((await storage.local.get('key1')).key1, undefined)
    assert.strictEqual((await storage.local.get('key2')).key2, undefined)
    assert.strictEqual((await storage.local.get('key3')).key3, 'baz')
    assert.strictEqual((await storage.local.get('key4')).key4, undefined)
    assert.strictEqual((await storage.local.get('key5')).key5, 'quux')
    assert.strictEqual((await storage.local.get('key6')).key6, undefined)
  })

  it('clears the store', async () => {
    await storage.local.set({ key1: 'foobar' })
    await storage.sync.set({ key2: 'foobar' })

    await storage.local.clear()

    assert.strictEqual((await storage.local.get('key1')).key1, undefined)
    assert.strictEqual((await storage.sync.get('key2')).key2, 'foobar')

    await storage.local.set({ key1: 'foobar' })
    await storage.sync.set({ key2: 'foobar' })

    await storage.sync.clear()

    assert.strictEqual((await storage.local.get('key1')).key1, 'foobar')
    assert.strictEqual((await storage.sync.get('key2')).key2, undefined)
  })

  it('emits changed events', async () => {
    const events = []

    storage.onChanged.addListener((diff, area) => {
      events.push({ diff, area })
    })

    await storage.local.set({ key1: 'foobar' })
    await new Promise(resolve => setTimeout(resolve, 20))

    assert.strictEqual(events[0].area, 'local')
    assert.strictEqual(events[0].diff.key1.oldValue, undefined)
    assert.strictEqual(events[0].diff.key1.newValue, 'foobar')

    await storage.sync.set({ key2: 'foobar' })
    await new Promise(resolve => setTimeout(resolve, 20))

    assert.strictEqual(events[1].area, 'sync')
    assert.strictEqual(events[1].diff.key2.oldValue, undefined)
    assert.strictEqual(events[1].diff.key2.newValue, 'foobar')

    await storage.local.remove('key1')
    await new Promise(resolve => setTimeout(resolve, 20))

    assert.strictEqual(events[2].area, 'local')
    assert.strictEqual(events[2].diff.key1.oldValue, 'foobar')
    assert.strictEqual(events[2].diff.key1.newValue, undefined)

    await storage.sync.clear()
    await new Promise(resolve => setTimeout(resolve, 20))

    assert.strictEqual(events[3].area, 'sync')
    assert.strictEqual(events[3].diff.key2.oldValue, 'foobar')
    assert.strictEqual(events[3].diff.key2.newValue, undefined)
  })
})
