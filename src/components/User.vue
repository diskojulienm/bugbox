<template>
	<div class="user">
		<div class="user__name">

			<span class="user__initials">{{user.initials}}</span>

			<span class="user__fullname">{{user.fullName}}</span>
		</div>
	</div>
</template>

<script>
export default {
	name: 'user',

	props: {
		user: {
			required: true
		}
	}
}
</script>
