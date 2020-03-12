$(function(){
	$('#myCarousel').hide().slideToggle(3500);
	$('#travelUs').hide().slideToggle(3500);
	$('#pricing').hide().fadeIn(6000);
	$("#dash").hide().slideToggle(3000);
})

$(function () {
	var today = new Date();

	var elbookDate = $('#bookDate');
	elbookDate.text(today.toDateString());

	var elbooktime = $('#bookTime');
	elbooktime.text(today.toTimeString());
});

//to make a clicked link the active one on the main page navbar 
$(function () {
	$('#myNavbar ul li:eq(0)').addClass('active');
	$('#myNavbar ul li').on('click', function () {
		$('#myNavbar ul li').removeClass('active');
		$(this).addClass('active');
	});
});

//to load DataTable
$(function() {
    $('#ticketHistory').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": "scripts/objects.php",
        "columns": [
            { "t_history": "id" },
            { "t_history": "the_date" },
            { "t_history": "t_from" },
            { "t_history": "t_to" },
            { "t_history": "amount" }
        ]
    });
});


//to move page to the top
$('#gotop').gotop();

//Set the width of the side navigation to 250px
function openNav() {
	$("#mySidenav").width("250px");
	$(".navbar-toggle").css("display","none");
}

//Set the width of the side navigation to 0
function closeNav() {
	$("#mySidenav").width("0");
	$(".navbar-toggle").css("display","block");
}

//From booking
$(function(){
	$('.card').on('click',function(){
		var card = $(this);
		var clicked = card.find('.someid').text();
		var name = card.find('.card-title').text();
		var clickedid = {id: clicked,name: name};
		$.post('/booking',clickedid,function(data){
		})
	})
})

//From busdestination
$(function(){
	$('.card').on('click',function(){
		var card = $(this);
		var cardtext = card.find('.card-text').text();
		var cardtext1 = card.find('.card-text1').text();
		var datatosend = {from: cardtext, to:cardtext1};
		$.post('/busdestination',datatosend,function(data){
		})
	})
})

//From destinationdetails
$(function(){
	$('.card').on('click',function(){
	var card = $(this);
	var amount = card.find('.amount').text();
	var duration = card.find('.duration').text();
	var seatleft = card.find('.seatleft').text();
	var busno = card.find('.busno').text();
	var departdate = card.find('.departdate').text();
	var departtime = card.find('.departtime').text();
	var detailsfrom = card.find('.detailsfrom').text();
	var detailsto = card.find('.detailsto').text();
	var detailscompanyid = card.find('.detailscompanyid').text();
	var detailscompanyname = card.find('.detailscompanyname').text();
	var detailscompanylocation = card.find('.detailscompanylocation').text();
	var datatosend = {
		amount: amount,
		 duration:duration,
		 seatleft:seatleft,
		 departdate:departdate,
		 departtime:departtime,
		 detailsfrom :detailsfrom,
		 detailsto : detailsto,
		 busno : busno,
		 detailscompanyid:detailscompanyid,
		 detailscompanyname:detailscompanyname,
		 detailscompanylocation:detailscompanylocation
		};
	$.post('/destinationdetails',datatosend,function(data){
	})
})  
})

//Rave Pay

function payWithRave() {
		var customer_firstname = $('#confirmform #firstname').val();
		var customer_lastname = $('#confirmform #lastname').val();
		var customer_phone = $('#confirmform #number').val();
		var customer_email = $('#confirmform #email').val();
		var amount = $('#confirmform #total').val();
		var txref = $('#confirmform #description').val();

        var x = getpaidSetup({
			PBFPubKey: "FLWPUBK_TEST-abdf93acc2ba3a7b94fa44ad0d8ec0cf-X",
			customer_firstname : customer_firstname,
			customer_lastname : customer_lastname,
            customer_email: customer_email,
            amount: amount,
            customer_phone: customer_phone,
            currency: "GHS",
            txref: txref,
            meta: [{
                metaname: "flightID",
                metavalue: "AP1234"
            }],
            onclose: function() {},
            callback: function(response) {
                var txref = response.tx.txRef; // collect txRef returned and pass to a server page to complete status check.
                console.log("This is the response returned after a charge", response);
                if (
                    response.tx.chargeResponseCode == "00" ||
                    response.tx.chargeResponseCode == "0"
                ) {
					// redirect to a success page
					var myquery = $.param(response.data.data)
					var redirectURL = "https://ticketbooker.herokuapp.com/ticket-success?" + myquery
					window.location = redirectURL
                } else {
                    window.location = "https://ticketbooker.herokuapp.com/ticket-failure"
                }

                x.close(); // use this to close the modal immediately after payment.
            }
        });
}
//Rave Pay


//to load ticket details once a row is clicked on
var transactionid = "";
var touse = "";
$(function(){
	$("#ticketHistory tbody .btn-primary").on('click',function(){
		touse = $(this);
		var from = touse.find('.historyfrom').text();
		var date = touse.find('.historydate').text();
		var to = touse.find('.historyto').text();
		alert(to)
		var amount = touse.find('.historyamount').text();
		transactionid = touse.find('.historytransactionid').text();
		var name = touse.find('.historycompanyname').text();
		var time = touse.find('.historytime').text();
		var seat = touse.find('.historyseat').text();
		var location = touse.find('.historylocation').text();
		var busno = touse.find('.historybusno').text();
		var imgsrc = touse.find('.historyqr img').attr('src');

		
		$('.modal-body .bus').text(name);
		$('.modal-body .initial').text(from);
		$('.modal-body .price').text('GH₵ '+ amount);
		$('.modal-body .duration').text();
		$('.modal-body .final').text(to);
		$('.modal-body .departure').text(date);
		$('.modal-body .time').text(time);
		$('.modal-body .transactionid').text(transactionid);
		$('.modal-body .busnumber').text(busno);
		$('.modal-body .location').text(location);
		$('.modal-body .seat').text(seat);
		var new_imgsrc = "data:image/png;base64,"+imgsrc
		$('.modal-body .qrcode').attr('src',new_imgsrc);
		
	});
})

//to cancel ticket
$('.tocancel').on('click',function(){
	var btn = $(this);
	btn.addClass('disable');
	if (confirm('Are you sure you want to cancel ticket?')){
		window.location = "/cancelticket?transactionid=" + transactionid
	}
})