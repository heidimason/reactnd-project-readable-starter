import { createStore, compose, applyMiddleware } from 'redux'
import combinedReducers from '../components/Categories/reducer'
import thunk from 'redux-thunk'

const logger = store => next => action => {
	console.group(action.type)
	console.info('dispatching', action)
	let result = next(action)
	console.log('next state', store.getState())
	console.groupEnd(action.type)
	return result
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
	combinedReducers,
	composeEnhancers(
		applyMiddleware(thunk, logger)
	)
)

export default store