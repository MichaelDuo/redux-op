import {AnyAction, Reducer} from 'redux';
import {OP_ACTION_PREFIX} from './constants';
import _ from 'lodash';

type PartialAll<T> = {[K in keyof T]?: PartialAll<T[K]>};
type ReducerMap<S> = {[key: string]: Reducer<S>};

interface OPDef<S, R> {
	name: string;
	state: S;
	selectors?: any;
	reducers?: {[K in keyof R]: (state: S, action: AnyAction) => S};
	computed?: any;
}

interface BaseActions<S> {
	set: (payload: Partial<S>) => AnyAction;
	clear: () => AnyAction;
	update: (payload: PartialAll<S>) => AnyAction;
}

type BaseActionTypes = {
	set: string;
	clear: string;
	update: string;
};

/**
 * TODO:
 * Custom Selectors
 * Custom reducers
 */
class ReduxOP<S, R = any> {
	public name: string;
	public actions: BaseActions<S>;
	public reducer: Reducer<S>;
	protected reducersMap: ReducerMap<S>;
	protected defaultState: S;
	protected actionTypes: BaseActionTypes;

	constructor(def: OPDef<S, R>) {
		this.name = def.name;
		this.defaultState = def.state;
		this.actionTypes = this.getActionTypes();
		this.actions = this.getActions();
		this.reducersMap = this.getReducersMap();
		this.reducer = this.getReducer();
	}

	protected getActionTypes(): BaseActionTypes {
		return ['set', 'clear', 'update'].reduce((pre, type) => {
			pre[type] = `${OP_ACTION_PREFIX}/${this.name}_${type}`;
			return pre;
		}, {} as any);
	}

	protected getBaseActions(): BaseActions<S> {
		return {
			set: (payload) => ({
				type: this.actionTypes.set,
				payload,
			}),
			clear: () => ({
				type: this.actionTypes.clear,
			}),
			update: (payload) => ({
				type: this.actionTypes.update,
				payload,
			}),
		};
	}

	protected getActions(): BaseActions<S> {
		return this.getBaseActions();
	}

	protected getReducersMap(): ReducerMap<S> {
		return {
			[this.actionTypes.set]: (state, action) => {
				return {...state, ...action.payload};
			},
			[this.actionTypes.update]: (state, action) => {
				// const paths = xxx
				// const values = xxx
				// return _.update(state, paths, values)
				return _.cloneDeep(this.defaultState);
			},
			[this.actionTypes.clear]: (state, action) => {
				return _.cloneDeep(this.defaultState);
			},
		};
	}

	protected getReducer(): Reducer<S> {
		return (state = this.defaultState, action) => {
			const reducer = this.reducersMap[action.type];
			if (typeof reducer === 'function') {
				return reducer(state, action);
			} else {
				return state;
			}
		};
	}
}

export default ReduxOP;
