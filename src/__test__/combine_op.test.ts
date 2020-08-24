import {ReduxOP} from '../index';
import combineResources, {CombinedOPs} from '../combineResources';

test('Combine Resource should be working', () => {
	const name = 'counter';

	const op1State = {count: 0};
	const op1 = new ReduxOP({
		name: name,
		state: op1State,
	});

	const op2State = {count: 1};
	const op2 = new ReduxOP({
		name: name,
		state: op2State,
	});

	const combined = combineResources({op1, op2});

	expect(combined instanceof CombinedOPs).toBeTruthy();
	expect(combined.getRootReducer()).toBeDefined();
});
