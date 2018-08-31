<template>
	<div :class="classes">
		<loader v-if="isLoading" />

		<div class="authorize__inner">
			<img src="~assets/images/bb-logo-vertical.svg" width="64" alt="BugBox">

			<p>You are not authorized.</p>

			<div class="form__inner">
				<form @submit.prevent="handleFormSubmit">
					<div class="form__body">
						<div class="form__row">
							<input v-model="username" type="text" class="field" placeholder="Username" required>
						</div>

						<div class="form__row">
							<input v-model="password" type="password" class="field" placeholder="Password" required>
						</div>
					</div>
					<div class="form__actions">
						<button type="submit" class="btn form__btn">Authorize</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import { mapActions } from 'vuex';
import Loader from 'components/Loader.vue';

export default {
	name: 'authorize',

	components: {
		Loader
	},

	data() {
		return {
			status: '',
			username: '',
			password: ''
		}
	},

	computed: {
		/**
		 * Get classes object.
		 * @return {Object}
		 */
		classes() {
			return [
				'form',
				'form-authorize',
				{ 'form--loading': this.isLoading }
			];
		},

		/**
		 * Whether component is loading.
		 * @return {Boolean}
		 */
		isLoading() {
			return this.status === 'loading';
		}
	},

	methods: {
		...mapActions([
			'authorize'
		]),

		/**
		 * Handle form submit.
		 * @param  {Event} event
		 * @return {void}
		 */
		handleFormSubmit(event) {
			if (this.isLoading) {
				return;
			}

			const { username, password } = this;

			this.status = 'loading';
			this.authorize({ username, password })
				.then(() => {
					this.status = ''
				}, () => {
					this.status = ''
				});
		}
	}
}
</script>

<style lang="scss">
	.authorize__inner {
		text-align: center;
	}
</style>
