<template>
	<span class="badge" :style="style">{{value}}</span>
</template>

<script>
import { stringToColour } from 'helpers/utils';

export default {
	name: 'badge',

	props: {
		value: {
			requred: true
		}
	},

	computed: {
		/**
		 * Get computed style.
		 * @return {Object}
		 */
		style() {
			return {
				backgroundColor: this.backgroundColor
			};
		},

		/**
		 * Get badge background color.
		 * @return {String}
		 */
		backgroundColor() {
			switch (this.value) {
				case 'Nouveau':
					return '#f05d5d';
				case 'En cours':
					return '#0079bf';
				case 'Traité':
					return '#72aa67';
				default:
					return stringToColour(this.value);
			}
		}
	}
}
</script>
