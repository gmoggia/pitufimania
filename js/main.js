var nombre_value;
var telf_value;
var email_value;
var edad_value;
var codigo_value;

$( document ).ready(function() {
   'use strict';

   $('#home').on("click", gotoInicio);

	$('#registrar_btn').click(function() {

    // esto es para validar datos
		if(validarDatos())
			inscribirEquipo();
    });

	$('#form-registro input.numero').keypress(function(ev) {
		var keyCode = window.event ? ev.keyCode : ev.which;
			//codes for 0-9
			if (keyCode < 48 || keyCode > 57) {
			//codes for backspace, delete, enter
			if (keyCode != 0 && keyCode != 8 && keyCode != 13 && !ev.ctrlKey) {
				ev.preventDefault();
			}
		}
	});

	$('#aceptar_btn').click(function() {
		$('#avisos').hide();
    });

	setTimeout(function() {
									$('#avisos').show();
									$('#avisos').css("display", "flex");
									$('#avisos').css("display", "-ms-flexbox");
									$('#avisos').css("display", "-webkit-flex");
								}, 3000);

});

function showProgress() {
	$('#progress').show();
	$('#progress').css("display", "flex");
	$('#progress').css("display", "-ms-flexbox");
    $('#progress').css("display", "-webkit-flex");
}

function hideProgress() {
	$('#progress').hide();
}

function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
	vars[key] = value;
	});
	return vars;
}

function ValidateEmail(mail)
{
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
	{
		return (true)
	}
	/*alert("You have entered an invalid email address!")*/
	return (false)
}

function validarDatos() {

	var f = document.getElementById("form-registro");

	nombre_value = f.nombre.value;
	telf_value = f.telf.value;
	email_value = f.email.value;
	edad_value = f.edad.value;
	codigo_value = f.codigo.value;

	if (nombre_value == "") {
		alert("Ingresa tu nombre y apellido");
		f.nombre.focus();
		return false;
	}

	if (telf_value == "") {
		alert("Ingresa tu teléfono");
		f.telf.focus();
		return false;
	}

	if (!ValidateEmail(email_value)) {
		alert("Ingresa un correo válido");
		f.email.focus();
		return false;
	}

	if (edad_value == "") {
		alert("Ingresa tu edad");
		f.edad.focus();
		return false;
	}

	if (codigo_value == "") {
		alert("Ingresa el código");
		f.codigo.focus();
		return false;
	}

	return true;
}

function inscribirEquipo() {
	// una ventana de proceso para tapar todo
	showProgress();


	$.post("scripts/registro.php", { nombreyapellido: nombre_value, telefono: telf_value, correo: email_value, edad: edad_value, codigoingresado: codigo_value },
					function(data)
					{
						hideProgress();

						var validacion = data[0].validacion;//1: success, 0: ya ingresado, -1: no existe, -2: error
						var premio = data[0].premio;

						if(validacion == -2)//error
						{
							alert("Hubo un error, intenta nuevamente");
							// aca se abre la ventana de proceso
						}
						else if(validacion == -1)//codigo no existe
						{
							alert("Código incorrecto");
							// aca se abre la ventana de proceso
						}
						else if(validacion == 0)//codigo ya ingresado
						{
							alert("Código ya ingresado");
							// aca se abre la ventana de proceso
						}
						else if(validacion == 1)//exito
						{
							$('#kv').hide();
							$('#pitufos-registro').hide();
							$('.form-container').hide();

							$('#premio').show();
							$('#pitufos-premio').show();

							if(premio != "n/a")
							{
								$('#premio img:nth-child(2)').attr('src', 'img/ganaste.png');
								$('#premio img:nth-child(3)').attr('src', 'img/premios/'+premio+'.png');

								$('#pitufos-premio img:nth-child(1)').attr('src', 'img/pitufos2_mobile.png');
								$('#pitufos-premio img:nth-child(2)').attr('src', 'img/pitufos2.png');

								if(premio == "entradas")
									premio = "3 Entradas al Cine";

								$('#premio h1').html(premio);

								setTimeout(function() {
									$('#avisos').show();
									$('#avisos').css("display", "flex");
									$('#avisos').css("display", "-ms-flexbox");
									$('#avisos').css("display", "-webkit-flex");
								}, 3000);
							}
							else
							{
								$('#premio img:nth-child(2)').attr('src', 'img/sigueparticipando.png');
								$('#premio img:nth-child(3)').attr('src', '');

								$('#premio img:nth-child(2)').css({"margin-top": "10%", "max-width": "734px"});
								//$('#premio img:nth-child(2)').css({"margin-top": "0%", "max-width": "527px"}); PARA RESETEAR

								$('#pitufos-premio img:nth-child(1)').attr('src', 'img/gargamel_mobile.png');
								$('#pitufos-premio img:nth-child(2)').attr('src', 'img/gargamel.png');

								$('#premio h1').hide();
							}
							$('#home').html("INGRESAR OTRO CODIGO");
							$('#home').off("click", gotoInicio);
							$('#home').on("click", gotoOtroCodigo);
						}

					}, "json");
}

// esto es para ir por otro codigo
function gotoOtroCodigo()
{
	$('#kv').show();
	$('#pitufos-registro').show();
	$('.form-container').show();

	$('#premio').hide();
	$('#pitufos-premio').hide();

	$('#home').off("click", gotoOtroCodigo);
	$('#home').on("click", gotoInicio);
	$('#home').html("VOLVER AL INICIO");

	$('#nombre').val(nombre_value);
	$('#telf').val(telf_value);
	$('#email').val(email_value);
	$('#edad').val(edad_value);
	$('#codigo').val("");
}

function gotoInicio()
{
	window.location.href = "index.html";
}

function getParameterByName(name, data) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec("?"+data);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
