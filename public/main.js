$(document).ready(function() {
	$('.article_delete').on('click', function(event) {
		event.preventDefault()
       
     const id=   $(this).attr("data-id")
       
        // console.log(id);
        // console.log("click me")
		$.ajax({
			type: 'DELETE',
			url: '/article/delete/'+id,
			success: function(response) {
				alert('Delete successfully');
                window.location.href = '/article';
                console.log("delete")
			},
			error: function(err) {
				console.log(err);
			}
		});
	});
});
