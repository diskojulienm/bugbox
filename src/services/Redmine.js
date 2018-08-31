import User from 'model/User';
import Issue from 'model/Issue';
import Tracker from 'services/Tracker';
import LocalStorage from 'services/LocalStorage';
import SessionStorage from 'services/SessionStorage';
import ExtensionStorage from 'services/ExtensionStorage';
import { dataURItoFile } from 'helpers/utils';
import axios from 'axios';

/**
 * Constants.
 */
 const PROJECT_CF_URLS_ID = 8;
 const ISSUE_CF_META_ID = 13;

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
					const userData = response.data.user;
                    const user = new User(
                        userData.id,
                        userData.firstname,
                        userData.lastname,
                        userData.mail
                    );
					resolve(user);
				})
				.catch(error => reject(error));
		});
	}

	/**
	 * Find a project matching query criteria.
	 * @return {Promise<Object>}
	 */
	findProject() {
		return new Promise((resolve, reject) => {
			this.client.get('/projects.json')
			.then((response) => {
				const projects = response.data.projects;
				const result = {
					matches: projects,
					selected: null
				};

				const selected = projects.map(function(value, key){
					const custom_fields = value.custom_fields;
					if(custom_fields.find(custom_field => custom_field.value.match(window.location.hostname) !== null)){
						return value;
					}
					return null;
				}).filter(n => n).shift();

				if(selected !== undefined){
					result['selected'] = selected;
				}

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
				this.client.get(`/issue_statuses.json`),
				this.client.get(`/issues.json`, {
					params: {
                        include: ['attachments'],
						project_id: id
					}
				})
			])
				.then(axios.spread((meta, status, issues) => {
					const project = {
						meta: meta.data.project,
						groups: status.data.issue_statuses,
						issues: issues.data.issues.map((issue) => {
                            return new Issue(
                                issue.id,
                                issue.author,
                                issue.subject,
                                issue.description,
                                issue.status,
                                issue.updated_on,
                                issue.attachments,
                                issue.custom_fields.find((custom_field) => {
                                    return custom_field.id === ISSUE_CF_META_ID;
                                }).value
                            )
                        })
					};

					this.sessionProject.set(id);
					resolve(project);
				}))
				.catch(error => reject(error));
		});
	}

	/**
	 * Select project.
	 * @return {Promise<Object>}
	 */
	selectProject(id) {
		return this.getProjectUrls(id).then((urls) => {
			return this.client.put(`/projects/${id}.json`, {
				project: {
					custom_fields: [
						{
							id: PROJECT_CF_URLS_ID,
							value: urls
						}
					]
				}
			});
		});
	}

	/**
	 * Get project urls.
	 * @return {Promise<Object>}
	 */
	getProjectUrls(id) {
		return new Promise((resolve, reject) => {
			this.client.get(`/projects/${id}.json`)
				.then((response) => {
					let urls = '';

					if(response.data && response.data.project && response.data.project.custom_fields){
						let urlsMeta = response.data.project.custom_fields.find(custom_field => {
							return custom_field.id === PROJECT_CF_URLS_ID;
						});

						// Add new url or not ...
						if(urlsMeta !== undefined && urlsMeta.value !== ''){
							urls = urlsMeta.value + ',' + window.location.hostname
						} else {
							urls = window.location.hostname;
						}
					}

					resolve(urls);
				})
				.catch(error => reject(error));
		});
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
				project_id: issue.projectId
			}
		};

		if (issue.meta && issue.meta.screenshot) {
			issue.screenshot = issue.meta.screenshot;

			delete issue.meta.screenshot;

			payload.issue.custom_fields = [
				{id: 1, value: issue.meta.url}, // page
				{id: 10, value: `${issue.meta.browser.width}x${issue.meta.browser.height}`}, // screen_size
				{id: 11, value: issue.meta.browser.os}, // os
				{id: 12, value: `${issue.meta.browser.vendor} ${issue.meta.browser.version}`}, // browser
				{id: 13, value: JSON.stringify(issue.meta)}, // meta
			]
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
	changeIssueGroup(payload) {
        return this.client.put(`/issues/${payload.cardId}.json`, {
            issue: {
                status_id: payload.groupId
            }
        });
	}

	/**
	 * Get issue actions.
	 * @return {Promise<Array>}
	 */
	getIssueActions() {
		throw new Error('Please implement me.');
	}
}
