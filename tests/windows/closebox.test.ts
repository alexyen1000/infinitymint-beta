import {expect} from 'chai';
import {InfinityMintWindow} from '../../app/window';
import infinitymint from '../../index';

describe('CloseBox', async () => {
	it('Should display and destroy a box', () => {
		let myWindow = new InfinityMintWindow('MyWindow', {
			width: 12,
		});
		infinitymint.addWindow(myWindow);
		// Concludes the test.
		myWindow = infinitymint.getWindow('MyWindow');
		expect(myWindow).not.undefined;
		expect(myWindow.getWidth()).eq(12);
	});
});
