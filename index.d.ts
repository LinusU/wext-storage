type OnChangedListener = (changes: { [key: string]: StorageChange }, areaName: keyof StorageModule) => void

/** Fired when one or more items change in a storage area. */
interface OnChangedEvent {
  /** Adds a listener to this event. */
  addListener (listener: OnChangedListener): void

  /** Stop listening to this event. The `listener` argument is the listener to remove. */
  removeListener (listener: OnChangedListener): void

  /** Check whether `listener` is registered for this event. Returns `true` if it is listening, `false` otherwise. */
  hasListener (listener: OnChangedListener): void
}

/** `StorageChange` is an object representing a change to a storage area. */
interface StorageChange {
  /** The old value of the item, if there was an old value. This can be any data type. */
  oldValue?: any

  /** The new value of the item, if there is a new value. This can be any data type. */
  newValue?: any
}

/** `StorageArea` is an object representing a storage area. */
interface StorageArea {
  /** Retrieves one or more items from the storage area. */
  get (key: null | string | string[] | { [key: string]: any }): Promise<any>

  /** Stores one or more items in the storage area. If an item already exists, its value will be updated. */
  set (items: { [key: string]: any }): Promise<void>

  /** Removes one or more items from the storage area. */
  remove (key: string | string[]): Promise<void>

  /** Removes all items from the storage area. */
  clear (): Promise<void>
}

interface StorageModule {
  /** Represents the `local` storage area. Items in `local` storage are local to the machine the extension was installed on. */
  local: StorageArea

  /** Represents the `managed` storage area. Items in `managed` storage are set by the domain administrator and are read-only for the extension. Trying to modify this namespace results in an error. */
  managed: StorageArea

  /** Represents the `sync` storage area. Items in `sync` storage are synced by the browser, and are available across all instances of that browser that the user is logged into, across different devices. */
  sync: StorageArea

  /** Fired when one or more items change in a storage area. */
  onChanged: OnChangedEvent
}

declare const storage: StorageModule

export = storage
