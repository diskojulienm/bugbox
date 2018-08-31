<template>
	<div class="panel__head">
		<template v-if="user">
			<template v-if="project">
				<button :disabled="isSubmittingIssue" @click.prevent="initTagging" class="btn">Add Issue</button>

				<a :href="'https://bugkiller.disko.fr/projects/' + project.meta.identifier" target="_blank" class="panel__project-link">
					Open Project
				</a>
			</template>

			<div class="panel__dropdown">
				<a @click.prevent href="#" class="panel__dropdown-btn" title="Show Menu">
					<span class="panel__dropdown-icon">
						<i class="ico-dots"></i>

						<i class="ico-dots-hover"></i>
					</span>
				</a>

				<div class="panel__dropdown-menu">
					<ul>
						<li>
							<a href="https://bugkiller.disko.fr/my/account" target="_blank">
								<user :user="user" />
							</a>
						</li>

						<li v-if="project && projectsList && projectsList.length > 1">
							<a @click.prevent="changeProject" href="#">
								<i class="ico-change"></i> Change Project ({{projectsList.length}})
							</a>
						</li>

						<li>
							<a @click.prevent="unauthorize" href="#">
								<i class="ico-logout"></i> Logout
							</a>
						</li>
					</ul>
				</div>
			</div>
		</template>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import User from 'components/User.vue';

export default {
	name: 'panel-head',

	components: {
		User
	},

	computed: {
		...mapGetters([
			'user',
			'projectsList',
			'project',
			'isSubmittingIssue'
		]),
	},

	methods: {
		...mapActions([
			'initTagging',
			'unauthorize',
			'changeProject'
		])
	}
}
</script>
