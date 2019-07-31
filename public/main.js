$(document).ready(function() {
	$('.article_delete').on('click', function(event) {
		event.preventDefault();

		const id = $(this).attr('data-id');

		// console.log(id);
		// console.log("click me")
		$.ajax({
			type: 'DELETE',
			url: '/articles/delete/' + id,
			success: function(response) {
				alert('Delete successfully');
				window.location.href = '/articles';
				console.log('delete');
			},
			error: function(err) {
				console.log(err);
			},
		});
	});

	$('.article_comment').on('click', function(event) {
		event.preventDefault();

		const id = $(this).attr('data-id');
		const artId = $(this).attr('data-artId');
		// console.log(id);
		// console.log("click me")
		$.ajax({
			type: 'DELETE',
			url: '/article/' + artId +  '/comment/' + id,
			success: function(response) {
				alert('Delete successfully');
				window.location.href = '/articles/info/'+artId;
				console.log('delete');
			},
			error: function(err) {
				console.log(err);
			},
		});
	});
});
