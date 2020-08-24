import {ReduxOP} from '../index';
import combineResources from '../combineResources';

const emptyAction = {type: 'EmptyActionType'};

test('Should handle empty action correctly', () => {
	const op1State = {count: 0};
	const op1 = new ReduxOP({
		name: 'op1',
		state: op1State,
	});

	const op2State = {count: 1};
	const op2 = new ReduxOP({
		name: 'op2',
		state: op2State,
	});

	const combinedState = {op1: {...op1State}, op2: {...op2State}};

	const combined = combineResources({op1, op2});
	const reducer = combined.getRootReducer();
	const state = reducer(combinedState, emptyAction);

	expect(state.op1.count).toEqual(0);
	expect(state.op2.count).toEqual(1);
});

test('Should handle op action correctly', () => {
	const op1State = {count: 0};
	const op1 = new ReduxOP({
		name: 'op1',
		state: op1State,
	});

	const op2State = {count: 1};
	const op2 = new ReduxOP({
		name: 'op2',
		state: op2State,
	});

	const combinedState = {op1: {...op1State}, op2: {...op2State}};

	const combined = combineResources({op1, op2});
	const reducer = combined.getRootReducer();
	const state = reducer(combinedState, op1.actions.set({count: 100}));

	expect(state.op1.count).toEqual(100);
	expect(state.op2.count).toEqual(1);
});

test('Allow different op name and index name', () => {
	const op1State = {count: 0};
	const op1 = new ReduxOP({
		name: 'op1',
		state: op1State,
	});

	const op2State = {count: 1};
	const op2 = new ReduxOP({
		name: 'op2',
		state: op2State,
	});

	const combinedState = {o1: {...op1State}, o2: {...op2State}};

	const combined = combineResources({o1: op1, o2: op2});
	const reducer = combined.getRootReducer();
	const state = reducer(combinedState, op1.actions.set({count: 100}));

	expect(op1.actions.set({}).type).toContain('op1');
	expect(state.o1.count).toEqual(100);
	expect(state.o2.count).toEqual(1);
});
