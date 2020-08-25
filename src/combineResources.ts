import ReduxOP from './ReduxOP';
import {Reducer, combineReducers, ReducersMapObject} from 'redux';
import {mapValues} from 'lodash';

type OPMapObject<S> = {[K in keyof S]: ReduxOP<S[K]>};

export class CombinedOPs<S> {
	private opMap: OPMapObject<S>;
	constructor(opMap: OPMapObject<S>) {
		this.opMap = opMap;
	}

	getRootReducer<SR>(
		reducersMap?: ReducersMapObject<SR>
	): Reducer<SR & S, any> {
		const opRootReducer = (mapValues(
			this.opMap,
			(op) => op.reducer
		) as unknown) as ReducersMapObject<S>;

		const a = ({
			...reducersMap,
			...opRootReducer,
		} as unknown) as ReducersMapObject<SR & S>;

		const t = combineReducers(a);

		return t;
	}
}

export default <S>(opsMap: OPMapObject<S>): CombinedOPs<S> =>
	new CombinedOPs(opsMap);

/**
 * store = useStore()
 * store.count.increment()
 * store.select((state)=>state.count)
 */
