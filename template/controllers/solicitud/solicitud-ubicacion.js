var $$ = document.querySelector.bind(document);
var opcionesDireccion = $$('#opcionesDireccion'), //select de opciones de direccion, cuando son muchas
    inputsAddressNode = $$('#inputsAddress'), //div oculto de las info de la direccion
    mapNode = $$('#map'); //div del mapa
var map = null; //variable global del objeto map de google
var marker = null; //objeto que guardara el marcador en el mapa
//declara e inicializa Geocoder
var Geocoder = null;
var latTienda, lngTienda;
//cambia a geocoder al objeto de geocoder de google, para encontrar direcciones
Geocoder = new google.maps.Geocoder();

//inicializamos el mapa de google, lo ubicamos en mexico
map = new google.maps.Map(mapNode, {
    zoom: 5,
    center: {
        lat: 23.634501,
        lng: -102.55278399999997
    }
});
var edo = $$('#edo'),
    muni = $$('#muni'),
    cd = $$('#cd'),
    col = $$('#col'),
    cp = $$('#cp'),
    calle = $$('#calle'),
    next = $$('#next'),
    nint = $$('#nint');

$(function() {

    map.addListener('click', function(e) {
        console.log(e);
        crearMarcador(e.latLng);
    });

    $("#mapInfo").on('change', '#medio_venta', function () {
        var celular = $("#celular").val();
        var opc = $(this).val();
        console.log(opc);
        if(opc === 'SMS' || opc === 'WhatsApp'){
            $("#regcel").attr('hidden', false);
            $("#rcel").val(celular).attr('required', true);
        }else if(opc !== 'SMS' || opc !== 'WhatsApp'){
            $("#regcel").attr('hidden', true);
            $("#rcel").val('').attr('required', false);
        }else if(opc === ''){
            $("#regcel").attr('hidden', true);
            $("#rcel").val('').attr('required', false);
        }
    });

    $("#mapInfo").on('click', '.radio-check', function () {
        var opc = $(this).val();
        $("#address").val('');
        $(".radio-check").attr('required', true);
        mapNode.parentElement.classList.add('hide'); //ocultamos el mapa, siempre que se cambie un radio
        inputsAddressNode.classList.add('hide'); //ocultamos los inputs
        $("#opcionesDireccion").attr('required', false);
        opcionesDireccion.closest('.form-row').classList.add('hide'); //ocultamos el select
        $("#opcionesDireccion").empty();
        $("#opcionesDireccion").html(`<option value="">Seleccione una dirección</option>`);
        $("#inputsAddress input").val('');
        $("#inputsAddress input").attr('required', false);
        if(opc === 'si'){
            $("#address").attr('required', true);
            $("#address").attr('placeholder', 'Ingresa el Código Postal de tu localidad y presiona el boton azul "Localizar en Maps"');
            $(".radio-check").attr('required', false);
        }else if(opc === 'no'){
            $("#address").attr('required', true);
            $("#address").attr('placeholder', 'Ingresa la dirección del Punto de Venta, Ciudad, etc... y presiona el boton azul "Localizar en Maps');
            $(".radio-check").attr('required', false);
        }
        $("#localizar").attr('hidden', false);
    });

    $("#mapInfo").on('click', '#searchLocation', function () {
        let dir = ($("#address").val());
        if (dir.length !== '')
            Geocoder.geocode({
                address: dir
            }, mostrarDirecciones);
        else {
            map.setCenter({
                lat: 23.634501,
                lng: -102.55278399999997
            });
            map.setZoom(5);
        }
    });

    $("#mapInfo").on('change','#opcionesDireccion', function () {
        let position = $(this).val();
        if (position === ''){return;}
        position = JSON.parse(position);
        crearMarcador(position); //crea el marcador con la ubicacion
        Geocoder.geocode({
            location: position
        }, function(result, status) {
            // console.log(result, status);
            fillForm(result[0]);
            mapNode.parentElement.classList.remove(
                'hide'); //mostramos el mapa, siempre que se cambie un radio
            inputsAddressNode.classList.remove('hide'); //mostramos los inputs
        });
    })

    $(".nuevo-usuario").on('submit', '#mapInfo', function (ev) {
        ev.preventDefault();
        var form = this.id;
        guardar(form);
    })
});
//solo numeros
function soloNum(e) {
    var keynum = window.event ? window.event.keyCode : e.which;
    if (keynum <= 13 || ((keynum >= 48) && (keynum <= 57)))
        return true;
    else
        return false;
}

function mostrarDirecciones(result, status) {
    $("#inputsAddress input").attr('required', true);
    $("#nint").attr('required', false);
    switch (status) {
        case 'OK':
            if (result.length === 1) { //si solo hay un resultado lo mostramos directamente, osea creamos marcador
                let lat = result[0].geometry.location.lat();
                let lng = result[0].geometry.location.lng();
                //Creamos el marcador en el mapa
                crearMarcador({
                    lat,
                    lng
                });
                //Llenamos el formulario automaticamente
                fillForm(result[0]);
                mapNode.parentElement.classList.remove(
                    'hide'); //mostramos el mapa, siempre que se cambie un radio
                inputsAddressNode.classList.remove('hide'); //mostramos los inputs

            } else {
                //si aparecen mas resultados, los ponemos en el select y que el cliente seleccione la ubicacion correcta
                //limpiamos marcadores en el mapa y lo alejamos
                map.setCenter({
                    lat: 23.634501,
                    lng: -102.55278399999997
                }); //para que se vea q debe seleccionar una opcion, alejamos el mapa
                map.setZoom(5);

                if (marker !== null) //si ya hay un marcador
                    marker.setMap(null); //eliminamos el marcador existente
                opcionesDireccion.closest('.form-row').classList.remove('hide'); //mostramos el select

                //eliminamos las opciones si es que existieran
                opcionesDireccion.querySelectorAll('option:not(:first-child)').forEach(item => {
                    opcionesDireccion.removeChild(item);
                });

                //creamos las opciones del select
                const doc = document.createDocumentFragment();
                for (let item of result) {
                    let lat = item.geometry.location.lat();
                    let lng = item.geometry.location.lng();
                    let latLng = JSON.stringify({
                        lat,
                        lng
                    });

                    let option = document.createElement('option');
                    option.value = latLng;
                    option.textContent = item.formatted_address;
                    doc.appendChild(option);
                }
                console.log(doc);
                if(doc){
                    $("#opcionesDireccion").attr('required', true);
                    console.log("Algo");
                }
                opcionesDireccion.appendChild(doc); //las añadimos con la ubicacion en el value

                opcionesDireccion.focus();
            }

            break;
        case 'ZERO_RESULTS':
            Swal.fire('Error', 'La ubicación no fue encontrada en el mapa, verifique si esta bien escrito, o sea más preciso por favor', 'error');
            //alert('La ubicación no fue encontrada en el mapa, verifique si esta bien escrito, o sea más preciso por favor');
            break;
        default:
            Swal.fire('Error', 'Debe de ingresar el Código Postal o Dirección', 'error');
            //alert('Error ' + status + "\n Reintente a buscar la dirección o Capture la ubicación manualmente");
            break;
    }
}

function crearMarcador(position) {
    
    if (marker !== null)
        marker.setMap(null); //eliminamos el marcador existente

    //crea el marcador, arrastrable en la posicion
    marker = new google.maps.Marker({
        draggable: true,
        animation: google.maps.Animation.DROP,
        position, //{lat: 23.634501, lng: -102.552783999997}
        title: 'Arrastra a tu dirección',
    });

    map.setCenter(position); //centra el mapa
    map.setZoom(17); //hace un gran zoom

    marker.setMap(map);
    nuevaPosicionMarcador(marker);

    //tengo duda si esto funcionara y no se acumularan eventos al marcador *** aparentemente funciono perfecto
    // google.maps.event.addListener(marker, 'dragend', ()=>{ nuevaPosicionMarcador(marker.getPosition) });
    google.maps.event.addListener(marker, 'dragend', () => {
        nuevaPosicionMarcador(marker);
    });
}

function fillForm(ubicacion) {
    //edo.value = muni.value = cd.value = col.value = cp.value = calle.value = next.value = nint.value = ''; //limpiamos formulario
    $("#inputsAddress input").val('');
    $("#inputsAddress input").attr('required', true);
    $("#nint").attr('required', false);
    for (let item of ubicacion.address_components) {

        let type = item.types[0];

        if (type === 'country') {
            var pais = item.long_name;
        } else if (type === 'administrative_area_level_1') {
            edo.value = item.long_name;
        }
            // else if( type === 'sublocality' ){
            //   muni.value = item.long_name;
        // }
        else if (type === 'locality') {
            muni.value = item.long_name;
            cd.value = item.long_name;
        } else if (type === 'political' || type === 'neighborhood') { //
            col.value = item.long_name;
        } else if (type === 'postal_code') {
            cp.value = item.long_name;
        } else if (type === 'route') {
            calle.value = item.long_name;
        } else if (type === 'street_number') {
            next.value = item.long_name;
        }
    }
}

function nuevaPosicionMarcador() {
    // console.log('marker', pos);
    // console.log('el marcador se movio');
    let lat = marker.getPosition().lat();
    let lng = marker.getPosition().lng();
    let position = {
        lat,
        lng
    };
    Geocoder.geocode({
        location: position
    }, function(result, status) {
        fillForm(result[0]);
        // console.log('cuando se mueve el marcador por latLng', result, status)
    });

    latTienda = lat;
    lngTienda = lng;
}

function guardar(form) {
    let payload = $("#" + form).serializeArray();
    payload.push({name: "function", value: 'nuevoUsuario'});
    payload.push({name: "lat", value: latTienda});
    payload.push({name: "lng", value: lngTienda});
    console.log(payload);
    
    $.ajax({
        url: 'php/data.php',
        type: 'POST',
        dataType: 'JSON',
        data: payload,
        beforeSend: function () {
            Swal.fire({
                title: 'Cargando',
                onOpen: () => {
                    swal.showLoading()
                },
                allowOutsideClick: false,
                allowEscapeKey: false
            });
        },
        success: function (data) {
            Swal.close();
            if (data.status === 1) {
                Swal.fire({
                    title: "Éxito",
                    text: data.msg,
                    type: "success",
                    onClose: () => {
                        $('#content').load('views/listado_usuarios.php');
                    },
                });
            } else {
                Swal.fire('Error', data.msg, 'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            Swal.close();
            //console.log(xhr);
        },
        complete: function () {
            //console.log('se hizo la peticion');
        }
    });
}