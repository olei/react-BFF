export const createReducer = (initialState, reducerMap) => {
  return (state = initialState, action) => {
    const reducer = reducerMap[action.type]
    if (reducer && action.content) return reducer(state, action.content)
    return reducer && action.payload ? reducer(state, action.payload.data, action.params) : state
  }
}

export const isPromise = value => {
  if (value !== null && typeof value === 'object') {
    return value.promise && typeof value.promise.then === 'function'
  }
}