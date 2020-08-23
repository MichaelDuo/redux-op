import {ReduxOP} from '../index';
import _ from 'lodash';

test('Generate resource', () => {
	const name = 'counter';
	const defaultState = {count: 0};
	const counter = new ReduxOP({
		name: name,
		state: defaultState,
	});
	expect(counter).not.toEqual(null);
	expect(counter.name).toEqual(name);
});

test('Resource should have base actions', () => {
	const name = 'counter';
	const defaultState = {count: 0};
	const counter = new ReduxOP({
		name: name,
		state: defaultState,
	});
	expect(counter.actions).not.toEqual(null);
	expect(counter.actions.set).toBeInstanceOf(Function);
	expect(counter.actions.clear).toBeInstanceOf(Function);
	expect(typeof counter.actions.set({}).type).toEqual('string');
	expect(typeof counter.actions.clear().type).toEqual('string');

	const payload = {count: 1};
	expect(counter.actions.set(payload).payload).toEqual(payload);
});

test('Reducer returns correct default state', () => {
	const name = 'counter';
	const defaultState = {count: 0};
	const counter = new ReduxOP({
		name: name,
		state: defaultState,
	});
	expect(counter.reducer).not.toEqual(null);

	const action = {type: 'some_unrecognized_action', payload: defaultState};
	expect(counter.reducer(defaultState, action)).toEqual(defaultState);
});

test('Set action should be working', () => {
	const name = 'counter';
	const defaultState = {count: 0};
	const counter = new ReduxOP({
		name: name,
		state: defaultState,
	});
	const newState = counter.reducer(
		defaultState,
		counter.actions.set({count: 1})
	);
	expect(newState.count).toEqual(1);
});

test('Clear action should be working', () => {
	const name = 'counter';
	const defaultState = {count: 0};
	const counter = new ReduxOP({
		name: name,
		state: defaultState,
	});
	const newState = counter.reducer(
		defaultState,
		counter.actions.set({count: 1})
	);
	const newState2 = counter.reducer(newState, counter.actions.clear());
	expect(newState2.count).toEqual(0);
});

test('Set action with nested', () => {
	const name = 'counter';
	const defaultState = {
		p1: 0,
		p2: {
			p3: 1,
			p4: 2,
		},
	};
	const counter = new ReduxOP({
		name: name,
		state: defaultState,
	});

	// counter.actions.set({p2: {p3: 100}}) // This won't work
	const newState = counter.reducer(
		defaultState,
		counter.actions.set({p2: {p3: 100, p4: 2}})
	);
	expect(newState.p2.p3).toEqual(100);
});

test('Update action should be working', () => {
	const name = 'counter';
	const defaultState = {
		p1: 0,
		p2: {
			p3: 1,
			p4: 2,
		},
	};
	const counter = new ReduxOP({
		name: name,
		state: defaultState,
	});

	// counter.actions.set({p2: {p3: 100}}) // This won't work
	const newState = counter.reducer(
		defaultState,
		counter.actions.update({p2: {p3: 100}})
	);
	expect(newState.p2.p3).toEqual(100);
	expect(newState.p2.p4).toEqual(2);
	expect(newState.p2).toEqual(0);
});

test('ReduxOP should accept reducer parameter', () => {
	const name = 'counter';
	const defaultState = {count: 0};
	const counter = new ReduxOP({
		name: name,
		state: defaultState,
		reducers: {
			increment: (state, action) => {
				return state;
			},
		},
	});
	expect(counter).not.toEqual(null);
	expect(counter.name).toEqual(name);
});

test('ReduxOP should accept null reducer type', () => {
	const name = 'counter';
	const defaultState = {count: 0};
	const counter = new ReduxOP<typeof defaultState>({
		name: name,
		state: defaultState,
		reducers: {
			increment: (state, action) => {
				return state;
			},
		},
	});
	expect(counter).not.toEqual(null);
	expect(counter.name).toEqual(name);
});

test('Test', () => {
	let obj = {
		a: 1,
		b: {
			c: 2,
			d: 3,
			e: {
				yo: {
					test1: 1,
					test2: 4,
				},
			},
		},
	};
	const res: any[] = [];
	function doFlat(obj: any, path: string) {
		for (let key in obj) {
			if (typeof obj[key] === 'object') {
				doFlat(obj[key], `${path}${path && '.'}${key}`);
			} else {
				res.push({
					path: `${path}${path && '.'}${key}`,
					parent: `${path}`,
					value: obj[key],
				});
			}
		}
	}
	doFlat(obj, '');
	console.log(res);
});
