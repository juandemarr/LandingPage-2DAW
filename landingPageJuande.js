var iniciado=true;
var vista=true;

$(function(){
    cargarServicios();
    
    $(window).on("scroll",function(){
        if($(window).scrollTop()+$(window).height() >= $("#servicios").position().top && iniciado){
            iniciado=false;
            cargarComentarios(); 
        }
    })
    setInterval(desvanecerComentarios,10000);
    
    $("#cambiarVista").on("click",function(){
        vista=!vista;
        cargarComentarios();
    })
    
    /*REVERSE GEOLOCATION*/
    
    let reverseGeocoder=new BDCReverseGeocode();
    reverseGeocoder.getClientLocation(function(result) {
        console.log(result.city);
    });
    
    /*VALIDACIÓN FORMULARIO*/
    
    validarFormulario();
    
    /*BOTONES*/
    
    $("#sub").on('click',function(){
        $("html").animate({
            scrollTop: $("#formulario").position().top
        },1500);
    })
    
    $("#subir").on('click',function(){
        $("html").animate({
            scrollTop: 0
        },1500);
    })
})

/*SERVICIOS*/

function cargarServicios(){
    $.ajax("json/servicios.json")
        .done(function(servicios){
            colocarServicios(servicios);
        })
        .fail(function(){
            setTimeout(cargarServicios,5000);
        })
}

function colocarServicios(servicios){
    for( i=0; i<5; i++){
        $("#servicios").append(
                        $("<div>").append($("<a href=\""+servicios.servicios[i].Enlace+"\">").append($("<p class=\"sTitulo\">").text(servicios.servicios[i].Titulo))
                        .append($("<p>").text(servicios.servicios[i].Texto))
                        .append($("<div class=\"divImagen\">").append($("<img src="+servicios.servicios[i].Imagen+">")))));
    }
}

/*COMENTARIOS*/

function cargarComentarios(){
    $.ajax("json/comentarios.json")
        .done(function(comentarios){
            if(vista)
                colocarComentarios(comentarios);
            else
                colocarComentarios2(comentarios); 
        })
        .fail(function(){
            setTimeout(cargarComentarios,5000);
        })
}

function colocarComentarios(comentarios){
    $("#comentarios").empty();
    
    let maxComentarios=comentarios.comentarios.length;
    
    for(let i=0; i<3; i++){
        let numAleatorio=Math.floor(Math.random()*maxComentarios);
        
        let contenedor=$("<div>").append($("<p class=\"cTitulo\">").text(comentarios.comentarios[numAleatorio].Nombre))
                         .append($("<p>").text(comentarios.comentarios[numAleatorio].Texto))
                         .append($("<p>").text(comentarios.comentarios[numAleatorio].Fecha))
                         .css({
                             "display":"none"
                         });
        $("#comentarios").append($(contenedor).fadeIn(2000));  
    }    
}

function colocarComentarios2(comentarios){
    $("#comentarios").empty();
    
    let maxComentarios=comentarios.comentarios.length;
    let tabla=$("<table>").css({
                            "display":"none"
                        });
    
    for(let i=0; i<3; i++){
        let numAleatorio=Math.floor(Math.random()*maxComentarios);
        
        let fila=$("<tr>")
                .append($("<td>").append($("<p>").text(comentarios.comentarios[numAleatorio].Nombre))
                                 .append($("<p>").text(comentarios.comentarios[numAleatorio].Texto))
                                 .append($("<p>").text(comentarios.comentarios[numAleatorio].Fecha)));
                                                           
        tabla.append($(fila));                              
    }  
    
    $("#comentarios").append($(tabla).fadeIn(2000));
}


/*FORMULARIO*/

function validarFormulario(){
    $("#name").keyup(function(){
        if ($("#name").val().length >= 4)
            $("#email").prop("disabled",false);
        else
            $("#email").prop("disabled",true);
    })
    $("#email").keyup(function(){
        let emailExp=new RegExp(/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/);
        if(emailExp.test($("#email").val()))
            $("#password").prop("disabled",false);
        else
            $("#password").prop("disabled",true);
    })
    $("#password").keyup(function(){
        if($("#password").val().length>=8)
            $("#password2").prop("disabled",false);
        else
            $("#password2").prop("disabled",true);
    })
    $("#password2").keyup(function(){
        if($("#password2").val()== $("#password").val()){
            $("#conExito").text("Las contraseñas coinciden");
            $("#conExito").css({
                "color":"lightgreen"
            })
        }else{
            $("#conExito").text("Las contraseñas no coinciden");
            $("#conExito").css({
                "color":"darkred"
            })
        }
    })
}

function desvanecerComentarios(){
    if(vista){
        $("#comentarios div").fadeOut(2000).promise().done(function(){
            cargarComentarios();
        })
    }else{
        $("#comentarios table").fadeOut(2000).promise().done(function(){
            cargarComentarios();
    })
    } 
}
