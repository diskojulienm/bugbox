<template>
	<div class="bugbox__pins">
		<pin v-for="issue in visibleIssues" :key="issue.id" :issue="issue" :selected="issue.id === selectedIssueId" :groups="groups" />

		<temp-pin v-if="tempPin" :left="tempPin.x" :top="tempPin.y" />
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Pin from 'components/Pin.vue';
import TempPin from 'components/TempPin.vue';

export default {
	name: 'pins',

	components: {
		Pin,
		TempPin
	},

	computed: {
		...mapGetters([
			'groups',
			'visibleIssues',
			'tempPin',
			'selectedIssueId'
		]),
	}
}
</script>

<style scoped>
	@keyframes bugboxBounce {
		0% { transform: translateY(0); }
		50% { transform: translateY(-5px); }
		100% { transform: translateY(0); }
	}

	@keyframes bugboxScale {
		0% { transform: scale(1); opacity: 1; }
		50% { transform: scale(1.25); opacity: .5; }
		100% { transform: scale(1); opacity: 1; }
	}

	.bugbox .bugbox__pin { position: absolute; left: -10000px; top: -10000px; margin: -27px 0 0 -10px; cursor: pointer; transition: opacity .2s; }

	.bugbox .bugbox__pin:after { content: ''; position: relative; display: block; width: 20px; height: 28px; background: url(~assets/images/pin-default.svg) no-repeat center center; background-size: 100% 100%; transition: all .2s; }
	.bugbox .bugbox__pin:before { content: ''; position: absolute; left: 50%; top: 50%; width: 28px; height: 28px; margin: -15px 0 0 -14px; background: #f05d5d; border-radius: 50%; visibility: hidden; opacity: 0; transform: scale(.5); transition: all .2s; }

	.bugbox .bugbox__pin:hover:after { transform: translateY(-3px); }
	.bugbox .bugbox__pin:active:after { transform: translateY(0); }

	.bugbox .bugbox__pin--done { visibility: hidden; opacity: 0; }

	.bugbox .bugbox__pin--active { z-index: 2; visibility: visible; opacity: 1; pointer-events: none; }
	.bugbox .bugbox__pin--active:before { visibility: visible; animation: bugboxScale 1s infinite linear; }

	.bugbox .bugbox__pin--active:hover:after,
	.bugbox .bugbox__pin--active:after { background-image: url(~assets/images/pin-highlighted.svg); transform: translateY(0px); }

	.bugbox .bugbox__pin--temp { pointer-events: none; }

	/*  Tagging State  */
	.bugbox--tagging .bugbox__pin:not(.bugbox__pin--temp) { visibility: hidden; opacity: 0; }
</style>
