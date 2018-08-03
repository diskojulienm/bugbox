<template>
	<span class="badge" :style="style">{{value.name}}</span>
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
			switch (this.value.id) {
				case 1:
					return '#f05d5d';
				case 2:
					return '#0079bf';
				case 8:
					return '#72aa67';
				default:
					return stringToColour(this.value);
			}
		}
	}
}
</script>
