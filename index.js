/* globals browser chrome */

const kUpstream = Symbol('upstream')

const hasBrowserGlobal = (typeof browser === 'object')
const hasChromeGlobal = (typeof chrome === 'object')

function promisifyChromeCall (call) {
  return new Promise((resolve, reject) => {
    call((result) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
      } else {
        resolve(result)
      }
    })
  })
}

class BrowserStorageArea {
  constructor (name) { this[kUpstream] = browser.storage[name] }
  get (key) { return this[kUpstream].get(key) }
  set (items) { return this[kUpstream].set(items) }
  remove (key) { return this[kUpstream].remove(key) }
  clear () { return this[kUpstream].clear() }
}

class ChromeStorageArea {
  constructor (name) { this[kUpstream] = chrome.storage[name] }
  get (key) { return promisifyChromeCall(cb => this[kUpstream].get(key, cb)) }
  set (items) { return promisifyChromeCall(cb => this[kUpstream].set(items, cb)) }
  remove (key) { return promisifyChromeCall(cb => this[kUpstream].remove(key, cb)) }
  clear () { return promisifyChromeCall(cb => this[kUpstream].clear(cb)) }
}

if (hasBrowserGlobal) {
  exports.local = new BrowserStorageArea('local')
  exports.managed = new BrowserStorageArea('managed')
  exports.sync = new BrowserStorageArea('sync')
  exports.onChanged = browser.storage.onChanged
} else if (hasChromeGlobal) {
  exports.local = new ChromeStorageArea('local')
  exports.managed = new ChromeStorageArea('managed')
  exports.sync = new ChromeStorageArea('sync')
  exports.onChanged = chrome.storage.onChanged
}
