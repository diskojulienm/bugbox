import Tracker from 'services/Tracker';
import LocalStorage from 'services/LocalStorage';
import SessionStorage from 'services/SessionStorage';
import ExtensionStorage from 'services/ExtensionStorage';
import axios from 'axios';
import { dataURItoFile } from 'helpers/utils';

export default class Redmine extends Tracker {

    /**
	 * Create a Redmine Tracker.
	 */
	constructor() {
		super();

		this.baseUrl = process.env.REDMINE_API_URL;

        this.localAuthToken     = new LocalStorage('RedmineToken');
		this.extensionAuthToken = new ExtensionStorage('RedmineToken');
		this.sessionProject  	= new SessionStorage('RedmineProject');

		/**
		 * Initialize XHR client.
		 * @type {Object}
		 */
		this.getToken().then((token) => {
			this.client = axios.create({
				baseURL: this.baseUrl,
				params: {
					key: token
				}
			});

		});
	}

    /**
	 * Get redmine token from local storage.
	 * @return {Promise}
	 */
	getToken() {
		return this.localAuthToken.has()
			.then((hasLocalAuthToken) => {
				if (hasLocalAuthToken) {
					return this.localAuthToken.get();
				} else {
					return this.extensionAuthToken
						.get()
						.then(value => this.localAuthToken.set(value));
				}
			});

	}

	/**
	 * Set redmine token in browser and local storage.
	 * @param {object} credentials
	 */
	setToken(token) {
		if (this.client && this.client.defaults && this.client.defaults.params) {
			this.client.defaults.params['key'] = token;
		}

		this.localAuthToken.set(token);
		this.extensionAuthToken.set(token);
	}

    /**
	 * Whether client is authorized.
	 * @return {Promise<Boolean>}
	 */
	isAuthorized() {
		return Promise.resolve(this.getToken()).then(token => !!token);
	}

    /**
	 * Authorize in tracker.
	 * @return {Promise<void>}
	 */
	authorize(credentials) {
		return new Promise((resolve, reject) => {
			this.client.get('/users/current.json', {
				auth: {
					username: credentials.username,
					password: credentials.password
				}
			})
				.then((response) => {
					if(response.data && response.data.user && response.data.user.api_key){
						this.setToken(response.data.user.api_key);
						resolve(response.data.user.api_key);
					}
				})
				.catch((error) => {
					window.history.back();
					reject(error);
				});
		});
	}

	/**
	 * Destroy previous authorization in tracker.
	 * @return {Promise<void>}
	 */
	unauthorize() {
		return Promise.resolve(this.setToken(null));
	}

	/**
	 * Get user object.
	 * @return {Promise<Object>}
	 */
	getUser() {
		return new Promise((resolve, reject) => {
			return this.client.get('/users/current.json')
				.then((response) => {
					const user = response.data.user;
					resolve(user);
				})
				.catch(error => reject(error));
		});
	}

	/**
	 * Find a project matching query criteria.
	 * @return {Promise<Object>}
	 */
	findProject(project) {
		return new Promise((resolve, reject) => {
			this.client.get('/projects.json')
			.then((response) => {
				const projects = response.data.projects;
				const selected = projects.map(function(value, key){
					const custom_fields = value.custom_fields;
					if(custom_fields.find(custom_field => custom_field.value.match(window.location.hostname) !== null)){
						return value;
					}
					return null;
				}).filter(n => n).shift();
				const result = {
					matches: projects,
					selected: selected
				};

				resolve(result);
			})
			.catch(error => reject(error));
		});
	}

	/**
	 * Get a project.
	 * @return {Promise<Object>}
	 */
	getProject(id) {
		return new Promise((resolve, reject) => {
			axios.all([
				this.client.get(`/projects/${id}.json`),
				this.client.get(`/issues.json`, {
					params: {
						project_id: id
					}
				}),
				this.client.get(`/issue_statuses.json`)
			])
				.then(axios.spread((repository, issues, issue_statuses) => {
					const project = {
						repository: repository.data.project,
						groups: issue_statuses.data.issue_statuses,
						issues: issues.data.issues
					};

					resolve(project);
				}))
				.catch(error => reject(error));
		});
	}

	/**
	 * Initialize new project.
	 * @return {Promise<Object>}
	 */
	initProject() {
		throw new Error('Please implement me.');
	}

	/**
	 * Setup project.
	 * @return {Promise<Object>}
	 */
	setupProject() {
		throw new Error('Please implement me.');
	}

	/**
	 * Add issue item.
	 * @return {Promise<Object>}
	 */
	addIssue(issue) {
		const payload = {
			issue: {
				subject: issue.title,
				description: issue.description,
				custom_fields: [
					{id: 1, value: window.location.href} // Page
				],
				project_id: issue.projectId
			}
		};

		if (issue.meta && issue.meta.screenshot) {
			issue.screenshot = issue.meta.screenshot;

			delete issue.meta.screenshot;
		}

		return this.addIssueScreenshot(issue.screenshot)
			.then(token => {
				if(token){
					payload.issue.uploads = [
						{token: token, filename: 'screenshot.png', content_type: 'image/png'}
					];
				}

				return this.client.post('/issues.json', payload);
			});
	}

	/**
	 * Add issue screenshot.
	 * @return {Promise<Object>}
	 */
	addIssueScreenshot(screenshot) {
		if (!screenshot) {
			return Promise.resolve(null);
		}

		const request = this.client.post(`/uploads.json`, dataURItoFile(screenshot, 'screenshot.png'), {
			headers: {
				'Content-Type': 'application/octet-stream'
			}
		});

		return request.then(({data}) => {
			return data.upload.token;
		});
	}

	/**
	 * Change issue group.
	 * @return {Promise<Object>}
	 */
	changeIssueGroup() {
		throw new Error('Please implement me.');
	}

	/**
	 * Get issue actions.
	 * @return {Promise<Array>}
	 */
	getIssueActions() {
		throw new Error('Please implement me.');
	}

}
