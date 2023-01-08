describe('CloseBox', () => { 
	it('Should display and destroy a box', () => {
		// Concludes the test.
		CloseEvent.should.eventually.become(closed);
	});
})