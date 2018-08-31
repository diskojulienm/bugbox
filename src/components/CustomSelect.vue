<template>
	<div :class="classes">
		<button class="custom-select__selected" @click.prevent="toggleExpanded">{{selected ? selected.label : ''}}</button>

		<div class="custom-select__options">
			<ul v-if="expanded">
				<li v-for="option in visibleOptions">
					<label>
						<input v-model="innerValue" :value="option.value" :name="name" type="radio">

						{{option.label}}
					</label>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>

export default {
	name: 'custom-select',

	props: {
		value: {
			default: null
		},

		options: {
			requred: true
		},

		name: {
			required: true
		},
	},

	data() {
		return {
			expanded: false,
			innerValue: this.value
		};
	},

	computed: {
		/**
		 * Get classes object.
		 * @return {Object}
		 */
		classes() {
			return [
				'custom-select',
				{ 'custom-select--expanded': this.expanded }
			];
		},

		/**
		 * Get selected option object.
		 * @return {Object}
		 */
		selected() {
			return this.options.find(option => option.value === this.value);
		},

		/**
		 * Get visible options array.
		 * @return {Array}
		 */
		visibleOptions() {
			return this.options.filter(option => option.value !== this.value);
		},

		/**
		 * Get panel iframe reference.
		 * @return {Element}
		 */
		iframe() {
			let iframe = null
			let parent = this.$parent;

			while (parent && !iframe) {
				if (parent.$refs && parent.$refs.panelFrame) {
					iframe = parent.$refs.panelFrame;
				}

				parent = parent.$parent;
			}

			return iframe;
		}
	},

	methods: {
		/**
		 * Toggle select dropdown expanded.
		 * @param  {Event} event
		 * @param  {Boolean} toggle
		 * @return {void}
		 */
		toggleExpanded(event, toggle = !this.expanded) {
			this.expanded = toggle;
		}
	},

	watch: {
		innerValue() {
			this.$emit('input', this.innerValue);
		}
	}
}
</script>
