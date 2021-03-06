/**
 * Store initial state.
 * @type {Object}
 */
const state = {
	currentUrl     : window.location.href,
	panelCollapsed : window.localStorage && JSON.parse(window.localStorage.getItem('BugBoxCollapsed')),
	status         : 'initilized',
	user           : null,
	project        : null,
	projectsList   : null,
	tagManager     : null,
	tagged         : null,
	tempPin        : null,
	selectedIssueId: null,
	filters        : {
		currentPageOnly: true,
		group: null
	}
};

export default state;
