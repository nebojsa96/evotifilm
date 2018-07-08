var doc;
var filmovi = [];
var n;
var zanrovi = [];

var sel_zanr = [];
var ocena = 1;
var sort = "NASLOV";
var trazi = "";

function onLoad(){
    loadDoc();
}

function loadDoc(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200)
        {
            doc = JSON.parse(this.responseText);
            filmovi = doc.filmovi;
            n = filmovi.length;
            
            popuniZanr();
            osveziPrikaz();
        }
    };
    xmlhttp.open("GET","../json/filmovi.json",true);
    xmlhttp.send();
}


function popuniZanr(){
    var pom = [];

    for(var i=0; i<n; i++){
        pom = filmovi[i].zanrovi;
        for(var j=0; j<pom.length; j++)
            if(zanrovi.indexOf(pom[j]) < 0)
                zanrovi.push(pom[j]);  
    }
    var txt = "";
    for(var i=0; i<zanrovi.length; i++)
        txt += "<li><a class='dugme'>"+zanrovi[i]+"</a></li>";
    //onclick='klikniZanr(this);'
    $("#zanr").html(txt);
}


$( document ).ready(function() {
    loadDoc();
     /////////////////////////// PADAJUCI //////////////////////////
    $(".padajuci").hover(
        function(){
//            $(this).children(".podmeni").slideDown(200);
        },
        function(){
            $(this).children(".podmeni").slideUp(200);
        });
        
    $(".padajuci a:not(.dugme)").click(function(){
//        alert("radi");
        if( $(this).parent().children(".podmeni").css("display")==="none")
            $(this).parent().children(".podmeni").slideDown(200);
        else
            $(this).parent().children(".podmeni").slideUp(200);
    });
    
    

    
     ////////////////// KLIKNI ZANR, OCENA, SORT ///////////////////
    $(".podmeni").delegate('.dugme','click', function(){
        //console.log($(this).html());
        var dugme = $(this);
        
        if(dugme.parents("ul").attr("id") === "zanr")
        {
            if( dugme.hasClass("kliknuto") )
            {
                sel_zanr.splice(sel_zanr.indexOf(dugme.text()),1);
            }
            else{
                sel_zanr.push(dugme.text());
            }
        }
        else if(dugme.parents("ul").attr("id") === "ocena")
        {
            $("#ocena .dugme").removeClass("kliknuto");
            ocena = (dugme.text()).slice(2);
        }
        
        else if(dugme.parents("ul").attr("id") === "sort")
        {
            $("#sort .dugme").removeClass("kliknuto");
            sort = dugme.text();
        }
        
        dugme.toggleClass("kliknuto");
        osveziPrikaz();
    });
    
    
    ///////////////////// POKUPI SEARCH ///////////////////////
    
    $("#trazi").keyup(function(){
        var tekst = $(this).val();
        tekst = tekst.toLowerCase();
        tekst = tekst.trim();
        console.log(tekst);
        trazi = tekst;
        
        osveziPrikaz();
    });
        
});



function osveziPrikaz(){
     if(sort === "NASLOV") // ============================= SORT PO NASLOVU 
        filmovi.sort(function(a, b) {
            var nameA = a.naziv.toUpperCase(); // ignore upper and lowercase
            var nameB = b.naziv.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) 
                return -1;
            
            if (nameA > nameB) 
                return 1;
             
            return 0;
        });
    
    else if(sort === "GODINA") // ============================= SORT PO GODINI
        filmovi.sort(function(a, b) {
        return a.godina - b.godina;
        });
    else if(sort === "OCENA") // ============================= SORT PO OCENI
        filmovi.sort(function(a, b) {
        var a_ocena = Number(a.ocena.slice(0,1));
        var a_znak = a.ocena.slice(1);
        if(a_znak === "+")
            a_ocena += 0.25;
        else if(a_znak === "-")
            a_ocena -= 0.25;
        
        var b_ocena = Number(b.ocena.slice(0,1));
        var b_znak = b.ocena.slice(1);
        if(b_znak === "+")
            b_ocena += 0.25;
        else if(b_znak === "-")
            b_ocena -= 0.25;
        return a_ocena - b_ocena;
        });
    else if(sort === "IMDB OCENA") // ============================= SORT PO IMDB OCENI
        filmovi.sort(function(a, b) {
        return a.imdb_ocena - b.imdb_ocena;
        });
    
    
    
    var txt="";
    for(var i=0; i<n; i++)
    {
        var naziv = filmovi[i].naziv.toLowerCase();
        naziv = naziv.trim();
        
        var moze = true;
        for(var j=0; j<sel_zanr.length; j++)
        if(!filmovi[i].zanrovi.includes(sel_zanr[j])) 
        {
            moze = false;   // ===================================== BAR JEDAN SEL ZANR NIJE ZANR TR FILMA 
            break;
        }
        
        var tr_ocena = Number(filmovi[i].ocena.slice(0,1));
        var tr_znak = filmovi[i].ocena.slice(1);
        if(tr_znak === "+")
            tr_ocena += 0.25;
        else if(tr_znak === "-")
            tr_ocena -= 0.25;
     
        if(moze && tr_ocena >= ocena && naziv.indexOf(trazi)>-1 )
        {
            txt+="<div id='f"+i+"' class='film ukratko' onclick='promeniPrikaz(this);'>";
            txt+="<img id='slika' src='../images/filmovi/"+filmovi[i].slika+"'/>";
            txt+="<p class='naslov'><b>"+filmovi[i].naziv+"</b></p><p class='godina'> ("+filmovi[i].godina+")</p>";
            txt+="<p><b>Žanr: </b>"+filmovi[i].zanrovi+"</p>";
            txt+="<p><b>IMDB ocena: </b>"+filmovi[i].imdb_ocena+"</p>";
            txt+="<p><b>Trajanje: </b>"+filmovi[i].trajanje+"</p>";
            txt+="<p><b>Glumci: </b>"+filmovi[i].glumci+"</p>";
            txt+="<p class='opis_kratko'><b>Opis: </b>"+filmovi[i].kratko+"</p>";
            txt+="<p class='opis_detaljno'>"+filmovi[i].detaljno+"</p>";
            txt+="<p class='zakljucak'>"+filmovi[i].zakljucak+"</p>";
            txt+="<a class='link' target='_blank' href='"+filmovi[i].imdb+"'><b>IMDB stranica</b></a>";
            txt+="<p class='prikaz' onclick='promeniPrikaz(this.parentNode());'>Prikaži više...</p>";
            txt+="</div>";
        }
               
    }
    if(txt !== "")
        $("main").html(txt);
    else
        $("main").html("<p><b>Nema filmova koji zadovoljavaju Vaše kriterijume...</b></p>");
    
}

function promeniPrikaz(f){
    
    if($(f).hasClass("detaljno"))
    {
        $(f).toggleClass("detaljno ukratko");
        $(f).children(".prikaz").text("Prikaži više...");
    }
    else
    {
        $(f).toggleClass("ukratko detaljno");
        $(f).children(".prikaz").text("Prikaži manje...");
    
    }
}

