<template>
	<div :class="classes">
		<loader v-if="isLoading" />

		<form @submit.prevent="handleFormSubmit">
			<div class="form__row">
				<label class="form__label">Redmine Project:</label>
				<div class="select form__stack-item">
					<select v-model="boardId">
						<option v-for="board in boards" :value="board.id">{{board.name}}</option>
					</select>
				</div>
			</div>

			<div class="form__row">
				<label class="form__label">Site Base URL:</label>

				<input :value="baseUrl" class="field" type="text" readonly>
			</div>

			<div class="form__actions">
				<div class="form__stack">
					<button type="submit" class="btn form__stack-addon">Setup</button>
				</div><!-- /.form__stack -->
			</div>
		</form>

	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Loader from 'components/Loader.vue';

export default {
	name: 'new-project',

	components: {
		Loader
	},

	data() {
		return {
			status: '',
			baseUrl: window.location.origin,
			boardId: null
		};
	},

	computed: {
		...mapGetters([
			'user',
			'project'
		]),

		/**
		 * Get classes object.
		 * @return {Object}
		 */
		classes() {
			return [
				'form',
				{ 'form--loading': this.isLoading }
			];
		},

		/**
		 * Whether component is loading.
		 * @return {Boolean}
		 */
		isLoading() {
			return this.status === 'loading';
		},

		/**
		 * Get form payload object.
		 * @return {Object}
		 */
		payload() {
			return {
				baseUrl: this.baseUrl
			};
		},

		/**
		 * Get current user boards,
		 * @return {Array}
		 */
		boards() {
			return (this.user && this.user.boards) || [];
		}
	},

	methods: {
		...mapActions([
			'setupProject',
		]),

		/**
		 * Handle form submit.
		 * @return {void}
		 */
		handleFormSubmit() {
			if (this.isLoading) {
				return;
			}

			this.status = 'loading';

			const board = this.boards.find(board => board.id === this.boardId);
			const data = { data: board };
			const payload = this.payload;

			this.setupProject({ data, payload })
				.then((response) => {
					this.status = '';
				});
		}
	}
}
</script>
