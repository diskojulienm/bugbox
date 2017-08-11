import axios from 'axios';
import { popupWindow, dataURItoFile } from '../helpers/utils';
import Tracker from '../services/Tracker';
import config from '../config/config';

export default class Trello extends Tracker  {
	constructor() {
		super();

		const { baseURL, key } = config.trackers.trello;
		const token = this.getToken();

		/**
		 * Initialize requests client
		 * @type {Object}
		 */
		this.client = axios.create({
			baseURL,
			params: {
				key,
				token
			}
		});
	}

	/**
	 * Get local storage key for token item
	 * @return {String}
	 */
	getLocalStorageTokenKey() {
		return 'BugboxTrelloToken';
	}

	/**
	 * Get trello token from local storage
	 * @return {String}
	 */
	getToken() {
		return window.localStorage.getItem(this.getLocalStorageTokenKey());
	}

	/**
	 * Set trello token in local storage
	 * @param {String} token
	 */
	setToken(token) {
		if (this.client && this.client.defaults && this.client.defaults.params) {
			this.client.defaults.params['token'] = token;
		}

		if (token) {
			return window.localStorage.setItem(this.getLocalStorageTokenKey(), token);
		} else {
			return window.localStorage.removeItem(this.getLocalStorageTokenKey());
		}
	}

	/**
	 * Get session storage key for selected project id item
	 * @return {String}
	 */
	getSessionStorageProjectKey() {
		return 'BugboxTrelloProject';
	}

	/**
	 * Get selected project id from session storage
	 * @return {String}
	 */
	getSelectedProject() {
		return window.sessionStorage.getItem(this.getSessionStorageProjectKey());
	}

	/**
	 * Set trello token in local storage
	 * @param {String} token
	 */
	setSelectedProject(id) {
		if (id) {
			return window.sessionStorage.setItem(this.getSessionStorageProjectKey(), id);
		} else {
			return window.sessionStorage.removeItem(this.getSessionStorageProjectKey());
		}
	}

	/**
	 * Whether client is authorized
	 * @return {Promise}
	 */
	isAuthorized() {
		return Promise.resolve(!!this.getToken());
	}

	/**
	 * Trigger trello authorization popup
	 * @return {Void}
	 */
	authorizePopup() {
		const { key, authorizeURL } = config.trackers.trello;

		const origin = window.location.origin;
		const name = 'Bugbox';

		const urlParams = {
			return_url: origin,
			callback_method: 'postMessage',
			expiration: 'never',
			scope: 'read,write,account',
			name: name,
			key: key,
		};
		const urlParamsString = Object.keys(urlParams)
			.map(key => `${key}=${urlParams[key]}`)
			.join('&');

		const url = `${authorizeURL}?${urlParamsString}`;

		return popupWindow(url, name, {
			width: 500,
			height: 600,
			top: (window.innerHeight - 600) / 2,
			left: (window.innerWidth - 500) / 2,
		});
	}

	/**
	 * Authorize in tracker
	 * @return {Promise}
	 */
	authorize() {
		const token = this.getToken();

		if (token) {
			return Promise.resolve(token);
		}

		const popup = this.authorizePopup();

		return new Promise((resolve, reject) => {
			const receiveMessage = (event) => {
				window.removeEventListener('message', receiveMessage);

				const token = event.data;

				this.setToken(token);
				resolve(token);
				popup.close();
			};

			window.addEventListener('message', receiveMessage);
		});
	}

	/**
	 * Destroy previous authorization in tracker
	 * @return {Promise}
	 */
	unauthorize() {
		return Promise.resolve(this.setToken(null));
	}

	/**
	 * Get user object
	 * @param  {String} id
	 * @return {Promise}
	 */
	getUser(id = 'me') {
		return new Promise((resolve, reject) => {
			const request = this.client.get(`/members/${id}`);

			return request
				.then(({ data }) => resolve(data))
				.catch(error => reject(error));
		});
	}

	/**
	 * Find a project matching query criteria
	 * @param  {String} project
	 * @return {Promise}
	 */
	findProject(project) {
		const query = `Project Meta: URL ${project}`;

		const request = this.client.get('/search', {
			params: {
				query,
				card_fields: 'name,desc',
				card_board: true,
				card_list: true,
				partial: false,
			}
		});

		return request
			.then(({data}) => {
				if (!data.cards || !data.cards.length) {
					return [];
				}

				const location = window.location.href;
				const selectedProjectIndex = data.cards.findIndex(card => card.board.id === this.getSelectedProject());
				const hasSelectedProject = selectedProjectIndex >= 0;

				if (hasSelectedProject) {
					data.cards = data.cards.filter(card => card.board.id === this.getSelectedProject());
				}

				return data.cards
					.filter((card) => {
						return location.indexOf(card.desc) >= 0;
					})
					.map(card => card.board);
			});
	}

	/**
	 * Get a project
	 * @param  {Any} query
	 * @return {Promise}
	 */
	getProject(id) {
		const urls = [
			`/boards/${id}`,
			`/boards/${id}/lists`,
			`/boards/${id}/cards?attachments=true`
		];

		return new Promise((resolve, reject) => {
			const request = this.client.get('/batch', {
				params: {
					urls
				}
			});

			request
				.then(({ data }) => {
					const meta = data[0] && data[0]['200'];
					const groups = data[1] && data[1]['200'];
					const issues = ((data[2] && data[2]['200']) || []).map(this.mapCardsMeta);

					const project = {
						meta,
						groups,
						issues
					};

					this.setSelectedProject(id);
					resolve(project);
				})
				.catch(error => reject(error));
		})
	}

	/**
	 * Map cards meta object
	 * @param  {Object} card
	 * @return {Object}
	 */
	mapCardsMeta(card) {
		const metaAttachment = (card.attachments || []).find(attachment => attachment.name === 'Issue URL');
		let meta;

		try {
			const metaData = metaAttachment.url.match(/\#issue\-(.+)$/)[1];
			meta = JSON.parse(atob(metaData));
		} catch (error) {
			meta = {};
		}

		card.meta = meta;

		return card;
	}

	/**
	 * Initialize new project
	 * @return {Promise}
	 */
	initProject(payload) {
		const request = this.client.post('boards/', {
			name: `Bugbox: ${payload.name}`,
			defaultLists: true,
			defaultLabels: true,
		});

		return request
			.then((response) => this.initMetaList(response, payload))
			.then((response) => this.closeMetaList(response, payload))
			.then((response) => this.initMetaCard(response, payload));
	}

	/**
	 * Initialize list to store meta cards in trello
	 * @param  {Object} response
	 * @param  {String} name
	 * @return {Promise}
	 */
	initMetaList(response, payload) {
		const board = response.data;
		const boardId = board.id;
		const request = this.client.post(`boards/${boardId}/lists`, {
			name: `Project Meta`,
			closed: true,
		});

		return request;
	}

	/**
	 * Close newly created list for meta cards
	 * @param  {Object} response
	 * @param  {String} name
	 * @return {Promise}
	 */
	closeMetaList(response, payload) {
		const list = response.data;
		const listId = list.id;

		const request = this.client.put(`lists/${listId}/closed`, {
			value: true
		});

		return request;
	}

	/**
	 * Initialize card that contains meta data for the project
	 * @param  {Object} response
	 * @param  {String} name
	 * @return {Promise}
	 */
	initMetaCard(response, payload) {
		const list = response.data;
		const listId = list.id;
		const request = this.client.post(`lists/${listId}/cards`, {
			name: 'Project Meta: URL',
			desc: payload.baseUrl,
		});

		return request;
	}

	/**
	 * Add issue as card in trello
	 * @param {Object} issue
	 * @return {Promise}
	 */
	addIssue(issue) {
		const cardPayload = {
			name: issue.title,
			desc: issue.description,
			idList: issue.group,
		};

		const options = {
			params: {
				attachments: true
			}
		};

		const request = this.client.post('/cards', cardPayload, options);

		if (issue.meta && issue.meta.screenshot) {
			issue.screenshot = issue.meta.screenshot;

			delete issue.meta.screenshot;
		}

		return request
			.then(({data}) => this.addIssueMeta(data, issue.meta))
			.then((card) => this.addIssueScreenshot(card, issue.screenshot));
	}

	/**
	 * Add issue card meta data as attachment
	 * @param {Object} card
	 * @param {Object} meta
	 * @return {Promise}
	 */
	addIssueMeta(card, meta) {
		const url = `${meta.address}#issue-${btoa(JSON.stringify(meta))}`;
		const data = {
			name: 'Issue URL',
			url
		};

		const request = this.client.post(`/cards/${card.id}/attachments`, data);

		return request.then(({data}) => {
			card.attachments = (card.attachments || []).concat(data);
			card = this.mapCardsMeta(card);

			return card;
		});
	}

	/**
	 * Add issue screenshot as attachment
	 * @param {Object} card
	 * @param {String} screenshot
	 * @return {Promise}
	 */
	addIssueScreenshot(card, screenshot) {
		if (!screenshot) {
			return Promise.resolve(card);
		}

		const data = new FormData();
		data.append('name', 'Screenshot');
		data.append('file', dataURItoFile(screenshot, 'screenshot.png'));

		const request = this.client.post(`/cards/${card.id}/attachments`, data);

		return request.then(({data}) => {
			card.attachments = (card.attachments || []).concat(data);

			return card;
		});
	}
}
