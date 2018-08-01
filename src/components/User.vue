<template>
	<div class="user">
		<div class="user__name">

			<span class="user__initials">{{user.firstname.charAt(0) + user.lastname.charAt(0)}}</span>

			<span class="user__fullname">{{user.firstname}} {{user.lastname}}</span>
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
