/*
jonathan suarez
*/
// clima api 
// http://api.openweathermap.org/data/2.5/weather?q=Valparaiso,Chile&appid=f64451c4d352b7d912a9c4f70e5ca9a2&units=metric
var _Bsf 	= 0; 
var _CLP 	= 0;
var _sw 	= 0;
var _Push 	= '';
var _Rport  = 0;

document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("pause", onPause, false);
document.addEventListener("resume", onResume, false);

function onDeviceReady() {
    console.log('App Ready');
    _Main(); // cargo el main
    _Admob(true); //cargo la publicidad
}

function onPause() {
    console.log('App en pausa');
    admob.destroyBannerView();
}

function onResume() {
    console.log('ready again');
    _Admob(); //cargo la publicidad
}

//inicialice the framework
var myApp = new Framework7({
		    material:true
		});


var $$ = Dom7;

var mainView = myApp.addView('.view-main');

/*
	....###....########..##.....##..#######..########.
	...##.##...##.....##.###...###.##.....##.##.....##
	..##...##..##.....##.####.####.##.....##.##.....##
	.##.....##.##.....##.##.###.##.##.....##.########.
	.#########.##.....##.##.....##.##.....##.##.....##
	.##.....##.##.....##.##.....##.##.....##.##.....##
	.##.....##.########..##.....##..#######..########.
*/



var _Admob = function (){

	admob.setOptions({
		publisherId:"ca-app-pub-2403039808675027/3185383390",  // Required 
		adSize: admob.AD_SIZE.SMART_BANNER,
		autoShowInterstitial: false,
		isTesting: false
	});

	// Start showing banners (atomatic when autoShowBanner is set to true) 
	admob.createBannerView();

	// Request interstitial (will present automatically when autoShowInterstitial is set to true) 
	admob.requestInterstitialAd();

}


//funtion main
var _Main = function (){

	
	/*window.FirebasePlugin.getToken(function(token) {
	// save this server-side and use it to push notifications to this device
		$$('#id').val(token);
	}, function(error) {
		myApp.alert(error, 'Error!');
	});*/
	//verifico si el user esta registrdo para las notificaciones

   /*   

	try{
		var _REG = myApp.formGetData('currencyjs');
		if (_REG.userIdGCM == true)
		{
			console.log('registrado');
			//modal of loader
		
			//load main web service
			loadServices();

	
		} else 
		{
			console.log('No registrado');
			prueba(1,1);
			
		}
	}catch(e){
		//console.log(e);
		console.log('No registrado');
		prueba(1,1);
	}
*/
	//click de refresh para el index
	$$('.js-refresh').on('click', function () {
		console.log('se ejecuto el click');
		loadServices();
	});

	//cilck envio del formulario de registro
	$$('.js-bto-rg').on('click', function () {
		myApp.showPreloader('Registrando...');
		Registro();
		
	});
	$$('.js-cierre').on('click', function () {
		loadServices();
	});
	
	loadServices();
	//register();
}

// remove the clase of floating button 
function ActClick(){
		 
		$('.speed-dial-opened').removeClass('speed-dial-opened');
		  
}

//funcion unificadora para cargar los servicion principales
var loadServices = function(){
	myApp.showPreloader('Cargando...');
	console.log('Recargar servicios principales');
	$$('#indices').html('');
	ServiceVEF(true);
    serviceCLP(true);
    btcVEF(true);
}

function fnLoader(){
	if (_sw == 1){
		myApp.hidePreloader();
		_sw = 0;
		return;
	}
}

//funcion para registrar los nombres y poder enviar los notificaciones
function Registro(){

	// validar los campos de registro
	var FormData = $('#form-registro').serialize();

	

	$.ajax({
		url: "http://jonmanuel.com.ve/api/register.php",
		dataType: "jsonp",
		crossDomain: true,
		data: FormData
	})
	.then( function ( data ) {
		/* json response
			(
				{
					"msg":"Error al registrar Telefono",
					"status":0
				}
			)
		*/
		console.log(data.msg);
		myApp.hidePreloader();
		prueba(0,0);
		loadServices();
		
	}).fail(function( jqXHR, textStatus, errorThrown ) {
			 myApp.hidePreloader();
			 myApp.alert('Vaya a ocurrido un error', 'Error 4410!');
	});
}

myApp.onPageInit('btc', function (page) {
	

	$$('.js-refresh-2').on('click', function () {
		myApp.showPreloader('Cargando...');
		$$('#indicesBTC').html('');
		btcCDS(true);
        btcVEF(true);
        btcClp(true);
        btcVEFsur(true);
	});
	 myApp.showPreloader('Cargando...');
	 $$('#indicesBTC').html('');
	 btcCDS(true);
     btcVEF(true);
     btcClp(true);
     btcVEFsur(true);
	 ActClick();
});

myApp.onPageBack('btc', function (page) {
	if (_Rport == 1){
		loadServices();
		_Rport = 0;
		console.log('back con reporte');
	} else {
		console.log('back sin reporte');
	}
	
});


myApp.onPageInit('about', function (page) {
	ActClick();

});


myApp.onPageBack('rep-btc', function (page) {
	_Rport = 1;
	console.log('activo evento');
});



myApp.onPageInit('calculator', function (page) {
	
	
	var clp = $('#clp');
	var usd = $('#usd');
	var bsf = $('#bsf');
	var indice = 0;

	clp.val('0');
	usd.val('0');
	bsf.val('0');

	//calculo del indice entre bolivar y pesos chilenos
	indice = _Bsf / _CLP;
	indice = numeral(indice).format('0,0.00');
	$('#factor').html("<h2>Factor de conversión~ "+indice+"</h2>");
	console.log(indice);
	function calcular(tp){
	
		var cambio = 0;
		//pesos chilenos
		if (tp == 1){
			usd.val('0');
			bsf.val('0');
			if (clp.val() == '')return;
			cambio =  parseFloat(clp.val()) / _CLP;
			usd.val(cambio.toFixed(2));
			cambio = cambio * _Bsf;
			bsf.val(cambio.toFixed(2));
		};
		// dolar
		if (tp == 2){
			clp.val('0');
			bsf.val('0');
			if (usd.val() == '') return;
			cambio =  parseFloat(usd.val()) *  _Bsf;
			bsf.val(cambio.toFixed(2));
			cambio = usd.val() * _CLP;
			clp.val(cambio.toFixed(2));
		};
		// bolivares
		if (tp == 3){
			usd.val('0');
			clp.val('0');
			if (bsf.val() == '') return;
			cambio =  parseFloat(bsf.val()) /  _Bsf;
			usd.val(cambio.toFixed(2));
			cambio = cambio * _CLP;
			clp.val(cambio.toFixed(2));
		};

	
	
	}
	// eventos de la calculadora

	  ///////
	 // 1 //
	///////
	$$('.js-fn-kp-1').on('keyup', function () {
		calcular(1);
	});
	
	
	$$('.js-fn-kp-1').on('focusout', function () {
		if (clp.val() == ''){
			clp.val('0');
		}
	});
	$$('.js-fn-kp-1').on('focus', function () {
		if (clp.val() == 0){
			clp.val('');
		}
	});

	  ///////
	 // 2 //
	///////
	$$('.js-fn-kp-2').on('keyup', function () {
		calcular(2);
	});

	$$('.js-fn-kp-2').on('focusout', function () {
		if (usd.val() == ''){
			usd.val('0');
		}
	});
	$$('.js-fn-kp-2').on('focus', function () {
		if (usd.val() == 0){
			usd.val('');
		}
	});

	  ///////
	 // 3 //
	///////
	$$('.js-fn-kp-3').on('keyup', function () {
		calcular(3);
	});

	$$('.js-fn-kp-3').on('focusout', function () {
		if (bsf.val() == ''){
			bsf.val('0');
		}
	});
	$$('.js-fn-kp-3').on('focus', function () {
		if (bsf.val() == 0){
			bsf.val('');
		}
	});
	ActClick();
});
/*
	.##......##.########.########......######..########.########..##.....##.####..######..########..######....
	.##..##..##.##.......##.....##....##....##.##.......##.....##.##.....##..##..##....##.##.......##....##...
	.##..##..##.##.......##.....##....##.......##.......##.....##.##.....##..##..##.......##.......##.........
	.##..##..##.######...########......######..######...########..##.....##..##..##.......######....######....
	.##..##..##.##.......##.....##..........##.##.......##...##....##...##...##..##.......##.............##...
	.##..##..##.##.......##.....##....##....##.##.......##....##....##.##....##..##....##.##.......##....##...
	..###..###..########.########......######..########.##.....##....###....####..######..########..######....
*/


/////////////////////////////////////
// servicio de venezuela dolartoday///
//////////////////////////////////////

// a esta se le agrego el iten nuevo para el historyal
function ServiceVEF(t){
		$.ajax({
			url: "https://s3.amazonaws.com/dolartoday/data.json",
			dataType: "json",
			crossDomain: true,
			async: t
		})
		.then( function ( data ) {
			
			var _USDP 	= numeral(parseFloat(data.USD.dolartoday)).format('0,0.00');
			var _USDD 	= numeral(parseFloat(data.USD.sicad2)).format('0,0.00');
			var _USDC 	= numeral(parseFloat(data.USD.efectivo_real)).format('0,0.00');
			var _USDCT 	= numeral(parseFloat(data.USD.transferencia)).format('0,0.00');
			var _USDPM 	= numeral(parseFloat(data.USD.promedio)).format('0,0.00');

			var _USDEU 	= numeral(parseFloat(data.EURUSD.rate)).format('0,0.00');
			var _USDVF 	= numeral(parseFloat(data.EUR.promedio)).format('0,0.00');
			var _USDGD 	= numeral(parseFloat(data.GOLD.rate)).format('0,0.00');

			var _USDPT 	= data.MISC.petroleo;
			var _USDRV 	= data.MISC.reservas;
			var _USDT 	= data._timestamp.dia;
			var _USDT2 	= data._timestamp.fecha_nice;
			
			var info = 	'<div class="card">'+
				    '	<div class="card-header"><i class="icon demo-icon-vnz left"></i>Mercado USD Venezuela</div>'+
					'		<div class="card-content">'+
					'			<div class="card-content-inner">'+
					'					<p>'+data._labels.a+': <strong>'+_USDP+'</strong> Bs.</p>'+
					'					<p>'+data._labels.a1+': <strong>'+_USDCT+'</strong> Bs.</p>'+
					'					<p>'+data._labels.c+': <strong>'+_USDD+'</strong> Bs.</p>'+
					'					<p>PETROLEO: <strong>'+_USDPT+'</strong> $</p>'+
					'					<p>RESERVAS BCV: <strong>'+_USDRV+'</strong> $ mm.</p>'+
					'					<p>VALOR VEF/Real: <strong>'+_USDC+'</strong> Bs.</p>'+
					'					<p>VALOR VEF/Promedio: <strong>'+_USDPM+'</strong> Bs.</p>'+
					'					<p>EURO/DOLAR: <strong>'+_USDEU+'</strong> $</p>'+
					'					<p>VEF/EURO: <strong>'+_USDVF+'</strong> Bs.</p>'+
					'					<p>USD/ORO: <strong>'+_USDGD+'</strong> $/Oz.</p>'+
					'			</div>'+
					'		</div>'+
					'	</div>'+
					'</div>';
	
			_Bsf =  parseFloat(data.USD.dolartoday);
			$$('#indices').append(info);
			fnLoader();
			_sw = 1;
		}).fail(function( jqXHR, textStatus, errorThrown ) {
			 myApp.hidePreloader();
			 myApp.alert('Vaya a ocurrido un error', 'Error 4401!');
		});
}
///////////////////////////////////////////////////////
//servicio BTC SURBITCOIN VENEZUELA  
// se le agrego el link         	     //
///////////////////////////////////////////////////////
function btcVEFsur(t){
	$.ajax({
		url: "https://api.blinktrade.com/api/v1/VEF/ticker?crypto_currency=BTC",
		dataType: "jsonp",
		crossDomain: true,
		async: t
	})
	.then( function ( data ) {
		var _Alto 	= numeral(parseInt(data.high)).format('0,0');
		var _Bajo 	= numeral(parseInt(data.low)).format('0,0');
		var _Compra = numeral(parseInt(data.buy)).format('0,0');
		var _Venta 	= numeral(parseInt(data.sell)).format('0,0');
		var _Last 	= numeral(parseInt(data.last)).format('0,0');
		var _BSB    = parseInt(data.buy) / parseInt(_BtcUsd);

		_BSB = _BSB.toFixed(2);
		
		var info = 	'<a href="#" class="item-link"><div class="card">'+
			    '	<div class="card-header cl-btc"><i class="icon demo-icon-vnz left"></i>SURBITCOIN BTC/VEF</div>'+
				'		<div class="card-content">'+
				'			<div class="card-content-inner">'+
				'					<p><span class="color-green">Alta: </span><strong>'+_Alto+' </strong>Bs.</p>'+
				'					<p><span class="color-red">Baja:</span> <strong>'+_Bajo+' </strong>Bs.</p>'+
				'					<p><span class="">Compra: </span><strong>'+_Compra+' </strong>Bs.</p>'+
				'					<p><span class="">Venta: </span><strong>'+_Venta+' </strong>Bs.</p>'+
				'					<p><span class="color-blue">Ultimo:</span> <strong>'+_Last+'</strong> Bs.</p>'+
				'			</div>'+
				'		</div>'+
				'	    <div class="card-footer"><strong>PAR BTC/USD:</strong>&nbsp;'+_BSB+' Bs.</div>'+
				'</div></a>';

		$$('#indicesBTC').append(info);
		myApp.hidePreloader();
	
	}).fail(function( jqXHR, textStatus, errorThrown ) {
			 myApp.hidePreloader();
			 myApp.alert('Vaya a ocurrido un error', 'Error 4402!');
	});
}
///////////////////////////////////////////////////////
//servicio BTC VENEZUELA - LOCALBITCOIN		         //
///////////////////////////////////////////////////////
function btcVEF(t){
	
	$.ajax({
		url: "http://api.bitcoinvenezuela.com/",
		dataType: "json",
		crossDomain: true,
		async: t
	})
	.then( function ( data ) {
		 	_BtcUsd 	= numeral(parseInt(data.BTC.USD)).format('0,0');
		var _BtcVef 	= numeral(parseInt(data.BTC.VEF)).format('0,0');
		var _BtcLBUsd 	= numeral(parseInt(data.LocalBitcoins_coupons.USD)).format('0,0');
		var _BtcLBXVE 	= numeral(parseInt(data.LocalBitcoins_coupons.XVE)).format('0,0');
		var _BtcTime 	= new Date(data.time.timestamp);

		
		var info = 	'<div class="card">'+
				    '	<div class="card-header cl-btc"><i class="icon demo-icon-vnz left"></i>Mercado BTC Venezuela</div>'+
					'		<div class="card-content">'+
					'			<div class="card-content-inner">'+
					'					<p>Valor BTC/USD: <strong>'+_BtcUsd+' </strong>$.</p>'+
					'					<p>Valor BTC/VEF: <strong>'+_BtcVef+'</strong> Bs.</p>'+
					'					<p>Valor BTC/LocalBTC ~:<strong>'+_BtcLBUsd+'</strong> $.</p>'+
					'					<p>Valor VEF/LocalBTC ~:<strong>'+_BtcLBXVE+'</strong> Bs.</p>'+
					'			</div>'+
					'		</div>'+
					'	</div>'+
					'</div>';

		$$('#indicesBTC').append(info);
	}).fail(function( jqXHR, textStatus, errorThrown ) {
			 myApp.hidePreloader();
			 myApp.alert('Vaya a ocurrido un error', 'Error 4403!');
	});
}
///////////////////////////////////////////////////////
//servicio para el cambio chileno segun banco central//
///////////////////////////////////////////////////////
function serviceCLP(t){
	

	$.ajax({
		url: "http://www.mindicador.cl/api",
		dataType: "json",
		crossDomain: true,
		async: t
	})
	.then( function ( data ) {
		/*$('#result2').html(data.uf.valor+'<br>'+
							data.dolar.valor+'<br>'+
							data.dolar.fecha+'<br>'+
							data.fecha);

		var txt = data.fecha.split("T");
		
		console.log(txt[0]);


		*/
		var _CUF 	= [data.uf.nombre,numeral(parseFloat(data.uf.valor)).format('0,0.00'),data.uf.fecha];
		var _CUSD 	= [data.dolar.nombre,numeral(parseFloat(data.dolar.valor)).format('0,0.00'),data.dolar.fecha];
		var _CUTM 	= [data.utm.nombre,numeral(parseFloat(data.utm.valor)).format('0,0.00'),data.utm.fecha];
		var _CLC 	= [data.libra_cobre.nombre,numeral(parseFloat(data.libra_cobre.valor)).format('0,0.00'),data.libra_cobre.fecha];
		var _EUR	= [data.euro.nombre,numeral(parseFloat(data.euro.valor)).format('0,0.00'),data.euro.fecha];
		var _IPC    = [data.ipc.nombre,numeral(parseFloat(data.ipc.valor)).format('0,0.00'),data.ipc.fecha];
		var _CID 	= [data.tasa_desempleo.nombre,numeral(parseFloat(data.tasa_desempleo.valor)).format('0,0.00'),data.tasa_desempleo.fecha];
		var _CMT 	= data.fecha;
		

		var info = 	'<div class="card">'+
			    '	<div class="card-header"><i class="icon demo-icon-clp left"></i>Mercado Chileno</div>'+
				'		<div class="card-content">'+
				'			<div class="card-content-inner">'+
				'					<p>'+_CUF[0]+': <strong>'+_CUF[1]+'</strong> CLP.</p>'+
				'					<p>'+_CUSD[0]+': <strong>'+_CUSD[1]+'</strong> CLP.</p>'+
				'					<p>Unidad Tri. Men. (UTM): <strong>'+_CUTM[1]+'</strong> CLP.</p>'+
				'					<p>'+_CLC[0]+': <strong>'+_CLC[1]+'</strong> USD.</p>'+
				'					<p>'+_EUR[0]+': <strong>'+_EUR[1]+'</strong> CLP.</p>'+
				'					<p>'+_IPC[0]+': <strong>'+_IPC[1]+'% </strong></p>'+
				'					<p>'+_CID[0]+': <strong>'+_CID[1]+'% </strong></p>'+
				'			</div>'+
				'		</div>'+
				'	</div>'+
				'</div>';

		_CLP =  parseFloat(data.dolar.valor);
		$$('#indices').append(info);
		fnLoader();
		_sw = 1;
	}).fail(function( jqXHR, textStatus, errorThrown ) {
			 myApp.hidePreloader();
			 myApp.alert('Vaya a ocurrido un error', 'Error 4404!');
	});
}
////////////////////////////////////////////
//servicio BTC COINDESK          	     //
//////////////////////////////////////////
function btcCDS(t){
	$.ajax({
		url: "http://api.coindesk.com/v1/bpi/currentprice/CNY.json",
		dataType: "json",
		crossDomain: true,
		async: t
	})
	.then( function ( data ) {
		var _BTCCDur 	= ['Valor BTC/USD',data.bpi.USD.rate,' $'];
		var _BTCCDurf 	= ['Valor BTC/USD',numeral(parseFloat(data.bpi.USD.rate_float)).format('0.0'),' $'];
		var _BTCCDyr  	= ['Valor BTC/CNY',data.bpi.CNY.rate,' ¥'];
		var _BTCCDyrf 	= ['Valor BTC/CNY',numeral(parseFloat(data.bpi.CNY.rate_float)).format('0.0'),' ¥'];
		var _BTCCDt 	= ['Fecha',data.time.updated,''];

		var info = 	'<div class="card">'+
		    '	<div class="card-header cl-btc"><i class="icon demo-icon-usa left"></i>COINDESK BTC/USD</div>'+
			'		<div class="card-content">'+
			'			<div class="card-content-inner">'+
			'					<p>'+_BTCCDur[0]+': <strong>'+_BTCCDur[1]+' </strong>'+_BTCCDur[2]+'</p>'+
			'					<p>'+_BTCCDyr[0]+': <strong>'+_BTCCDyr[1]+'</strong>'+_BTCCDyr[2]+'</p>'+
			'					<p>'+_BTCCDt[0]+':<strong>'+_BTCCDt[1]+'</strong>'+_BTCCDt[2]+'</p>'+
			'			</div>'+
			'		</div>'+
			'	</div>'+
			'</div>';

		$$('#indicesBTC').append(info);
	}).fail(function( jqXHR, textStatus, errorThrown ) {
			 myApp.hidePreloader();
			 myApp.alert('Vaya a ocurrido un error', 'Error 4405!');
	});
}
////////////////////////////////////////////////////
//servicio BTC SURBITCOIN CHILE           	     //
//////////////////////////////////////////////////
function btcClp(t){
	$.ajax({
		url: "https://api.blinktrade.com/api/v1/CLP/ticker?crypto_currency=BTC",
		dataType: "jsonp",
		crossDomain: true,
		async: t
	})
	.then( function ( data ) {
		var _Alto 	= numeral(parseInt(data.high)).format('0,0');
		var _Bajo 	= numeral(parseInt(data.low)).format('0,0');
		var _Compra = numeral(parseInt(data.buy)).format('0,0');
		var _Venta 	= numeral(parseInt(data.sell)).format('0,0');
		var _Last 	= numeral(parseInt(data.last)).format('0,0');

		
		var info = 	'<div class="card">'+
			    '	<div class="card-header cl-btc"><i class="icon demo-icon-clp left"></i>CHILECOIN BTC/CLP</div>'+
				'		<div class="card-content">'+
				'			<div class="card-content-inner">'+
				'					<p><span class="color-green">Alta: </span><strong>'+_Alto+' </strong>$ CLP.</p>'+
				'					<p><span class="color-red">Baja:</span> <strong>'+_Bajo+' </strong>$ CLP.</p>'+
				'					<p><span class="">Compra: </span><strong>'+_Compra+' </strong>$ CLP.</p>'+
				'					<p><span class="">Venta: </span><strong>'+_Venta+' </strong>$ CLP.</p>'+
				'					<p><span class="color-blue">Ultimo:</span> <strong>'+_Last+' </strong>$ CLP.</p>'+
				'			</div>'+
				'		</div>'+
				'	</div>'+
				'</div>';

		$$('#indicesBTC').append(info);
		myApp.hidePreloader();
	}).fail(function( jqXHR, textStatus, errorThrown ) {
			 myApp.hidePreloader();
			 myApp.alert('Vaya a ocurrido un error', 'Error 4406!');
	});
}

////////////////////////////////////////////////////////////////////////
//////////////////////////// F  I  N //////////////////////////////////
//////////////////////////////////////////////////////////////////////


// metodo que hace el calback a google
function register() {
	
	/*myApp.showPreloader('Identificando...');
	FCMPlugin.getToken(
      function(token){
        $$('#id').val(token);
        myApp.hidePreloader();
      },
      function(err){
       //aler
       	 myApp.alert('Vaya a ocurrido un error', 'Error FCM 01!');
      }
    );
	FCMPlugin.onNotification(
      function(data){
        if(data.wasTapped){
         	var mss = data.data.USD +'<br>'+ data.data.VEF +'<br>'+ data.data.BTC;
          	//Notification was received on device tray and tapped by the user. 
          	myApp.alert(mss, 'Resumen Diario', function () {
       			loadServices();
    		});
        }

      },
      function(msg){
        console.log('onNotification callback successfully registered: ' + msg);
      },
      function(err){
        console.log('Error registering onNotification callback: ' + err);
      }
    );
	*/
	
}
         


function prueba(tp,v){
	

	if (tp == 1){
		//usuario no registrado
		
		//setTimeout(gcm(), 3000);
		//myApp.loginScreen();
		//call google cloud services
		//register();

		
	}else{
		myApp.closeModal();
		//usuario registrado
		myApp.formStoreData('currencyjs', {
			'userIdGCM': true
		});
	}
}