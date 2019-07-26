//Set the width of the side navigation to 250px
function openNav() {
	$('#mySidenav').css('width', '250px');
}

//Set the width of the side navigation to 0
function closeNav() {
	$('#mySidenav').css('width', '0');

}
$(function(){
	$('#download').hide().fadeIn(3500);
	$('#travelUs').hide().slideToggle(3500);
})

$(function () {
	var today = new Date();

	var elbookDate = document.getElementById('bookDate');
	elbookDate.textContent = today.toDateString();

	var elbooktime = document.getElementById('bookTime');
	elbooktime.textContent = today.toTimeString();
});

$(function () {
	$('#myNavbar ul li:eq(0)').addClass('active');
	$('#myNavbar ul li').on('click', function () {
		$('#myNavbar ul li').removeClass('active');
		$(this).addClass('active');
	});
});


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

$("#qr1").ClassyQR({
	type: 'text',
	text: 'This is the text to embed'
});

$('#gotop').gotop();


$(function () {
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

//Acessing API
var mainAPIUrl = 'http://achatcryptostg.com/stcapp/public';

/*function getPrices() {
	axios.get(mainAPIUrl + "/companydestinationdetails/1")
		.then(function (response) {
			data = response.data

			var $tableBody = $('<tbody></tbody>');
			var $row = $('<tr></tr>');
			$row.append($('<td></td>').text(data.d_from));
			$row.append($('<td></td>').text(data.d_to));
			$row.append($('<td></td>').text(data.journeyhrs));
			$row.append($('<td></td>').text(data.journeyhrs));
			$tableBody.append($row);
			$('thead').after($tableBody);

		})
}
*/
$('#signupform').on('submit', function(){
	sendsignupdata();
});

$('#loginform').on('submit', function(){
	sendlogindata();
});

function sendsignupdata(){
	var tel = $('#tel').val();
	var psw = $('#psw').val();
	var cpsw = $('#cpsw').val();
	axios.post(mainAPIUrl + "/signup", {phone:tel, password:psw})
	.then(
		function(response){
			var data = response.data
			if (tel == data.number){
				if (psw == data.password){
					return true;
				}
			}
		}
	)
	.catch(function(error){
		alert(error);
	});
}

//for login
function sendlogindata(){
	var tel = $('#tel').val();
	var psw = $('#psw').val();
	var cpsw = $('#cpsw').val();
	axios.post(mainAPIUrl + "/login", {phone:tel, password:psw})
	.then(
			function(response){
				var data = response.data
				if (tel == data.number){
					if (psw == data.password){
						return true;
					}
				}
			}
		)
		.catch(function(error){
			alert(error);
		});
}

//to get bus companies
function getbuscompanies(){
	axios.get(mainAPIUrl + "/companies")
	.then(
		function(response){
			var data = response.data
		}
	)
	.catch(function(error){
		alert(error);
	})
}

