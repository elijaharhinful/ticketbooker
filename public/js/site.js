//Set the width of the side navigation to 250px
function openNav() {
	$('#mySidenav').css('width', '250px');
}

//Set the width of the side navigation to 0
function closeNav() {
	$('#mySidenav').css('width', '0');

}
$(function(){
	$('#myCarousel').hide().fadeIn(3500);
	$('#download').hide().fadeIn(3500);
	$('#travelUs').hide().slideToggle(3500);
	$('#pricing').hide().fadeIn(6000);
	$('header').hide().fadeIn(3500);
	$("#dash").hide().slideToggle(3500);
	$("#mySidenav").hide().slideToggle(2000);
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

<<<<<<< HEAD
//For QrCode
var options = {
    // render method: 'canvas', 'image' or 'div'
    render: 'img',

    // version range somewhere in 1 .. 40
    minVersion: 1,
    maxVersion: 40,

    // error correction level: 'L', 'M', 'Q' or 'H'
    ecLevel: 'L',

    // offset in pixel if drawn onto existing canvas
    left: 0,
    top: 0,

    // size in pixel
    size: 100,

    // code color or image element
    fill: '#000',

    // background color or image element, null for transparent background
    background: null,

    // content
    text: 'no text',

    // corner radius relative to module width: 0.0 .. 0.5
    radius: 0,

    // quiet zone in modules
    quiet: 0,

    // modes
    // 0: normal
    // 1: label strip
    // 2: label box
    // 3: image strip
    // 4: image box
    mode: 0,

    mSize: 0.1,
    mPosX: 0.5,
    mPosY: 0.5,

    label: 'no label',
    fontname: 'sans',
    fontcolor: '#000',

    image: null
}

$("#selector").qrcode(options);
//end of QrCode
=======
$("#qr1").ClassyQR({
	type: 'text',
	text: 'This is the text to embed'
});


>>>>>>> ad31806a496bf9dc27e477c6e8a3adeb6338d367

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

<<<<<<< HEAD

=======
>>>>>>> ad31806a496bf9dc27e477c6e8a3adeb6338d367
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

$('#signupform').on('submit', function(){
	sendsignupdata();
});

$('#loginform').on('submit', function(){
	sendlogindata();
});

/*Acessing API
var mainAPIUrl = 'https://achatcryptostg.com/stcapp/public';


function getPrices() {
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
$(function(){
	axios.get(mainAPIUrl + "/companies")
	.then(
		function(response){
			var data = response.data
			alert(data);
		}
	)
	.catch(function(error){
		alert(error);
	})
});
*/

/* This is for the mazzuma integration
var requestPayload = {
	"price": 1,
	"network": "mtn",
	"recipient_number": "0548777676",
	"sender": "024xxxxxxx",
	"option": "rmta",
	"apikey": "27defb35646688a13b98fe4922b26ea0bbd5d321",
	"orderID": ""
  }

  
	var xhr = new XMLHttpRequest();
	xhr.open("POST", 'https://client.teamcyst.com/api_call.php', true);
  
	//Send the proper header information along with the request
	xhr.setRequestHeader("Content-type", "application/json");
  
	xhr.onreadystatechange = function() {
	  //Call a function when the state changes.
		if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
			// Request finished. Do processing here.
		}
	}
	//Replace requestPayload with the payload you would be sending
	xhr.send(requestPayload);
	*/