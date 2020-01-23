//Set the width of the side navigation to 250px
function openNav() {
	$('#mySidenav').css('width', '300px');
}

//Set the width of the side navigation to 0
function closeNav() {
	$('#mySidenav').css('width', '0');

}
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

$(function () {
	$('#myNavbar ul li:eq(0)').addClass('active');
	$('#myNavbar ul li').on('click', function () {
		$('#myNavbar ul li').removeClass('active');
		$(this).addClass('active');
	});
});

$(function() {
    $('#ticketHistory').DataTable();
});

$('#gotop').gotop();

$(function () {
	$('.nextbtn').on('click', function (e) {
		e.preventDefault();

		var bus = $('#companybus').val();
		$('.bus').text(bus);

		var from = $('#from').val();
		$('.initial').text(from);

		var leave = $('#departdate').val();
		$('.leavedate').text(leave);

		var leavetime = $('#departtime').val();
		$('.leavetime').text(leavetime);

		var to = $('#to').val();
		$('.final').text(to);

		var dataprice = localStorage.getItem('thirdkey');
		$('.price').text("GHC " + dataprice);

		var dataduration = localStorage.getItem('fourthkey');
		$('.duration').text(dataduration + "hrs");
	});
});

function openNav() {
	$("#mySidenav").width("250px");
	$(".navbar-toggle").css("display","none");
}

function closeNav() {
	$("#mySidenav").width("0");
	$(".navbar-toggle").css("display","block");
}

//this is to connect the pages via the links clicked on the table
/*$(function () {
	$('tr').on('click', function () {
		var tr = $(this);
		var from = tr.find('td:eq(0)').text();
		var to = tr.find('td:eq(1)').text();
		var price = tr.find('td:eq(2)').text();
		var duration = tr.find('td:eq(3)').text();
		if (window.localStorage) {
			localStorage.setItem('firstkey', from);
			localStorage.setItem('secondkey', to);
			localStorage.setItem('thirdkey', price);
			localStorage.setItem('fourthkey', duration);
			window.location.href = '/booking';
		}

		var datapresently = localStorage.getItem('firstkey');
		$('#from').val(datapresently);
		var datagoing = localStorage.getItem('secondkey');
		$('#to').val(datagoing);
	});
});


$(function () {
	$('.btn-danger').on('click', function () {
		var btn = $(this);
		btn.addClass('disable');
		var btn_after = btn.next();
		if (confirm('Are you sure you want to cancel ticket?')){
			btn_after.removeClass('disable');
		}else{
			btn.removeClass('disable');
		}
	});
});
*/


//Validatons
function profileValidator() {
	var npsw = $('#npsw').val();
	var cnpsw = $('#cnpsw').val();

	if (npsw == cnpsw) {
		return true;
	}
	$('.msg').text('New passwords do not match');
	return false;
};

function signValidator(e) {
	var psw = $('.passwd').val();
	var cpsw = $('.cpasswd').val();
	var num = $('.num').val();
	if (psw == cpsw) {
		if (num.length == 10) {
			return true;
		}
	}
	$('.msg').text('Invalid login details');
	return false;
};

$('#payfrom .btnsubmit').on('click',function(){
		var isValid = true;
		$('.form-field').each(function() {
		  if ( $(this).val() === '' )
			  isValid = false;
		});
		return isValid;
		return payWithRave();
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