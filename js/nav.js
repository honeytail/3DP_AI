$("#sidebarToggle").click(function(){

    console.log("!");

    $('#sidenav').toggleClass('toggled');
    $('#nav-link1').toggleClass('toggled-link');
    $('#nav-link2').toggleClass('toggled-link');
    $('#nav-link3').toggleClass('toggled-link');
    $('#nav-link-span1').toggleClass('toggle-span');
    $('#nav-link-span2').toggleClass('toggle-span');
    $('#nav-link-span3').toggleClass('toggle-span');
    $('#toggle-icon').html('arrow_back_ios');
});

$("#mobile_sidetoggle").click(function(){

    $('#sidenav').toggleClass('m-sidenav');
    
});
